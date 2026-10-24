import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/supabase';
import AdminHeader from '../components/admin/AdminHeader';
import GalleryManager from '../components/admin/GalleryManager';
import ProgramsManager from '../components/admin/ProgramsManager';
import EventsManager from '../components/admin/EventsManager';
import UsersManager from '../components/admin/UsersManager';
import BoardMembersManager from '../components/admin/BoardMembersManager';
import ContactSubmissionsManager from '../components/admin/ContactSubmissionsManager';

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const session = await authApi.getSession();
      if (!session) {
        navigate('/');
        return;
      }

      const adminStatus = await authApi.isCurrentUserAdmin();
      console.log('Admin status from isCurrentUserAdmin:', adminStatus);
      if (!adminStatus) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Admin access check failed:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5d00c1]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'programs' && <ProgramsManager />}
        {activeTab === 'events' && <EventsManager />}
        {activeTab === 'users' && <UsersManager />}
        {activeTab === 'board' && <BoardMembersManager />}
        {activeTab === 'contact' && <ContactSubmissionsManager />}
      </div>
    </div>
  );
};

export default Admin;