import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSave,
  FiX,
  FiSpeaker,
  FiCalendar
} from 'react-icons/fi';
import { supabase } from '../../lib/supabase';

interface Announcement {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

const Communications: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_active: true
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        return;
      }

      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingAnnouncement) {
        // Update existing announcement
        const { error } = await supabase
          .from('announcements')
          .update({
            title: formData.title,
            content: formData.content,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAnnouncement.id);

        if (error) throw error;
      } else {
        // Create new announcement
        const { error } = await supabase
          .from('announcements')
          .insert([
            {
              title: formData.title,
              content: formData.content,
              is_active: formData.is_active
            }
          ]);

        if (error) throw error;
      }

      await fetchAnnouncements();
      resetForm();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement. Please try again.');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      is_active: announcement.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement. Please try again.');
    }
  };

  const toggleStatus = async (announcement: Announcement) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({
          is_active: !announcement.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', announcement.id);

      if (error) throw error;

      await fetchAnnouncements();
    } catch (error) {
      console.error('Error updating announcement status:', error);
      alert('Failed to update announcement status. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      is_active: true
    });
    setEditingAnnouncement(null);
    setShowModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-deepPurple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600 mt-2">Manage announcements that appear on your website</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="bg-deepPurple-600 text-white px-6 py-3 rounded-lg hover:bg-deepPurple-700 transition-colors flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Create Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Announcements</h2>
          <p className="text-sm text-gray-600">Manage your website announcements</p>
        </div>

        <div className="divide-y divide-gray-200">
          {announcements.length === 0 ? (
            <div className="p-12 text-center">
              <FiSpeaker className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
              <p className="text-gray-600 mb-4">Create your first announcement to display on your website</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-deepPurple-600 text-white px-4 py-2 rounded-lg hover:bg-deepPurple-700 transition-colors"
              >
                Create Announcement
              </button>
            </div>
          ) : (
            announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {announcement.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          announcement.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {announcement.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {announcement.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>Created {formatDate(announcement.created_at)}</span>
                      </div>
                      {announcement.updated_at !== announcement.created_at && (
                        <div className="flex items-center space-x-1">
                          <span>•</span>
                          <span>Updated {formatDate(announcement.updated_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleStatus(announcement)}
                      className={`p-2 rounded-lg transition-colors ${
                        announcement.is_active
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title={announcement.is_active ? 'Hide announcement' : 'Show announcement'}
                    >
                      {announcement.is_active ? (
                        <FiEye className="w-5 h-5" />
                      ) : (
                        <FiEyeOff className="w-5 h-5" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit announcement"
                    >
                      <FiEdit3 className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete announcement"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent"
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent"
                  placeholder="Enter announcement content (this will be displayed on your website)"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This text will appear in the announcement banner at the top of your website
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-deepPurple-600 border-gray-300 rounded focus:ring-deepPurple-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Make this announcement active (visible on website)
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-deepPurple-600 text-white rounded-lg hover:bg-deepPurple-700 transition-colors flex items-center space-x-2"
                >
                  <FiSave className="w-5 h-5" />
                  <span>{editingAnnouncement ? 'Update' : 'Create'} Announcement</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Communications; 
