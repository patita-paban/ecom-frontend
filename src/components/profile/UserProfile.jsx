import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaKey,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaBox,
  FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../../api/api';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    addresses: 0
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
      fetchUserStats();
    }
  }, [user]);
  
  const fetchUserStats = async () => {
    try {
      // Fetch user orders to calculate stats
      const { data } = await api.get('/user/orders');
      const orders = data.content || data;
      
      setStats({
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        addresses: user.addresses?.length || 0
      });
    } catch (error) {
      console.log('Error fetching stats:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email) {
      toast.error('Username and email are required');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await api.put('/user/profile', {
        username: formData.username,
        email: formData.email
      });
      
      // Update user in Redux store
      dispatch({ type: 'UPDATE_USER', payload: data });
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await api.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-indigo-600 text-6xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 mx-auto flex items-center justify-center mb-4">
                  <FaUser className="text-white text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {user.username}
                </h2>
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <FaEnvelope className="text-indigo-500" />
                  {user.email}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {user.roles?.map((role, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700"
                    >
                      {role.roleName?.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="space-y-3">
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <FaShoppingBag className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <FaBox className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{formatPrice(stats.totalSpent)}</p>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.addresses}</p>
                    <p className="text-sm text-gray-600">Saved Addresses</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/orders')}
                  className="w-full px-4 py-2 text-left rounded-lg hover:bg-indigo-50 transition-colors text-gray-700"
                >
                  📦 My Orders
                </button>
                <button 
                  onClick={() => navigate('/cart')}
                  className="w-full px-4 py-2 text-left rounded-lg hover:bg-indigo-50 transition-colors text-gray-700"
                >
                  🛒 Shopping Cart
                </button>
                <button 
                  onClick={() => navigate('/products')}
                  className="w-full px-4 py-2 text-left rounded-lg hover:bg-indigo-50 transition-colors text-gray-700"
                >
                  🛍️ Continue Shopping
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Profile Details & Settings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaUser className="inline mr-2" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'security'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaKey className="inline mr-2" />
                  Security
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'profile' ? (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Profile Details</h2>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <FaEdit />
                          Edit Profile
                        </button>
                      )}
                    </div>
                    
                    <form onSubmit={handleUpdateProfile}>
                      <div className="space-y-6">
                        {/* Username */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="username"
                              value={formData.username}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                              placeholder="Enter username"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                              {user.username}
                            </div>
                          )}
                        </div>
                        
                        {/* Email */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                              placeholder="Enter email"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                              {user.email}
                            </div>
                          )}
                        </div>
                        
                        {/* User ID */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            User ID
                          </label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500 font-mono">
                            {user.id || user.userId}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        {isEditing && (
                          <div className="flex gap-3 pt-4">
                            <button
                              type="submit"
                              disabled={loading}
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                            >
                              {loading ? (
                                <>
                                  <FaSpinner className="animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <FaSave />
                                  Save Changes
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                  username: user.username,
                                  email: user.email,
                                });
                              }}
                              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <FaTimes />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
                    
                    <form onSubmit={handleChangePassword}>
                      <div className="space-y-6">
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="Enter current password"
                          />
                        </div>
                        
                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="Enter new password"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Password must be at least 6 characters long
                          </p>
                        </div>
                        
                        {/* Confirm New Password */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="Confirm new password"
                          />
                        </div>
                        
                        {/* Submit Button */}
                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            {loading ? (
                              <>
                                <FaSpinner className="animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <FaKey />
                                Change Password
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
