import { BlobInfo } from './blob-info';

export interface BlobListResponse {
  container: string;
  blobs: BlobInfo[];
  count: number;
}
