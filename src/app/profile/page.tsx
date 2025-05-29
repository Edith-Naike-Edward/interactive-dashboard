"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Building, MapPin, Shield, Edit3, Save, X, Lock, Key } from 'lucide-react';

interface UserData {
  id?: number;
  name: string;
  email: string;
  role: string;
  organisation: string;
  site_id: number;
  site_name?: string;
  is_active?: boolean;
}

interface Site {
  site_id: number;
  name: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editForm, setEditForm] = useState<UserData>({
    name: '',
    email: '',
    role: '',
    organisation: '',
    site_id: 0
  });

  useEffect(() => {
  const loadUserProfile = async () => {
    const token = localStorage.getItem('token');
    console.log('Loading user profile with token:', token);
    
    if (!token) {
      router.push('/');
      return;
    }

    try {
      // Fetch all users
      const response = await fetch('http://localhost:8010/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/');
          return;
        }
        throw new Error('Failed to load profile');
      }

      const allUsers = await response.json();
      
      // Decode token to get current user's email
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentUserEmail = tokenPayload.sub; // 'edith_naike27@students.uonbi.ac.ke'
      
      // Find current user in the array
      const currentUser = allUsers.find((user: UserData) => user.email === currentUserEmail);
      
      if (!currentUser) {
        throw new Error('Current user not found in response');
      }

      console.log('Current user data:', currentUser);
      setUser(currentUser);
      setEditForm(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      await loadSites();

    // Wait for sites to be loaded (might need state management if loadSites is async)
    const sitesResponse = await fetch('http://localhost:8010/api/sites', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!sitesResponse.ok) throw new Error('Failed to load sites');
    const allSites: Site[] = await sitesResponse.json();

    // Find matching site and add site_name to user object
    const userSite = allSites.find(site => site.site_id === currentUser.site_id);
    const userWithSite = {
      ...currentUser,
      site_name: userSite?.name || 'Unknown Site'
    };

    console.log('User with site data:', userWithSite);
    setUser(userWithSite);
    setEditForm(userWithSite);
    localStorage.setItem('user', JSON.stringify(userWithSite));
    } catch (error) {
      console.error('Error loading user profile:', error);
        // Fallback to localStorage data
        const localUserData = localStorage.getItem('user');
        if (localUserData) {
        try {
            const parsedUser = JSON.parse(localUserData);
            console.log('Using localStorage user data:', parsedUser);
            setUser(parsedUser);
            setEditForm(parsedUser);
        } catch (parseError) {
            console.error('Error parsing localStorage user data:', parseError);
            router.push('/');
        }
        } else {
        router.push('/');
        }
    } finally {
      setIsLoading(false);
    }
  };

  loadUserProfile();
}, [router]);

  const loadSites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8010/api/sites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to load sites');
      const data: Site [] = await response.json();
      setSites(data);

      // If we already have a user, update their site_name
        if (user) {
        const userSite = data.find(site => site.site_id === user.site_id);
        if (userSite) {
            setUser(prev => prev ? { ...prev, site_name: userSite.name } : null);
        }
        }
    } catch (error) {
      console.error('Error loading sites:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8010/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          role: editForm.role,
          organisation: editForm.organisation,
          site_id: editForm.site_id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update both local state and localStorage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      
      // Update site name
      const userSite = sites.find(site => site.site_id === updatedUser.site_id);
      if (userSite) {
        setUser(prev => prev ? { ...prev, site_name: userSite.name } : null);
      }
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error instanceof Error ? error.message : 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditForm(user);
    }
    setIsEditing(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters long!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8010/api/users/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to change password');
      }

      alert('Password changed successfully!');
      setShowPasswordForm(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error instanceof Error ? error.message : 'Failed to change password. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User not found</h2>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-blue-600">
                  {getInitials(user.name)}
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <p className="text-blue-100 mt-1">{user.role}</p>
                <p className="text-blue-100 text-sm">{user.organisation}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4" />
                  <span>Full Name</span>
                </label>
                {isEditing ? (
                  <>
                    <label htmlFor="name" className="block mb-1 font-medium">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                {isEditing ? (
                  <>
                    <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user.email}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Shield className="w-4 h-4" />
                  <span>Role</span>
                </label>
                {isEditing ? (
                  <>
                    <label htmlFor="role" className="block mb-1 font-medium">Role</label>
                    <input
                      id="role"
                      type="text"
                      value={editForm.role}
                      onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user.role}</p>
                )}
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Building className="w-4 h-4" />
                  <span>Organization</span>
                </label>
                {isEditing ? (
                  <>
                    <label htmlFor="organisation" className="block mb-1 font-medium">Organisation</label>
                    <input
                      id="organisation"
                      type="text"
                      placeholder="Enter organisation name"
                      value={editForm.organisation}
                      onChange={(e) => setEditForm(prev => ({ ...prev, organisation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user.organisation}</p>
                )}
              </div>

              {/* Health Facility */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4" />
                  <span>Health Facility</span>
                </label>
                {isEditing ? (
                  <div>
                    <label htmlFor="site_id" className="block mb-1 font-medium">Site</label>
                    <select
                      id="site_id"
                      value={editForm.site_id}
                      onChange={(e) => setEditForm(prev => ({ ...prev, site_id: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a health facility</option>
                      {sites.map((site) => (
                        <option key={site.site_id} value={site.site_id}>
                          {site.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {user.site_name || 'Loading...'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Key className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          </div>
          
          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                    <label htmlFor="currentPassword" className="block mb-1 font-medium">Current Password</label>
                    <input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({...prev, currentPassword: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                    <label htmlFor="newPassword" className="block mb-1 font-medium">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({...prev, newPassword: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <label htmlFor="confirmPassword" className="block mb-1 font-medium">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({...prev, confirmPassword: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({currentPassword: '', newPassword: '', confirmPassword: ''});
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Account Status</span>
              <p className={`mt-1 font-medium ${user?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {user?.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">User ID</span>
              <p className="mt-1 text-gray-900">#{user?.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}