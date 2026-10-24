import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Save, X, Upload, CheckCircle, XCircle } from 'lucide-react';
import { galleryApi, GalleryImage } from '../../lib/supabase';

interface SelectedFile {
  file: File;
  preview: string;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const GalleryManager: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'community',
    image_url: '',
    alt_text: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [selectedFiles]);

  const loadImages = async () => {
    try {
      const data = await galleryApi.getAllImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingImage) {
        await galleryApi.updateImage(editingImage.id, formData);
      } else {
        await galleryApi.createImage(formData);
      }
      await loadImages();
      resetForm();
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('Failed to save image. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await galleryApi.deleteImage(id);
      await loadImages();
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const startEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || '',
      category: image.category,
      image_url: image.image_url,
      alt_text: image.alt_text,
      display_order: image.display_order,
      is_active: image.is_active
    });
    setIsCreating(false);
  };

  const resetForm = () => {
    setEditingImage(null);
    setIsCreating(false);
    setIsBatchMode(false);
    setSelectedFiles([]);
    setUploadProgress({ current: 0, total: 0 });
    setFormData({
      title: '',
      description: '',
      category: 'community',
      image_url: '',
      alt_text: '',
      display_order: 0,
      is_active: true
    });
  };

  const handleMultipleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: SelectedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        continue;
      }

      newFiles.push({
        file,
        preview: URL.createObjectURL(file),
        id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2)}`,
        status: 'pending'
      });
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeSelectedFile = (id: string) => {
    setSelectedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert('Please select at least one image');
      return;
    }

    if (!formData.title.trim() || !formData.alt_text.trim()) {
      alert('Please provide title and alt text');
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: selectedFiles.length });

    let successCount = 0;
    let currentOrder = formData.display_order;

    for (let i = 0; i < selectedFiles.length; i++) {
      const selectedFile = selectedFiles[i];

      setSelectedFiles(prev =>
        prev.map(f => f.id === selectedFile.id ? { ...f, status: 'uploading' } : f)
      );

      try {
        const fileExt = selectedFile.file.name.split('.').pop();
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const imageUrl = await galleryApi.uploadImage(selectedFile.file, fileName);

        await galleryApi.createImage({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image_url: imageUrl,
          alt_text: formData.alt_text,
          display_order: currentOrder + i,
          is_active: formData.is_active
        });

        setSelectedFiles(prev =>
          prev.map(f => f.id === selectedFile.id ? { ...f, status: 'success' } : f)
        );
        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${selectedFile.file.name}:`, error);
        setSelectedFiles(prev =>
          prev.map(f => f.id === selectedFile.id ? {
            ...f,
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed'
          } : f)
        );
      }

      setUploadProgress(prev => ({ ...prev, current: i + 1 }));
    }

    setUploading(false);

    await loadImages();

    alert(`Successfully uploaded ${successCount} of ${selectedFiles.length} images`);

    if (successCount === selectedFiles.length) {
      resetForm();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const imageUrl = await galleryApi.uploadImage(file, fileName);
      
      // Update form data with new image URL
      setFormData(prev => ({
        ...prev,
        image_url: imageUrl
      }));
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5d00c1]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gallery Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-[#5d00c1] text-white font-semibold rounded-xl hover:bg-[#4a0096] transition-colors"
          >
            <Plus className="mr-2" size={18} />
            Add Single Image
          </button>
          <button
            onClick={() => setIsBatchMode(true)}
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-[#00c019] text-white font-semibold rounded-xl hover:bg-[#00a015] transition-colors"
          >
            <Upload className="mr-2" size={18} />
            Batch Upload
          </button>
        </div>
      </div>

      {/* Batch Upload Form */}
      {isBatchMode && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-xl">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Batch Upload Images</h3>
          <form onSubmit={handleBatchUpload} className="space-y-6">
            {/* File Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Multiple Images
              </label>
              <label className="block w-full">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleFileSelection}
                  disabled={uploading}
                  className="hidden"
                />
                <div className={`w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-[#5d00c1] transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <span className="text-gray-600 font-medium">
                    Click to select multiple images
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Max 5MB per image. JPG, PNG, GIF, WebP supported.
                  </p>
                </div>
              </label>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Selected Images ({selectedFiles.length})
                  </h4>
                  {uploadProgress.total > 0 && (
                    <span className="text-sm text-gray-600">
                      Progress: {uploadProgress.current} / {uploadProgress.total}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {selectedFiles.map((selectedFile) => (
                    <div key={selectedFile.id} className="relative group">
                      <img
                        src={selectedFile.preview}
                        alt={selectedFile.file.name}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                        {selectedFile.status === 'pending' && !uploading && (
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(selectedFile.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                          >
                            <X size={16} />
                          </button>
                        )}
                        {selectedFile.status === 'uploading' && (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        )}
                        {selectedFile.status === 'success' && (
                          <CheckCircle className="text-green-500" size={24} />
                        )}
                        {selectedFile.status === 'error' && (
                          <XCircle className="text-red-500" size={24} />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate" title={selectedFile.file.name}>
                        {selectedFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shared Metadata Form */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Shared Metadata (applies to all images)
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      disabled={uploading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent disabled:opacity-50"
                      placeholder="e.g., Community Event 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={uploading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent disabled:opacity-50"
                    >
                      <option value="community">Community</option>
                      <option value="events">Events</option>
                      <option value="youth">Youth</option>
                      <option value="women">Women</option>
                      <option value="elderly">Elderly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="alt_text"
                    value={formData.alt_text}
                    onChange={handleChange}
                    required
                    disabled={uploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent disabled:opacity-50"
                    placeholder="Describe the images for accessibility"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={uploading}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent disabled:opacity-50"
                    placeholder="Additional details about these images"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Starting Display Order
                    </label>
                    <input
                      type="number"
                      name="display_order"
                      value={formData.display_order}
                      onChange={handleChange}
                      disabled={uploading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent disabled:opacity-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Each image will auto-increment from this number
                    </p>
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      disabled={uploading}
                      className="mr-2 disabled:opacity-50"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Set all images as active
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={uploading || selectedFiles.length === 0}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#00c019] text-white font-semibold rounded-lg hover:bg-[#00a015] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading {uploadProgress.current} of {uploadProgress.total}...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2" size={18} />
                    Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={uploading}
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="mr-2" size={18} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Single Image Form */}
      {(isCreating || editingImage) && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-xl">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            {editingImage ? 'Edit Image' : 'Add New Image'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                >
                  <option value="community">Community</option>
                  <option value="events">Events</option>
                  <option value="youth">Youth</option>
                  <option value="women">Women</option>
                  <option value="elderly">Elderly</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <div className="space-y-4">
                {/* Current image preview */}
                {formData.image_url && (
                  <div className="relative">
                    <img
                      src={formData.image_url}
                      alt="Image preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                {/* Upload section */}
                <div className="flex space-x-4">
                  {/* File upload */}
                  <div className="flex-1">
                    <label className="block w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <div className={`w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-[#5d00c1] transition-colors ${
                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}>
                        {uploading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#5d00c1] mr-2"></div>
                            Uploading...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Upload className="mr-2 text-gray-400" size={20} />
                            <span className="text-gray-600">Upload Image</span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  
                  {/* OR divider */}
                  <div className="flex items-center">
                    <span className="text-gray-400 text-sm">OR</span>
                  </div>
                  
                  {/* URL input */}
                  <div className="flex-1">
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      placeholder="Enter image URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  Upload an image file (max 5MB) or enter an image URL
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
              <input
                type="text"
                name="alt_text"
                value={formData.alt_text}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Active</label>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 bg-[#00c019] text-white font-semibold rounded-lg hover:bg-[#00a015] transition-colors"
              >
                <Save className="mr-2" size={18} />
                Save
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="mr-2" size={18} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-gray-50 rounded-xl overflow-hidden">
            <img
              src={image.image_url}
              alt={image.alt_text}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 truncate">{image.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  image.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {image.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 capitalize">{image.category}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(image)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit size={14} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;