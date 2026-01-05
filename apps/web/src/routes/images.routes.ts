import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ApiService } from '../services/api.service';

export async function imagesRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  const apiService = new ApiService();

  fastify.get('/', async (request, reply) => {
    try {
      const images = await apiService.getAllImages();
      const query = request.query as { uploaded?: string; deleted?: string; error?: string };
      
      return reply.view('images/list', {
        images,
        title: 'Imágenes Procesadas',
        uploaded: query.uploaded,
        deleted: query.deleted === 'true',
        error: query.error,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return reply.view('images/list', {
        images: [],
        title: 'Imágenes Procesadas',
        error: message,
      });
    }
  });

  fastify.get('/upload', async (request, reply) => {
    return reply.view('images/upload', {
      title: 'Subir Imagen',
    });
  });

  fastify.post('/upload', async (request, reply) => {
    try {
      const data = await request.file();
      
      if (!data) {
        return reply.code(400).view('images/upload', {
          title: 'Subir Imagen',
          error: 'No se proporcionó ningún archivo',
        });
      }

      const buffer = await data.toBuffer();
      const filename = data.filename || `image-${Date.now()}`;

      const result = await apiService.uploadImage(buffer, filename);

      return reply.redirect(`/?uploaded=${encodeURIComponent(result.filename)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al subir la imagen';
      return reply.code(500).view('images/upload', {
        title: 'Subir Imagen',
        error: message,
      });
    }
  });

  fastify.post('/delete/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      await apiService.deleteImage(id);
      return reply.redirect('/?deleted=true');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar la imagen';
      return reply.code(500).redirect(`/?error=${encodeURIComponent(message)}`);
    }
  });
}
