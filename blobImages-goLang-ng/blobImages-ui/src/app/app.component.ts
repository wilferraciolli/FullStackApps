import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { BlobGalleryComponent } from './components/blob-gallery/blob-gallery.component';
import { BlobUploadComponent } from './components/blob-upload/blob-upload.component';
import { CardImageComponent } from './components/card-image/card-image.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatIconButton,
    MatToolbar,
    MatIcon,
    CardImageComponent,
    BlobUploadComponent,
    BlobGalleryComponent,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public title: string = 'Blob Image handler';
  public activeTab: 'upload' | 'gallery' = 'gallery';

  public imageIds: Array<string> = [
    '38f9f366-96c2-4630-ae35-187132187a00',
    'eb1f1a8b-d7cd-4b76-b1b3-2792284dcb0c'
  ];
}
