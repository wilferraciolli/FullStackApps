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
	"sync"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
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

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

// BlobService handles Azure blob operations
type BlobService struct {
	client        *azblob.Client
	containerName string
	mu            sync.RWMutex // For thread-safe operations
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

// DownloadBlob downloads a blob with its metadata (concurrent-safe)
func (bs *BlobService) DownloadBlob(ctx context.Context, blobName string) ([]byte, *BlobInfo, error) {
	// Use read lock for concurrent access
	bs.mu.RLock()
	defer bs.mu.RUnlock()

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

// detectContentTypeFromBytes detects content type from file magic bytes
func detectContentTypeFromBytes(data []byte) string {
	if len(data) < 4 {
		return "application/octet-stream"
	}

	// Check for common image formats
	if len(data) >= 2 {
		// JPEG
		if data[0] == 0xFF && data[1] == 0xD8 {
			return "image/jpeg"
		}
		// PNG
		if len(data) >= 8 && data[0] == 0x89 && data[1] == 0x50 && data[2] == 0x4E && data[3] == 0x47 {
			return "image/png"
		}
		// GIF
		if len(data) >= 6 && data[0] == 0x47 && data[1] == 0x49 && data[2] == 0x46 {
			return "image/gif"
		}
		// WebP
		if len(data) >= 12 && data[0] == 0x52 && data[1] == 0x49 && data[2] == 0x46 && data[3] == 0x46 {
			if len(data) >= 12 && data[8] == 0x57 && data[9] == 0x45 && data[10] == 0x42 && data[11] == 0x50 {
				return "image/webp"
			}
		}
	}

	return "application/octet-stream"
}

// getContentType determines the content type based on file extension or provided content type
func getContentType(blobName string, providedContentType string) string {
	log.Printf("getContentType called with blobName: %s, providedContentType: %s", blobName, providedContentType)

	if providedContentType != "" && providedContentType != "application/octet-stream" {
		log.Printf("Using provided content type: %s", providedContentType)
		return providedContentType
	}

	// Determine content type based on file extension
	ext := strings.ToLower(filepath.Ext(blobName))
	log.Printf("File extension detected: %s", ext)

	switch ext {
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".png":
		return "image/png"
	case ".gif":
		return "image/gif"
	case ".webp":
		return "image/webp"
	case ".svg":
		return "image/svg+xml"
	case ".bmp":
		return "image/bmp"
	case ".ico":
		return "image/x-icon"
	case ".tiff", ".tif":
		return "image/tiff"
	default:
		// If no extension, try to detect from blob name patterns
		lowerName := strings.ToLower(blobName)
		if strings.Contains(lowerName, "image") || strings.Contains(lowerName, "img") || strings.Contains(lowerName, "photo") {
			log.Printf("Detected image from blob name pattern, defaulting to image/jpeg")
			return "image/jpeg"
		}
		log.Printf("No content type detected, using application/octet-stream")
		return "application/octet-stream"
	}
}

// downloadBlobHandler handles GET /blobs/{blobName} with goroutine support
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

	// Create context with timeout for blob download
	ctx, cancel := context.WithTimeout(r.Context(), 60*time.Second)
	defer cancel()

	// Channel to receive download result
	type downloadResult struct {
		data     []byte
		blobInfo *BlobInfo
		err      error
	}

	resultChan := make(chan downloadResult, 1)

	// Start download in a goroutine
	go func() {
		defer close(resultChan)

		data, blobInfo, err := bs.DownloadBlob(ctx, blobName)
		resultChan <- downloadResult{
			data:     data,
			blobInfo: blobInfo,
			err:      err,
		}
	}()

	// Wait for result or timeout
	select {
	case result := <-resultChan:
		if result.err != nil {
			log.Printf("Error downloading blob %s: %v", blobName, result.err)
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(ErrorResponse{
				Error:   "NotFound",
				Message: fmt.Sprintf("Failed to download blob: %v", result.err),
			})
			return
		}

		// Check if client wants metadata only
		if r.URL.Query().Get("metadata") == "true" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(result.blobInfo)
			return
		}

		// Set headers for file download
		contentType := getContentType(blobName, result.blobInfo.ContentType)

		// If still getting application/octet-stream, try to detect from file content
		if contentType == "application/octet-stream" && len(result.data) > 0 {
			detectedType := detectContentTypeFromBytes(result.data)
			if detectedType != "application/octet-stream" {
				log.Printf("Detected content type from file bytes: %s", detectedType)
				contentType = detectedType
			}
		}

		w.Header().Set("Content-Type", contentType)

		w.Header().Set("Content-Length", fmt.Sprintf("%d", result.blobInfo.Size))
		w.Header().Set("Content-Disposition", fmt.Sprintf("inline; filename=%s", filepath.Base(blobName)))

		// Enable caching for images
		w.Header().Set("Cache-Control", "public, max-age=3600")
		w.Header().Set("ETag", result.blobInfo.ETag)

		// Add metadata as custom headers
		if result.blobInfo.Metadata != nil {
			for key, value := range result.blobInfo.Metadata {
				w.Header().Set(fmt.Sprintf("X-Blob-Meta-%s", key), value)
			}
		}

		// Write file content
		w.WriteHeader(http.StatusOK)
		w.Write(result.data)

		log.Printf("Successfully served blob: %s (%d bytes)", blobName, len(result.data))
		log.Printf("Content-Type: %s, Size: %d bytes", contentType, result.blobInfo.Size)
		log.Printf("Response headers set: Content-Type=%s, Content-Length=%d", contentType, result.blobInfo.Size)

	case <-ctx.Done():
		log.Printf("Download timeout for blob: %s", blobName)
		w.WriteHeader(http.StatusRequestTimeout)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "RequestTimeout",
			Message: "Download request timed out",
		})
	}
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
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Expose-Headers", "X-Blob-Meta-altText, X-Blob-Meta-description, X-Blob-Meta-tags, Cache-Control, ETag")

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

	// Blob download operations only
	mux.HandleFunc("GET /blobs/", blobService.downloadBlobHandler)

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

	log.Printf("Starting Azure Blob Image Server on port %s", port)
	log.Printf("Health check: http://localhost:%s/health", port)
	log.Printf("Download image: http://localhost:%s/blobs/{blobName}", port)
	log.Printf("Download image metadata: http://localhost:%s/blobs/{blobName}?metadata=true", port)

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
