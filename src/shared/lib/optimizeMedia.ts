import { getOptimizedUrl, getThumbnailUrl } from "./storage";
import { getCloudinaryUrl } from "./cloudinary";

export function optimizeMedia(
  url: string,
  options?: { width?: number; height?: number; quality?: string },
): string {
  return getOptimizedUrl(url, options);
}

export function getMediaThumbnail(url: string, width = 400, height = 300): string {
  return getThumbnailUrl(url, width, height);
}

export function getMediaUrl(
  publicId: string,
  options?: { width?: number; height?: number; crop?: string; quality?: string },
): string {
  return getCloudinaryUrl(publicId, options);
}
