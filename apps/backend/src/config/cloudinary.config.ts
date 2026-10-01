import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.config';

/**
 * Configures Cloudinary SDK if credentials are set.
 * Falls back silently to local disk storage if not configured.
 */
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key:    env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure:     true,
  });
  console.log(`☁️  Cloudinary configured — uploads will persist to cloud (cloud: ${env.CLOUDINARY_CLOUD_NAME})`);
} else {
  console.log('⚠️  Cloudinary not configured — files will save to local disk (ephemeral on Railway). Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET env vars.');
}

export { cloudinary };

export const isCloudinaryEnabled = (): boolean =>
  !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
