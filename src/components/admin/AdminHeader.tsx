import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Calendar, Image, Settings, LogOut, Home, Mail } from 'lucide-react';
import { authApi } from '../../lib/supabase';

interface AdminHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const tabs = [
    { id: 'gallery', name: 'Gallery', icon: Image },
    { id: 'programs', name: 'Programs', icon: Settings },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'board', name: 'Board Members', icon: Shield },
    { id: 'contact', name: 'Contact', icon: Mail }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#5d00c1] to-[#00c019] rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Manage your organization's content and settings</p>
          </div>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex-1 sm:flex-initial"
          >
            <Home className="sm:mr-2" size={18} />
            <span className="hidden sm:inline">Home</span>
          </button>
         
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center sm:justify-start px-3 sm:px-6 py-3 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-[#5d00c1] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="sm:mr-2" size={18} />
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden text-xs ml-1">{tab.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHeader;