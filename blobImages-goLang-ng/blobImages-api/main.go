// main.go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
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

// UploadResponse represents the response after uploading a blob
type UploadResponse struct {
	Name        string            `json:"name"`
	Size        int64             `json:"size"`
	ContentType string            `json:"contentType"`
	ETag        string            `json:"etag"`
	Metadata    map[string]string `json:"metadata,omitempty"`
	Message     string            `json:"message"`
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

// DownloadBlob downloads a blob with its metadata
func (bs *BlobService) DownloadBlob(ctx context.Context, blobName string) ([]byte, *BlobInfo, error) {
	// Get blob properties first to retrieve metadata
	resp, err := bs.client.DownloadStream(ctx, bs.containerName, blobName, nil)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to download blob: %v", err)
	}
	defer resp.Body.Close()

	// Read the blob content
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to read blob content: %v", err)
	}

	// Create BlobInfo with metadata
	blobInfo := &BlobInfo{
		Name:         blobName,
		Size:         *resp.ContentLength,
		LastModified: *resp.LastModified,
	}

	if resp.ContentType != nil {
		blobInfo.ContentType = *resp.ContentType
	}
	if resp.ETag != nil {
		blobInfo.ETag = string(*resp.ETag)
	}

	// Add metadata if present
	if resp.Metadata != nil {
		blobInfo.Metadata = make(map[string]string)
		for key, value := range resp.Metadata {
			if value != nil {
				blobInfo.Metadata[key] = *value
			}
		}
	}

	return data, blobInfo, nil
}

// UploadBlob uploads a blob with metadata
func (bs *BlobService) UploadBlob(ctx context.Context, blobName string, data []byte, contentType string, metadata map[string]string) (*UploadResponse, error) {
	options := &azblob.UploadStreamOptions{}

	// Add metadata
	if metadata != nil {
		options.Metadata = make(map[string]*string)
		for key, value := range metadata {
			v := value
			options.Metadata[key] = &v
		}
	}

	// Upload the blob
	resp, err := bs.client.UploadStream(ctx, bs.containerName, blobName, strings.NewReader(string(data)), options)
	if err != nil {
		return nil, fmt.Errorf("failed to upload blob: %v", err)
	}

	// If we have a content type, update it with a separate call
	// if contentType != "" {
	// 	_, err = bs.client.SetHTTPHeaders(ctx, bs.containerName, blobName, azblob.BlobHTTPHeaders{
	// 		BlobContentType: &contentType,
	// 	}, nil)
	// 	if err != nil {
	// 		log.Printf("Warning: Failed to set content type: %v", err)
	// 	}
	// }

	return &UploadResponse{
		Name:        blobName,
		Size:        int64(len(data)),
		ContentType: contentType,
		ETag:        string(*resp.ETag),
		Metadata:    metadata,
		Message:     "Blob uploaded successfully",
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

// downloadBlobHandler handles GET /blobs/{blobName}
func (bs *BlobService) downloadBlobHandler(w http.ResponseWriter, r *http.Request) {
	// Extract blob name from URL path
	blobName := strings.TrimPrefix(r.URL.Path, "/blobs/")
	if blobName == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "BadRequest",
			Message: "Blob name is required",
		})
		return
	}

	// Create context with timeout
	ctx, cancel := context.WithTimeout(r.Context(), 60*time.Second)
	defer cancel()

	// Download blob
	data, blobInfo, err := bs.DownloadBlob(ctx, blobName)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "NotFound",
			Message: fmt.Sprintf("Failed to download blob: %v", err),
		})
		return
	}

	// Check if client wants metadata only
	if r.URL.Query().Get("metadata") == "true" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(blobInfo)
		return
	}

	// Set headers for file download
	w.Header().Set("Content-Type", blobInfo.ContentType)
	w.Header().Set("Content-Length", fmt.Sprintf("%d", blobInfo.Size))
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filepath.Base(blobName)))

	// Add metadata as custom headers
	if blobInfo.Metadata != nil {
		for key, value := range blobInfo.Metadata {
			w.Header().Set(fmt.Sprintf("X-Blob-Meta-%s", key), value)
		}
	}

	// Write file content
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

// uploadBlobHandler handles POST /blobs
func (bs *BlobService) uploadBlobHandler(w http.ResponseWriter, r *http.Request) {
	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Parse multipart form
	err := r.ParseMultipartForm(32 << 20) // 32MB max memory
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "BadRequest",
			Message: fmt.Sprintf("Failed to parse form: %v", err),
		})
		return
	}

	// Get the file from form
	file, header, err := r.FormFile("file")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "BadRequest",
			Message: "File is required",
		})
		return
	}
	defer file.Close()

	// Read file content
	data, err := io.ReadAll(file)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "InternalServerError",
			Message: fmt.Sprintf("Failed to read file: %v", err),
		})
		return
	}

	// Get blob name (use form value or filename)
	blobName := r.FormValue("name")
	if blobName == "" {
		blobName = header.Filename
	}

	// Get content type
	contentType := header.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	// Get metadata from form values
	metadata := make(map[string]string)
	if altText := r.FormValue("altText"); altText != "" {
		metadata["altText"] = altText
	}
	if description := r.FormValue("description"); description != "" {
		metadata["description"] = description
	}
	if tags := r.FormValue("tags"); tags != "" {
		metadata["tags"] = tags
	}

	// Create context with timeout
	ctx, cancel := context.WithTimeout(r.Context(), 60*time.Second)
	defer cancel()

	// Upload blob
	response, err := bs.UploadBlob(ctx, blobName, data, contentType, metadata)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "InternalServerError",
			Message: fmt.Sprintf("Failed to upload blob: %v", err),
		})
		return
	}

	// Return success response
	w.WriteHeader(http.StatusCreated)
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

// corsMiddleware handles CORS for Angular frontend
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Expose-Headers", "X-Blob-Meta-altText, X-Blob-Meta-description, X-Blob-Meta-tags")

		// Handle preflight request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// setupRoutes configures HTTP routes
func setupRoutes(blobService *BlobService) *http.ServeMux {
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /health", healthHandler)

	// Blob operations
	mux.HandleFunc("GET /blobs", blobService.listBlobsHandler)
	mux.HandleFunc("GET /blobs/", blobService.downloadBlobHandler)
	mux.HandleFunc("POST /blobs", blobService.uploadBlobHandler)

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

	// Add middleware
	handler := corsMiddleware(loggingMiddleware(mux))

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      handler,
		ReadTimeout:  60 * time.Second,
		WriteTimeout: 60 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	log.Printf("Starting Azure Blob API server on port %s", port)
	log.Printf("Health check: http://localhost:%s/health", port)
	log.Printf("List blobs: http://localhost:%s/blobs", port)
	log.Printf("Download blob: http://localhost:%s/blobs/{blobName}", port)
	log.Printf("Download blob metadata: http://localhost:%s/blobs/{blobName}?metadata=true", port)
	log.Printf("Upload blob: POST http://localhost:%s/blobs", port)

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
