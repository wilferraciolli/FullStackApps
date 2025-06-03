export interface BlobUploadResponse {
  name: string;
  size: number;
  contentType: string;
  etag: string;
  metadata?: { [key: string]: string };
  message: string;
}
