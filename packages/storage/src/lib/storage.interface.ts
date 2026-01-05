import Stream from 'stream';

export interface StorageService {
  getPresignedUrl(filename: string, expiryInSeconds?: number): Promise<string>;
  upload(filename: string, buffer: Buffer): Promise<void>;
  delete(filename: string): Promise<void>;
  getObject(filename: string): Promise<Stream.Readable>;
  exists(filename: string): Promise<boolean>;
}

