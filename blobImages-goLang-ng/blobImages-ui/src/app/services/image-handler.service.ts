import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BlobInfo } from '../interfaces/blob-info';
import { BlobListResponse } from '../interfaces/blob-list.response';
import { BlobUploadResponse } from '../interfaces/blob-upload.response';

@Injectable({
  providedIn: 'root'
})
export class ImageHandlerService {
  private readonly apiUrl = 'http://localhost:8080';

  private readonly _httpClient: HttpClient = inject(HttpClient);

  // List all blobs
 public listBlobs(prefix?: string): Observable<BlobListResponse> {
    const url = `${this.apiUrl}/blobs`;
    const params = prefix ? { prefix } : {};

    // @ts-ignore
   return this._httpClient.get<BlobListResponse>(url, { params })
               .pipe(catchError(this.handleError));
  }

  // Upload a blob with metadata
  uploadBlob(file: File, metadata: { altText?: string; description?: string; tags?: string }, customName?: string): Observable<BlobUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    if (customName) {
      formData.append('name', customName);
    }

    if (metadata.altText) {
      formData.append('altText', metadata.altText);
    }

    if (metadata.description) {
      formData.append('description', metadata.description);
    }

    if (metadata.tags) {
      formData.append('tags', metadata.tags);
    }

    return this._httpClient.post<BlobUploadResponse>(`${this.apiUrl}/blobs`, formData)
               .pipe(catchError(this.handleError));
  }

  // Download blob as a file
  public downloadBlob(blobName: string): Observable<{ blob: Blob; metadata: { [key: string]: string } }> {
    return this._httpClient.get(`${this.apiUrl}/blobs/${encodeURIComponent(blobName)}`, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        const metadata: { [key: string]: string } = {};

        // Extract metadata from headers
        response.headers.keys().forEach(key => {
          if (key.startsWith('x-blob-meta-')) {
            const metaKey = key.replace('x-blob-meta-', '');
            metadata[metaKey] = response.headers.get(key) || '';
          }
        });

        return {
          blob: response.body!,
          metadata
        };
      }),
      catchError(this.handleError)
    );
  }

  // Get only blob metadata
  getBlobMetadata(blobName: string): Observable<BlobInfo> {
    return this._httpClient.get<BlobInfo>(`${this.apiUrl}/blobs/${encodeURIComponent(blobName)}?metadata=true`)
               .pipe(catchError(this.handleError));
  }

  // Create a downloadable URL for a blob
  createBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  // Clean up blob URL
  revokeBlobUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

}
