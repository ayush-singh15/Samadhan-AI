import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env.config';
import { cloudinary, isCloudinaryEnabled } from '../config/cloudinary.config';
import { Request } from 'express';

const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Use memoryStorage when Cloudinary is enabled (we stream the buffer to Cloudinary)
const storage = isCloudinaryEnabled() ? multer.memoryStorage() : localStorage;

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-matroska',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.mp4',
  '.mov',
  '.webm',
  '.mkv',
]);

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isMimeValid = ALLOWED_MIME_TYPES.has(file.mimetype);
    const isExtValid = ALLOWED_EXTENSIONS.has(ext);

    if (isMimeValid && isExtValid) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext || file.mimetype}. Allowed: Images (JPG, PNG, WEBP) and Videos (MP4, MOV, WEBM).`));
    }
  },
});

/**
 * Upload a multer file buffer to Cloudinary and return the secure URL.
 * Falls back to a local file URL if Cloudinary is not configured.
 */
export async function uploadFileToCloud(file: Express.Multer.File): Promise<string> {
  if (!isCloudinaryEnabled()) {
    // Cloudinary not configured — save to disk and return local URL
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, file.buffer);
    return `/uploads/${filename}`;
  }

  // Determine resource type
  const isVideo = file.mimetype.startsWith('video/');
  const resourceType: 'image' | 'video' = isVideo ? 'video' : 'image';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'samadhan-ai/evidence',
        resource_type: resourceType,
        use_filename: false,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(file.buffer);
  });
}
