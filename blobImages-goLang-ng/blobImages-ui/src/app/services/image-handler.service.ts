import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, retry, throwError, timeout } from 'rxjs';
import { BlobInfo } from '../interfaces/blob-info';
import { BlobListResponse } from '../interfaces/blob-list.response';
import { BlobUploadResponse } from '../interfaces/blob-upload.response';
import { HealthStatus } from '../interfaces/health-status';

@Injectable({
  providedIn: 'root'
})
export class ImageHandlerService {
  private readonly baseUrl: string = 'http://localhost:8080';

  private readonly _httpClient: HttpClient = inject(HttpClient);

  // Loading state management
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Check if the blob service is healthy
   */
  checkHealth(): Observable<HealthStatus> {
    return this._httpClient.get<HealthStatus>(`${this.baseUrl}/health`)
               .pipe(
                 timeout(5000),
                 retry(2),
                 catchError(this.handleError)
               );
  }

  /**
   * Get blob metadata without downloading the actual content
   */
  getBlobMetadata(blobName: string): Observable<BlobInfo> {
    return this._httpClient.get<BlobInfo>(`${this.baseUrl}/blobs/${encodeURIComponent(blobName)}?metadata=true`)
               .pipe(
                 timeout(10000),
                 retry(1),
                 catchError(this.handleError)
               );
  }

  /**
   * Download blob as a data URL for image display
   */
  getBlobAsDataUrl(blobName: string): Observable<string> {
    this.setLoading(true);

    return this._httpClient.get(`${this.baseUrl}/blobs/${encodeURIComponent(blobName)}`, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      timeout(30000),
      map(response => {
        this.setLoading(false);
        const blob = response.body;
        if (!blob) throw new Error('No blob data received');

        return URL.createObjectURL(blob);
      }),
      catchError(error => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Download multiple blobs concurrently
   */
  getMultipleBlobsAsDataUrls(blobNames: string[]): Observable<{ [key: string]: string }> {
    this.setLoading(true);

    const requests = blobNames.map(name =>
      this.getBlobAsDataUrl(name).pipe(
        map(dataUrl => ({ name, dataUrl })),
        catchError(error => of({ name, dataUrl: '', error: error.message }))
      )
    );

    return forkJoin(requests).pipe(
      map(results => {
        this.setLoading(false);
        const dataUrls: { [key: string]: string } = {};
        results.forEach(result => {
          if ('dataUrl' in result && result.dataUrl) {
            dataUrls[result.name] = result.dataUrl;
          }
        });
        return dataUrls;
      }),
      catchError(error => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Get blob with both data and metadata
   */
  getBlobWithMetadata(blobName: string): Observable<{ dataUrl: string; metadata: BlobInfo }> {
    return forkJoin({
      dataUrl: this.getBlobAsDataUrl(blobName),
      metadata: this.getBlobMetadata(blobName)
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
      if (error.error?.message) {
        errorMessage += ` (${error.error.message})`;
      }
    }

    console.error('BlobService Error:', errorMessage);
    return throwError(() => errorMessage);
  }










}
