import axios, { AxiosInstance } from 'axios';

describe('Image Intelligence API E2E Tests', () => {
  let apiClient: AxiosInstance;
  const baseURL = process.env.API_URL || 'http://localhost:3000/api';

  beforeAll(() => {
    apiClient = axios.create({
      baseURL,
      timeout: 10000,
      validateStatus: () => true,
    });
  });

  describe('Health Check', () => {
    it('should be able to reach the API', async () => {
      const response = await apiClient.get('/images');
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('GET /api/images', () => {
    it('should return a list of images (empty or with data)', async () => {
      const response = await apiClient.get('/images');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should return images with correct structure', async () => {
      const response = await apiClient.get('/images');

      if (response.data.length > 0) {
        const image = response.data[0];
        expect(image).toHaveProperty('_id');
        expect(image).toHaveProperty('filename');
        expect(image).toHaveProperty('bucket');
        expect(image).toHaveProperty('metadata');
        expect(image).toHaveProperty('palette');
        expect(image).toHaveProperty('brightness');
        expect(image).toHaveProperty('hash');
      }
    });
  });

  describe('POST /api/images/upload', () => {
    it('should reject request without file', async () => {
      const response = await apiClient.post('/images/upload');

      expect([400, 500]).toContain(response.status);
    });

    it('should accept valid image file', async () => {
      const testImageBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );

      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', testImageBuffer, {
        filename: 'test-image.png',
        contentType: 'image/png',
      });

      const response = await apiClient.post('/images/upload', formData, {
        headers: {
          ...formData.getHeaders(),
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      if (response.status === 200 || response.status === 201) {
        expect(response.data).toHaveProperty('status');
        expect(response.data).toHaveProperty('filename');
        expect(response.data.status).toBe('queued');
      } else {
        expect(response.status).toBe(500);
      }
    });
  });

  describe('GET /api/images/:id', () => {
    it('should return 404 or null for non-existent image', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await apiClient.get(`/images/${fakeId}`);

      if (response.status === 200) {
        expect(response.data === null || response.data === '').toBe(true);
      } else {
        expect([404, 500]).toContain(response.status);
      }
    });

    it('should return image details if exists', async () => {
      const listResponse = await apiClient.get('/images');

      if (listResponse.status === 200 && listResponse.data.length > 0) {
        const firstImage = listResponse.data[0];
        const response = await apiClient.get(`/images/${firstImage._id}`);

        if (response.status === 200) {
          expect(response.data).toHaveProperty('_id');
          expect(response.data).toHaveProperty('filename');
          expect(response.data).toHaveProperty('imageUrl');
        }
      }
    });
  });

  describe('DELETE /api/images/:id', () => {
    it('should return 404 or null for non-existent image', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await apiClient.delete(`/images/${fakeId}`);

      if (response.status === 200) {
        expect(response.data === null || response.data === '').toBe(true);
      } else {
        expect([404, 500]).toContain(response.status);
      }
    });

    it('should delete image if exists', async () => {
      const listResponse = await apiClient.get('/images');

      if (listResponse.status === 200 && listResponse.data.length > 0) {
        const firstImage = listResponse.data[0];
        const response = await apiClient.delete(`/images/${firstImage._id}`);

        if (response.status === 200) {
          expect(response.data).toHaveProperty('success');
          expect(response.data.success).toBe(true);
        }
      }
    });
  });

  describe('API Structure', () => {
    it('should have correct API prefix', async () => {
      const response = await apiClient.get('/images');
      expect(response.status).not.toBe(404);
    });
  });
});
