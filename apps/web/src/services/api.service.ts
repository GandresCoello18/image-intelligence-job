import axios, { AxiosInstance } from 'axios';

export interface ImageData {
  _id: string;
  filename: string;
  bucket: string;
  metadata: {
    format?: string;
    size?: number;
    width?: number;
    height?: number;
    aspectRatio?: number;
    orientation?: string;
    hasAlpha?: boolean;
    dominantColor?: { r: number; g: number; b: number };
  };
  palette: Array<{ r: number; g: number; b: number }>;
  brightness: string;
  hash: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export class ApiService {
  private client: AxiosInstance;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_URL || 'http://localhost:3000/api';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getAllImages(): Promise<ImageData[]> {
    try {
      const response = await this.client.get<ImageData[]>('/images');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch images: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async getImageById(id: string): Promise<ImageData | null> {
    try {
      const response = await this.client.get<ImageData>(`/images/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(
          `Failed to fetch image: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async uploadImage(file: Buffer, filename: string): Promise<{ status: string; filename: string }> {
    try {
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', file, {
        filename,
        contentType: 'application/octet-stream',
      });

      const response = await this.client.post<{ status: string; filename: string }>(
        '/images/upload',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to upload image: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async deleteImage(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.client.delete<{ success: boolean; message: string }>(
        `/images/${id}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to delete image: ${error.message}`,
        );
      }
      throw error;
    }
  }
}

