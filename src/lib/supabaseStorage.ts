import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class SupabaseStorageService {
  private bucketName = 'product-images';

  // Upload image to Supabase Storage
  async uploadImage(file: File, folder: string = 'products'): Promise<UploadResult> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file
      const { data: _, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error('Upload failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload multiple images
  async uploadMultipleImages(files: FileList | File[], folder: string = 'products'): Promise<string[]> {
    const uploadPromises = Array.from(files).map(file => this.uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    
    return results
      .filter(result => result.success)
      .map(result => result.url!)
      .filter(Boolean);
  }

  // Delete image
  async deleteImage(imagePath: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const urlParts = imagePath.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const fullPath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([fullPath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }

  // Get optimized image URL
  getOptimizedImageUrl(url: string, width?: number, height?: number): string {
    if (!url) return url;
    
    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());
    params.append('resize', 'contain');
    params.append('quality', '80');

    return `${url}?${params.toString()}`;
  }

  // Create image variants (thumbnail, medium, large)
  getImageVariants(url: string) {
    return {
      thumbnail: this.getOptimizedImageUrl(url, 150, 150),
      medium: this.getOptimizedImageUrl(url, 400, 400),
      large: this.getOptimizedImageUrl(url, 800, 800),
      original: url
    };
  }
}

// Export singleton instance
export const supabaseStorage = new SupabaseStorageService(); 