import React, { useState, useEffect } from 'react';
import { Mail, Calendar, MessageCircle, CheckCircle, Eye, Archive, X, Loader2, Filter } from 'lucide-react';
import { contactApi, ContactSubmission, NewsletterSubscription } from '../../lib/supabase';

const ContactSubmissionsManager = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'contact' | 'newsletter'>('contact');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contactData, newsletterData] = await Promise.all([
        contactApi.getContactSubmissions(),
        contactApi.getNewsletterSubscriptions()
      ]);
      setSubmissions(contactData);
      setNewsletters(newsletterData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'new' | 'read' | 'resolved' | 'archived') => {
    try {
      await contactApi.updateContactSubmissionStatus(id, status);
      await loadData();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      general: 'General Information',
      volunteer: 'Volunteering',
      programs: 'Program Information',
      partnership: 'Partnership Opportunities'
    };
    return labels[type] || type;
  };

  const filteredSubmissions = filterStatus === 'all'
    ? submissions
    : submissions.filter(s => s.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#5d00c1]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Contact & Newsletter Management</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView('contact')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                activeView === 'contact'
                  ? 'bg-[#5d00c1] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageCircle className="inline mr-2" size={18} />
              Contact Submissions ({submissions.length})
            </button>
            <button
              onClick={() => setActiveView('newsletter')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                activeView === 'newsletter'
                  ? 'bg-[#5d00c1] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Mail className="inline mr-2" size={18} />
              Newsletter ({newsletters.filter(n => n.status === 'active').length})
            </button>
          </div>
        </div>

        {activeView === 'contact' ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <Filter size={18} className="text-gray-600" />
              <div className="flex space-x-2">
                {['all', 'new', 'read', 'resolved', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-[#5d00c1] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
                <p>No contact submissions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{submission.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {submission.status}
                          </span>
                          <span className="text-xs text-gray-500">{getTypeLabel(submission.type)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <Mail className="inline mr-1" size={14} />
                          {submission.email}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">{submission.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          <Calendar className="inline mr-1" size={12} />
                          {new Date(submission.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="p-2 bg-white rounded-lg hover:bg-[#5d00c1] hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {submission.status !== 'resolved' && (
                          <button
                            onClick={() => updateStatus(submission.id, 'resolved')}
                            className="p-2 bg-white rounded-lg hover:bg-green-500 hover:text-white transition-colors"
                            title="Mark as Resolved"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {submission.status !== 'archived' && (
                          <button
                            onClick={() => updateStatus(submission.id, 'archived')}
                            className="p-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white transition-colors"
                            title="Archive"
                          >
                            <Archive size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#5d00c1] to-[#4a0096] p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">Total Subscribers</h3>
                <p className="text-4xl font-bold">{newsletters.length}</p>
              </div>
              <div className="bg-gradient-to-br from-[#00c019] to-[#00a015] p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">Active</h3>
                <p className="text-4xl font-bold">{newsletters.filter(n => n.status === 'active').length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">Unsubscribed</h3>
                <p className="text-4xl font-bold">{newsletters.filter(n => n.status === 'unsubscribed').length}</p>
              </div>
            </div>

            {newsletters.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Mail className="mx-auto mb-4 text-gray-400" size={48} />
                <p>No newsletter subscriptions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscribed At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {newsletters.map((newsletter) => (
                      <tr key={newsletter.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {newsletter.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            newsletter.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {newsletter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(newsletter.subscribed_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Submission Details</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedSubmission.status}
                  onChange={(e) => updateStatus(selectedSubmission.id, e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{selectedSubmission.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <a href={`mailto:${selectedSubmission.email}`} className="text-[#5d00c1] hover:underline">
                  {selectedSubmission.email}
                </a>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Type</label>
                <p className="text-gray-900">{getTypeLabel(selectedSubmission.type)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">
                  {selectedSubmission.message}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                <p className="text-gray-900">{new Date(selectedSubmission.created_at).toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submission ID</label>
                <p className="text-gray-500 text-sm font-mono">{selectedSubmission.id}</p>
              </div>

              {selectedSubmission.recaptcha_score !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spam Score</label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedSubmission.recaptcha_score >= 0.7
                        ? 'bg-green-100 text-green-800'
                        : selectedSubmission.recaptcha_score >= 0.5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedSubmission.recaptcha_score.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {selectedSubmission.recaptcha_score >= 0.7
                        ? 'Likely human'
                        : selectedSubmission.recaptcha_score >= 0.5
                          ? 'Borderline'
                          : 'Likely bot'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {selectedSubmission.status !== 'resolved' && (
                <button
                  onClick={() => updateStatus(selectedSubmission.id, 'resolved')}
                  className="px-4 py-2 bg-[#00c019] text-white font-semibold rounded-xl hover:bg-[#00a015] transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissionsManager;
