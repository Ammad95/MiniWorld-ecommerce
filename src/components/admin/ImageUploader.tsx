import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage, FiLoader } from 'react-icons/fi';
import { supabaseStorage } from '../../lib/supabaseStorage';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  folder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  folder = 'products'
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed max limit
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);
    setUploadProgress('Uploading images...');

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        setUploadProgress(`Uploading image ${index + 1} of ${files.length}...`);
        const result = await supabaseStorage.uploadImage(file, folder);
        return result;
      });

      const results = await Promise.all(uploadPromises);
      
      // Filter successful uploads
      const successfulUploads = results
        .filter(result => result.success)
        .map(result => result.url!)
        .filter(Boolean);

      // Update images array
      onImagesChange([...images, ...successfulUploads]);

      // Report any failures
      const failures = results.filter(result => !result.success);
      if (failures.length > 0) {
        console.warn('Some uploads failed:', failures);
        alert(`${successfulUploads.length} images uploaded successfully. ${failures.length} failed.`);
      } else {
        setUploadProgress(`${successfulUploads.length} images uploaded successfully!`);
        setTimeout(() => setUploadProgress(''), 2000);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = async (imageUrl: string, index: number) => {
    const confirmed = window.confirm('Are you sure you want to remove this image?');
    if (!confirmed) return;

    try {
      // Remove from Supabase Storage
      await supabaseStorage.deleteImage(imageUrl);
      
      // Remove from local state
      const updatedImages = images.filter((_, i) => i !== index);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Error removing image:', error);
      // Still remove from local state even if deletion failed
      const updatedImages = images.filter((_, i) => i !== index);
      onImagesChange(updatedImages);
    }
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {canAddMore && (
        <div className="flex flex-col items-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-cyan-600 rounded-lg hover:border-cyan-500 hover:bg-cyan-600/10 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <FiLoader className="animate-spin text-cyan-400" />
            ) : (
              <FiUpload className="text-cyan-400" />
            )}
            <span className="text-cyan-400">
              {uploading ? 'Uploading...' : `Upload Images (${images.length}/${maxImages})`}
            </span>
          </button>

          {uploadProgress && (
            <p className="text-sm text-cyan-400 mt-2">{uploadProgress}</p>
          )}

          <p className="text-xs text-slate-400 mt-1">
            Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-slate-700 rounded-lg overflow-hidden">
                <img
                  src={supabaseStorage.getOptimizedImageUrl(imageUrl, 300, 300)}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to original URL if optimized fails
                    (e.target as HTMLImageElement).src = imageUrl;
                  }}
                />
              </div>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(imageUrl, index)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <FiX size={16} />
              </button>

              {/* Primary Image Indicator */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-cyan-500 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
          <FiImage className="mx-auto text-slate-400 text-4xl mb-4" />
          <p className="text-slate-400 mb-2">No images uploaded yet</p>
          <p className="text-slate-500 text-sm">Click the upload button above to add product images</p>
        </div>
      )}

      {/* Usage Info */}
      <div className="text-xs text-slate-500 space-y-1">
        <p>• First image will be used as the primary product image</p>
        <p>• Images are automatically optimized for web delivery</p>
        <p>• Maximum file size: 5MB per image</p>
      </div>
    </div>
  );
};

export default ImageUploader; 