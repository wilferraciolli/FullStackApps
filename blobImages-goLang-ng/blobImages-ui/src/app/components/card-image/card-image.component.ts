import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardSubtitle, MatCardTitle
} from '@angular/material/card';
import { ImageHandlerService } from '../../services/image-handler.service';

@Component({
  selector: 'app-card-image',
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle
  ],
  templateUrl: './card-image.component.html',
  styleUrl: './card-image.component.scss'
})
export class CardImageComponent implements OnInit {
  @Input({ required: true })
  public imageId!: string;

  private _imageService: ImageHandlerService = inject(ImageHandlerService);

  public imageUrl: WritableSignal<string | null> = signal(null);
  public blob: WritableSignal<Blob | null> = signal(null);
  public metadata!: { [key: string]: string };

  public ngOnInit(): void {
    this.imageUrl.set(`http://localhost:8080/blobs/${this.imageId}`);
    // this._imageService.downloadBlob(this.imageId).subscribe(result => {
    //   this.blob.set(result.blob);
    //   // this.blob.set(result.blob);
    // });
  }
}
