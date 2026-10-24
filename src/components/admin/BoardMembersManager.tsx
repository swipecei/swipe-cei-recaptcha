import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Save, X, Upload, Users, Shield } from 'lucide-react';
import { boardMembersApi, galleryApi, BoardMember } from '../../lib/supabase';

const BoardMembersManager: React.FC = () => {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    bio: '',
    image_url: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadBoardMembers();
  }, []);

  const loadBoardMembers = async () => {
    try {
      const data = await boardMembersApi.getAllBoardMembers();
      setBoardMembers(data);
    } catch (error) {
      console.error('Failed to load board members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const memberData = {
        ...formData,
        phone: formData.phone || null,
        bio: formData.bio || null,
        image_url: formData.image_url || null
      };

      if (editingMember) {
        await boardMembersApi.updateBoardMember(editingMember.id, memberData);
      } else {
        await boardMembersApi.createBoardMember(memberData);
      }
      await loadBoardMembers();
      resetForm();
    } catch (error) {
      console.error('Failed to save board member:', error);
      alert('Failed to save board member. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this board member?')) return;
    
    try {
      await boardMembersApi.deleteBoardMember(id);
      await loadBoardMembers();
    } catch (error) {
      console.error('Failed to delete board member:', error);
      alert('Failed to delete board member. Please try again.');
    }
  };

  const startEdit = (member: BoardMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      title: member.title,
      email: member.email,
      phone: member.phone || '',
      bio: member.bio || '',
      image_url: member.image_url || '',
      display_order: member.display_order,
      is_active: member.is_active
    });
    setIsCreating(false);
  };

  const resetForm = () => {
    setEditingMember(null);
    setIsCreating(false);
    setFormData({
      name: '',
      title: '',
      email: '',
      phone: '',
      bio: '',
      image_url: '',
      display_order: 0,
      is_active: true
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
      const fileName = `board-members/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
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
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Board Members Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-[#5d00c1] text-white font-semibold rounded-xl hover:bg-[#4a0096] transition-colors"
        >
          <Plus className="mr-2" size={18} />
          Add Board Member
        </button>
      </div>

      {/* Form */}
      {(isCreating || editingMember) && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-xl">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            {editingMember ? 'Edit Board Member' : 'Add New Board Member'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                />
              </div>
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              <div className="space-y-4">
                {/* Current image preview */}
                {formData.image_url && (
                  <div className="relative">
                    <img
                      src={formData.image_url}
                      alt="Profile image preview"
                      className="w-32 h-32 object-cover rounded-full border border-gray-300 mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      className="absolute top-0 right-1/2 transform translate-x-12 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio (Optional)</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent"
                placeholder="Brief biography or background information..."
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

      {/* Board Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boardMembers.map((member) => (
          <div key={member.id} className="bg-gray-50 rounded-xl overflow-hidden">
            {member.image_url && (
              <img
                src={member.image_url}
                alt={member.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-[#5d00c1] font-medium">{member.title}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {member.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <p>{member.email}</p>
                {member.phone && <p>{member.phone}</p>}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(member)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit size={14} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
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

      {boardMembers.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Board Members</h3>
          <p className="text-gray-600">Add board members to manage your organization's leadership information.</p>
        </div>
      )}
    </div>
  );
};

export default BoardMembersManager;