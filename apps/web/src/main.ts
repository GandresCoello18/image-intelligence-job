import Fastify from 'fastify';
import { join } from 'path';
import view from '@fastify/view';
import staticFiles from '@fastify/static';
import formbody from '@fastify/formbody';
import multipart from '@fastify/multipart';
import sensible from '@fastify/sensible';
import { imagesRoutes } from './routes/images.routes';

const port = parseInt(process.env.PORT || '3001', 10);
const host = process.env.HOST || '0.0.0.0';

async function bootstrap() {
  const loggerConfig: any = {
    level: process.env.LOG_LEVEL || 'info',
  };

  if (process.env.NODE_ENV === 'development') {
    try {
      require.resolve('pino-pretty');
      loggerConfig.transport = {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      };
    } catch {
      loggerConfig.prettyPrint = false;
    }
  }

  const fastify = Fastify({
    logger: loggerConfig,
  });

  await fastify.register(sensible);
  await fastify.register(formbody);
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  await fastify.register(staticFiles, {
    root: join(__dirname, 'public'),
    prefix: '/public/',
  });

  const viewsPath = join(__dirname, 'views');
  await fastify.register(view, {
    engine: {
      pug: require('pug'),
    },
    root: viewsPath,
    viewExt: 'pug',
    defaultContext: {
      appName: 'Image Intelligence',
    },
  });

  await fastify.register(imagesRoutes, { prefix: '/' });

  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  try {
    await fastify.listen({ port, host });
    fastify.log.info(`🚀 Web application is running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();

