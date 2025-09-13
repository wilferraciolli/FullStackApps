export interface BlobInfo {
  name: string;
  size: number;
  lastModified: string;
  contentType?: string;
  etag?: string;
  metadata?: { [key: string]: string };
}
