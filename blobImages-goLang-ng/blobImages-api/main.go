// main.go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/container"
	"github.com/joho/godotenv"
)

// BlobInfo represents blob information returned by the API
type BlobInfo struct {
	Name         string            `json:"name"`
	Size         int64             `json:"size"`
	LastModified time.Time         `json:"lastModified"`
	ContentType  string            `json:"contentType,omitempty"`
	ETag         string            `json:"etag,omitempty"`
	Metadata     map[string]string `json:"metadata,omitempty"`
}

// ListBlobsResponse represents the API response for listing blobs
type ListBlobsResponse struct {
	Container string     `json:"container"`
	Blobs     []BlobInfo `json:"blobs"`
	Count     int        `json:"count"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

// BlobService handles Azure blob operations
type BlobService struct {
	client        *azblob.Client
	containerName string
}

// NewBlobService creates a new blob service
func NewBlobService() (*BlobService, error) {
	accountName := os.Getenv("AZURE_STORAGE_ACCOUNT_NAME")
	containerName := os.Getenv("AZURE_STORAGE_CONTAINER_NAME")
	connectionString := os.Getenv("AZURE_STORAGE_CONNECTION_STRING")

	if containerName == "" {
		return nil, fmt.Errorf("AZURE_STORAGE_CONTAINER_NAME environment variable is required")
	}
	// Convert to lowercase to follow Azure naming rules
	containerName = strings.ToLower(containerName)

	var client *azblob.Client
	var err error

	if connectionString != "" {
		// Using connection string
		client, err = azblob.NewClientFromConnectionString(connectionString, nil)
		if err != nil {
			return nil, fmt.Errorf("failed to create blob client from connection string: %v", err)
		}
	} else if accountName != "" {
		// Using DefaultAzureCredential
		cred, err := azidentity.NewDefaultAzureCredential(nil)
		if err != nil {
			return nil, fmt.Errorf("failed to create credential: %v", err)
		}

		serviceURL := fmt.Sprintf("https://%s.blob.core.windows.net/", accountName)
		client, err = azblob.NewClient(serviceURL, cred, nil)
		if err != nil {
			return nil, fmt.Errorf("failed to create blob client: %v", err)
		}
	} else {
		return nil, fmt.Errorf("either AZURE_STORAGE_ACCOUNT_NAME or AZURE_STORAGE_CONNECTION_STRING must be set")
	}

	return &BlobService{
		client:        client,
		containerName: containerName,
	}, nil
}

// ListBlobs returns all blobs in the container
func (bs *BlobService) ListBlobs(ctx context.Context, prefix string) (*ListBlobsResponse, error) {
	var blobs []BlobInfo

	options := &azblob.ListBlobsFlatOptions{
		Include: container.ListBlobsInclude{
			Metadata: true,
			Tags:     true,
		},
	}

	// Add prefix filter if provided
	if prefix != "" {
		options.Prefix = &prefix
	}

	pager := bs.client.NewListBlobsFlatPager(bs.containerName, options)

	for pager.More() {
		resp, err := pager.NextPage(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to list blobs: %v", err)
		}

		for _, blob := range resp.Segment.BlobItems {
			blobInfo := BlobInfo{
				Name:         *blob.Name,
				Size:         *blob.Properties.ContentLength,
				LastModified: *blob.Properties.LastModified,
			}

			// Add optional properties if available
			if blob.Properties.ContentType != nil {
				blobInfo.ContentType = *blob.Properties.ContentType
			}
			if blob.Properties.ETag != nil {
				blobInfo.ETag = string(*blob.Properties.ETag)
			}

			// Add metadata if present
			if blob.Metadata != nil {
				blobInfo.Metadata = make(map[string]string)
				for key, value := range blob.Metadata {
					if value != nil {
						blobInfo.Metadata[key] = *value
					}
				}
			}

			blobs = append(blobs, blobInfo)
		}
	}

	return &ListBlobsResponse{
		Container: bs.containerName,
		Blobs:     blobs,
		Count:     len(blobs),
	}, nil
}

// HTTP Handlers

// listBlobsHandler handles GET /blobs
func (bs *BlobService) listBlobsHandler(w http.ResponseWriter, r *http.Request) {
	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Get query parameters
	prefix := r.URL.Query().Get("prefix")

	// Create context with timeout
	ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
	defer cancel()

	// List blobs
	response, err := bs.ListBlobs(ctx, prefix)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "InternalServerError",
			Message: fmt.Sprintf("Failed to list blobs: %v", err),
		})
		return
	}

	// Return success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// healthHandler handles GET /health
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"time":   time.Now().UTC().Format(time.RFC3339),
	})
}

// setupRoutes configures HTTP routes
func setupRoutes(blobService *BlobService) *http.ServeMux {
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /health", healthHandler)

	// Blob operations
	mux.HandleFunc("GET /blobs", blobService.listBlobsHandler)

	return mux
}

// loggingMiddleware logs HTTP requests
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Call the next handler
		next.ServeHTTP(w, r)

		// Log the request
		log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
	})
}

func main() {
	// Load .env file if it exists (optional)
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found or error loading it: %v", err)
	}

	// Debug: Print environment variables (remove in production)
	log.Printf("AZURE_STORAGE_CONTAINER_NAME: %s", os.Getenv("AZURE_STORAGE_CONTAINER_NAME"))
	log.Printf("AZURE_STORAGE_ACCOUNT_NAME: %s", os.Getenv("AZURE_STORAGE_ACCOUNT_NAME"))
	hasConnectionString := os.Getenv("AZURE_STORAGE_CONNECTION_STRING") != ""
	log.Printf("AZURE_STORAGE_CONNECTION_STRING set: %t", hasConnectionString)

	// Create blob service
	blobService, err := NewBlobService()
	if err != nil {
		log.Fatalf("Failed to create blob service: %v", err)
	}

	// Setup routes
	mux := setupRoutes(blobService)

	// Add logging middleware
	handler := loggingMiddleware(mux)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("Starting Azure Blob API server on port %s", port)
	log.Printf("Health check: http://localhost:%s/health", port)
	log.Printf("List blobs: http://localhost:%s/blobs", port)
	log.Printf("List blobs with prefix: http://localhost:%s/blobs?prefix=documents/", port)

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
