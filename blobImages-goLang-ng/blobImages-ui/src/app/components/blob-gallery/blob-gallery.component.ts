import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlobInfo } from '../../interfaces/blob-info';
import { ImageHandlerService } from '../../services/image-handler.service';

@Component({
  selector: 'app-blob-gallery',
  imports: [
    DatePipe,
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './blob-gallery.component.html',
  styleUrl: './blob-gallery.component.scss'
})
export class BlobGalleryComponent implements OnInit {
  blobs: Array<{ info: BlobInfo; url?: string }> = [];
  loading = false;
  error: string | null = null;
  prefixFilter = '';
  selectedBlobMetadata: BlobInfo | null = null;

  constructor(private blobService: ImageHandlerService) {}

  ngOnInit(): void {
    this.loadBlobs();
  }

  loadBlobs(): void {
    this.loading = true;
    this.error = null;

    this.blobService.listBlobs(this.prefixFilter || undefined).subscribe({
      next: (response) => {
        this.blobs = response.blobs
                             .filter(blob => blob.contentType?.startsWith('image/'))
                             .map(blob => ({ info: blob }));

        // Load image URLs
        this.loadImageUrls();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  private loadImageUrls(): void {
    this.blobs.forEach(blob => {
      this.blobService.downloadBlob(blob.info.name).subscribe({
        next: (result) => {
          blob.url = this.blobService.createBlobUrl(result.blob);
          // Update metadata with any additional info from headers
          if (result.metadata) {
            blob.info.metadata = { ...blob.info.metadata, ...result.metadata };
          }
        },
        error: (error) => {
          console.error(`Failed to load image ${blob.info.name}:`, error);
        }
      });
    });
  }

  onImageLoad(blob: any): void {
    // Image loaded successfully
  }

  onImageError(blob: any): void {
    console.error(`Failed to display image: ${blob.info.name}`);
  }

  downloadImage(blob: any): void {
    if (blob.url) {
      const link = document.createElement('a');
      link.href = blob.url;
      link.download = blob.info.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  viewMetadata(blob: any): void {
    this.selectedBlobMetadata = blob.info;
  }

  closeMetadataModal(): void {
    this.selectedBlobMetadata = null;
  }

  getMetadataEntries(metadata: { [key: string]: string }): Array<{ key: string; value: string }> {
    return Object.entries(metadata).map(([key, value]) => ({ key, value }));
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  ngOnDestroy(): void {
    // Clean up blob URLs to prevent memory leaks
    this.blobs.forEach(blob => {
      if (blob.url) {
        this.blobService.revokeBlobUrl(blob.url);
      }
    });
  }

}
