import { CommonModule, DatePipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BlobInfo } from '../../interfaces/blob-info';
import { ImageHandlerService } from '../../services/image-handler.service';
import { BlobImageComponent } from '../blob-image/blob-image.component';

@Component({
  selector: 'app-blob-gallery',
  imports: [
    CommonModule, BlobImageComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blob-gallery.component.html',
  styleUrl: './blob-gallery.component.scss'
})
export class BlobGalleryComponent implements OnInit, OnDestroy {
  @Input() imageNames: string[] = [];
  @Input() columns = 3;
  @Input() showMetadata = false;
  @Input() batchMode = false; // If true, images won't auto-load

  loadedCount = 0;
  batchLoading = false;
  errors: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(private blobService: ImageHandlerService) {}

  ngOnInit(): void {
    if (this.batchMode && this.imageNames.length > 0) {
      // Don't auto-load in batch mode
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get loadingProgress(): number {
    return this.imageNames.length > 0 ? (this.loadedCount / this.imageNames.length) * 100 : 0;
  }

  loadAllImages(): void {
    this.batchLoading = true;
    this.loadedCount = 0;
    this.errors = [];

    this.blobService.getMultipleBlobsAsDataUrls(this.imageNames)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (dataUrls) => {
            this.loadedCount = Object.keys(dataUrls).length;
            this.batchLoading = false;

            // Find failed images
            const loadedNames = Object.keys(dataUrls);
            const failedNames = this.imageNames.filter(name => !loadedNames.includes(name));
            this.errors = failedNames.map(name => `Failed to load: ${name}`);
          },
          error: (error) => {
            this.batchLoading = false;
            this.errors.push(`Batch loading failed: ${error}`);
          }
        });
  }

  onImageLoaded(dataUrl: string, imageName: string): void {
    this.loadedCount++;
  }

  onImageError(error: string, imageName: string): void {
    this.errors.push(`${imageName}: ${error}`);
  }

  trackByImageName(index: number, imageName: string): string {
    return imageName;
  }

}
