import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Calendar, 
  Settings, 
  LogOut, 
  Edit, 
  Save, 
  X, 
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Heart
} from 'lucide-react';
import { authApi, userApi, registrationApi, User, EventRegistration } from '../lib/supabase';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const session = await authApi.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const [userProfile, userRegistrations] = await Promise.all([
        userApi.getCurrentUserProfile(),
        registrationApi.getUserRegistrations()
      ]);

      setUser(userProfile);
      setRegistrations(userRegistrations);
      
      if (userProfile) {
        setFormData(userProfile);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      const updatedUser = await userApi.updateUserProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    if (!confirm('Are you sure you want to cancel this registration?')) return;
    
    try {
      await registrationApi.cancelRegistration(registrationId);
      await checkAuthAndLoadData(); // Reload data
    } catch (error) {
      console.error('Failed to cancel registration:', error);
      alert('Failed to cancel registration. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      case 'attended':
        return <CheckCircle className="text-blue-500" size={20} />;
      default:
        return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'attended':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5d00c1]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-8">Please complete your profile setup.</p>
          <button
            onClick={() => navigate('/profile-setup')}
            className="px-6 py-3 bg-[#5d00c1] text-white font-semibold rounded-xl hover:bg-[#4a0096] transition-colors"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#5d00c1] to-[#00c019] rounded-full flex items-center justify-center">
                <UserIcon className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome, {user.first_name}!
                </h1>
                <p className="text-gray-600">Manage your profile and event registrations</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
            >
              <LogOut className="mr-2" size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-[#5d00c1] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserIcon className="mr-2" size={18} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'registrations'
                ? 'bg-white text-[#5d00c1] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="mr-2" size={18} />
            My Events
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-[#5d00c1] text-white font-semibold rounded-xl hover:bg-[#4a0096] transition-colors"
                >
                  <Edit className="mr-2" size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="inline-flex items-center px-4 py-2 bg-[#00c019] text-white font-semibold rounded-xl hover:bg-[#00a015] transition-colors"
                  >
                    <Save className="mr-2" size={18} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(user);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    <X className="mr-2" size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.first_name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.last_name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user.last_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <Mail className="mr-2 text-gray-400" size={16} />
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium flex items-center">
                      <Phone className="mr-2 text-gray-400" size={16} />
                      {user.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.date_of_birth || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {user.date_of_birth ? formatDate(user.date_of_birth) : 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium flex items-start">
                      <MapPin className="mr-2 text-gray-400 mt-0.5" size={16} />
                      {user.address || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{user.city || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.state || 'NC'}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{user.state}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.zip_code || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user.zip_code || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergency_contact_name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user.emergency_contact_name || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.emergency_contact_phone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user.emergency_contact_phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Medical Information */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                  {isEditing ? (
                    <textarea
                      value={formData.dietary_restrictions || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none resize-none"
                      placeholder="Any dietary restrictions or allergies..."
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user.dietary_restrictions || 'None specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                  {isEditing ? (
                    <textarea
                      value={formData.medical_conditions || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, medical_conditions: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none resize-none"
                      placeholder="Any medical conditions we should be aware of..."
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user.medical_conditions || 'None specified'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">My Event Registrations</h2>
            
            {registrations.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Event Registrations</h3>
                <p className="text-gray-600 mb-8">You haven't registered for any events yet.</p>
                <button
                  onClick={() => navigate('/programs')}
                  className="inline-flex items-center px-6 py-3 bg-[#5d00c1] text-white font-semibold rounded-xl hover:bg-[#4a0096] transition-colors"
                >
                  <Heart className="mr-2" size={20} />
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {registrations.map((registration) => (
                  <div key={registration.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{registration.event?.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registration.status)}`}>
                            {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-gray-600">
                          <p className="flex items-center">
                            <Calendar className="mr-2" size={16} />
                            {registration.event?.event_date && formatDate(registration.event.event_date)}
                          </p>
                          <p className="flex items-center">
                            <Clock className="mr-2" size={16} />
                            {registration.event?.start_time && formatTime(registration.event.start_time)}
                            {registration.event?.end_time && ` - ${formatTime(registration.event.end_time)}`}
                          </p>
                          <p className="flex items-center">
                            <MapPin className="mr-2" size={16} />
                            {registration.event?.location}
                          </p>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-2">
                          Registered on {formatDate(registration.registration_date)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(registration.status)}
                        {registration.status === 'registered' && (
                          <button
                            onClick={() => handleCancelRegistration(registration.id)}
                            className="px-4 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
                          >
                            Cancel Registration
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {registration.notes && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-700">
                          <strong>Notes:</strong> {registration.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;