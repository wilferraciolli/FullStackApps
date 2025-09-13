import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BlobGalleryComponent } from './components/blob-gallery/blob-gallery.component';
import { BlobImageComponent } from './components/blob-image/blob-image.component';
import { ImageHandlerService } from './services/image-handler.service';
import { DynamicSvgComponent } from './svgs/dynamic-svg/dynamic-svg.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    BlobGalleryComponent,
    DynamicSvgComponent,
    BlobImageComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public title: string = 'Blob Image handler';
  public activeTab: 'upload' | 'gallery' = 'gallery';

  private _imageService: ImageHandlerService = inject(ImageHandlerService);

  imageNames = [
    'eb1f1a8b-d7cd-4b76-b1b3-2792284dcb0c',
    '38f9f366-96c2-4630-ae35-187132187a00',
    'eb1f1a8b-d7cd-4b76-b1b3-2792284dcb0c',
    '38f9f366-96c2-4630-ae35-187132187a00',
    '38f9f366-96c2-4630-ae35-187132187a00',
    'eb1f1a8b-d7cd-4b76-b1b3-2792284dcb0c',
    '38f9f366-96c2-4630-ae35-187132187a00',
  ];

  healthStatus: any = null;
  checkingHealth = false;

  public imageIds: Array<string> = [
    '38f9f366-96c2-4630-ae35-187132187a00',
    'eb1f1a8b-d7cd-4b76-b1b3-2792284dcb0c'
  ];

  checkHealth(): void {
    this.checkingHealth = true;
    this._imageService.checkHealth().subscribe({
      next: (status) => {
        this.healthStatus = status;
        this.checkingHealth = false;
      },
      error: (error) => {
        this.healthStatus = { status: 'error', time: new Date().toISOString() };
        this.checkingHealth = false;
        console.error('Health check failed:', error);
      }
    });
  }
}
