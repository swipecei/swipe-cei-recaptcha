import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Save, X, Upload, Image } from 'lucide-react';
import { programsApi, Program } from '../../lib/supabase';
import { galleryApi } from '../../lib/supabase';

const ProgramsManager: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    detailed_description: '',
    icon: 'Users',
    gradient: 'from-[#5d00c1] to-[#4a0096]',
    hero_image: '',
    target_audience: '',
    duration: '',
    location: 'Charlotte Metro Area',
    features: '',
    outcomes: '',
    testimonials: '',
    upcoming_events: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const data = await programsApi.getAllPrograms();
      setPrograms(data);
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const programData = {
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim()),
        outcomes: formData.outcomes.split('\n').filter(o => o.trim()),
        testimonials: formData.testimonials ? JSON.parse(formData.testimonials) : [],
        upcoming_events: formData.upcoming_events ? JSON.parse(formData.upcoming_events) : []
      };

      if (editingProgram) {
        await programsApi.updateProgram(editingProgram.id, programData);
      } else {
        await programsApi.createProgram(programData);
      }
      await loadPrograms();
      resetForm();
    } catch (error) {
      console.error('Failed to save program:', error);
      alert('Failed to save program. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    try {
      await programsApi.deleteProgram(id);
      await loadPrograms();
    } catch (error) {
      console.error('Failed to delete program:', error);
      alert('Failed to delete program. Please try again.');
    }
  };

  const startEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      slug: program.slug,
      title: program.title,
      subtitle: program.subtitle || '',
      description: program.description,
      detailed_description: program.detailed_description || '',
      icon: program.icon,
      gradient: program.gradient,
      hero_image: program.hero_image || '',
      target_audience: program.target_audience || '',
      duration: program.duration || '',
      location: program.location,
      features: program.features.join('\n'),
      outcomes: program.outcomes.join('\n'),
      testimonials: JSON.stringify(program.testimonials, null, 2),
      upcoming_events: JSON.stringify(program.upcoming_events, null, 2),
      is_active: program.is_active,
      display_order: program.display_order
    });
    setIsCreating(false);
  };

  const resetForm = () => {
    setEditingProgram(null);
    setIsCreating(false);
    setFormData({
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      detailed_description: '',
      icon: 'Users',
      gradient: 'from-[#5d00c1] to-[#4a0096]',
      hero_image: '',
      target_audience: '',
      duration: '',
      location: 'Charlotte Metro Area',
      features: '',
      outcomes: '',
      testimonials: '',
      upcoming_events: '',
      is_active: true,
      display_order: 0
    });
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
      const fileName = `programs/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const imageUrl = await galleryApi.uploadImage(file, fileName);
      
      // Update form data with new image URL
      setFormData(prev => ({
        ...prev,
        hero_image: imageUrl
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
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Programs Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-[#5d00c1] text-white font-semibold rounded-xl hover:bg-[#4a0096] transition-colors"
        >
          <Plus className="mr-2" size={18} />
          Add Program
        </button>
      </div>

      {/* Form */}
      {(isCreating || editingProgram) && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-xl">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            {editingProgram ? 'Edit Program' : 'Add New Program'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
              <div className="space-y-4">
                {/* Current image preview */}
                {formData.hero_image && (
                  <div className="relative">
                    <img
                      src={formData.hero_image}
                      alt="Hero image preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hero_image: '' }))}
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
                      name="hero_image"
                      value={formData.hero_image}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
              <textarea
                name="detailed_description"
                value={formData.detailed_description}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                >
                  <option value="Users">Users</option>
                  <option value="Heart">Heart</option>
                  <option value="BookOpen">BookOpen</option>
                  <option value="Gift">Gift</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <input
                  type="text"
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Outcomes (one per line)</label>
              <textarea
                name="outcomes"
                value={formData.outcomes}
                onChange={handleChange}
                rows={4}
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

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-gray-50 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                program.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {program.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3">{program.description}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => startEdit(program)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit size={14} className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(program.id)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={14} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramsManager;