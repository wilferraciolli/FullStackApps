import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlobUploadResponse } from '../../interfaces/blob-upload.response';
import { ImageHandlerService } from '../../services/image-handler.service';

@Component({
  selector: 'app-blob-upload',
  imports: [
    FormsModule
  ],
  templateUrl: './blob-upload.component.html',
  styleUrl: './blob-upload.component.scss'
})
export class BlobUploadComponent {
  selectedFile: File | null = null;
  metadata = {
    altText: '',
    description: '',
    tags: ''
  };
  customName = '';
  uploading = false;
  uploadResult: BlobUploadResponse | null = null;
  error: string | null = null;

  constructor(private blobService: ImageHandlerService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.error = null;
    } else {
      this.selectedFile = null;
      this.error = 'Please select a valid image file';
    }
  }

  onSubmit(): void {
    if (!this.selectedFile || !this.metadata.altText) {
      return;
    }

    this.uploading = true;
    this.error = null;
    this.uploadResult = null;

    this.blobService.uploadBlob(
      this.selectedFile,
      this.metadata,
      this.customName || undefined
    ).subscribe({
      next: (result) => {
        this.uploadResult = result;
        this.uploading = false;
        this.resetForm();
      },
      error: (error) => {
        this.error = error.message;
        this.uploading = false;
      }
    });
  }

  private resetForm(): void {
    this.selectedFile = null;
    this.metadata = { altText: '', description: '', tags: '' };
    this.customName = '';
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
