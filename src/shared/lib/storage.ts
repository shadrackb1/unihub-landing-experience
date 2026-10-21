export interface MediaItem {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  format: string;
  order: number;
}

export async function uploadMedia(file: File, folder?: string): Promise<MediaItem> {
  const { uploadToCloudinary } = await import("@/shared/lib/cloudinary");
  const url = await uploadToCloudinary(file);

  // Extract public_id from URL
  const publicId = extractPublicId(url);

  return {
    public_id: publicId,
    secure_url: url,
    resource_type: file.type.startsWith("video/") ? "video" : "image",
    format: file.type.split("/")[1] || "unknown",
    order: 0,
  };
}

export async function uploadMultipleMedia(files: File[]): Promise<MediaItem[]> {
  const uploadPromises = files.map((file) => uploadMedia(file));
  return Promise.all(uploadPromises);
}

function extractPublicId(url: string): string {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/);
  return match?.[1] ?? "";
}

export function getOptimizedUrl(
  url: string,
  options?: { width?: number; height?: number; quality?: string },
): string {
  if (!url.includes("cloudinary.com")) return url;

  const transformations = [];
  // Auto quality and format
  transformations.push("q_auto");
  transformations.push("f_auto");

  return url.replace("/upload/", `/upload/${transformations.join(",")}/`);
}

export function getThumbnailUrl(url: string, width = 400, height = 300): string {
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
}

export function deleteMedia(publicId: string): Promise<void> {
  // This would require Cloudinary admin API with signed requests
  // For now, we just return a resolved promise
  return Promise.resolve();
}
