import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary if credentials exist
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let isConfigured = false;
if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
  isConfigured = true;
}

// Fallback high-fidelity food images/videos
const fallbackFoodImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80'
];

const fallbackFoodVideos = [
  // Beautiful public cooking videos
  'https://assets.mixkit.co/videos/preview/mixkit-kitchen-chef-preparing-a-salad-41716-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-pouring-sauce-on-a-meal-41723-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-chopping-vegetables-in-a-kitchen-41718-large.mp4'
];

export class CloudinaryService {
  /**
   * Uploads an image (base64 or file buffer)
   */
  static async uploadImage(fileStr: string, folder: string = 'skill_chef/images'): Promise<string> {
    if (!isConfigured) {
      console.log('Cloudinary not configured. Returning premium food image fallback.');
      return fallbackFoodImages[Math.floor(Math.random() * fallbackFoodImages.length)];
    }

    try {
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1000, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'auto' }]
      });
      return uploadResponse.secure_url;
    } catch (error) {
      console.error('Cloudinary Image Upload Error, using fallback:', error);
      return fallbackFoodImages[0];
    }
  }

  /**
   * Uploads a video (reels / cooking guides)
   */
  static async uploadVideo(fileStr: string, folder: string = 'skill_chef/videos'): Promise<string> {
    if (!isConfigured) {
      console.log('Cloudinary not configured. Returning cooking video fallback.');
      return fallbackFoodVideos[Math.floor(Math.random() * fallbackFoodVideos.length)];
    }

    try {
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder,
        resource_type: 'video',
        chunk_size: 6000000, // 6MB chunking for larger video files
        eager: [
          { width: 720, height: 1280, crop: 'pad', audio_codec: 'aac', video_codec: 'h264' }
        ],
        eager_async: true
      });
      return uploadResponse.secure_url;
    } catch (error) {
      console.error('Cloudinary Video Upload Error, using fallback:', error);
      return fallbackFoodVideos[0];
    }
  }
}
