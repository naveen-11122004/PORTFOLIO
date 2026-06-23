import React, { useState, useEffect } from 'react';
import { LogOut, Upload, Save, Lock, Mail, Github, Linkedin, User, FileText, Image as ImageIcon, Eye, EyeOff, Loader, X, Award, Trash2, Plus } from 'lucide-react';

interface AdminProps {
  onLogout: () => void;
  token: string;
  onViewPortfolio?: () => void;
}

export default function AdminPanel({ onLogout, token, onViewPortfolio }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'image' | 'resume' | 'certifications' | 'links' | 'security'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile data
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    bio: '',
    linkedin: '',
    github: '',
    resumeName: ''
  });

  // Security data
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // File upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Certifications states
  const [certifications, setCertifications] = useState<any[]>([]);
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  });
  const [certFile, setCertFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (profile.id) {
      fetchCertifications();
    }
  }, [profile.id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile({
          id: data._id || '',
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          resumeName: data.resumeName || ''
        });

        // Fetch profile image if exists
        if (data.profileImage || data._id) {
          const imageResponse = await fetch(`/api/files/profile-image/${data._id}`);
          if (imageResponse.ok) {
            const blob = await imageResponse.blob();
            setPreviewUrl(URL.createObjectURL(blob));
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchCertifications = async () => {
    if (!profile.id) return;
    try {
      const response = await fetch(`/api/files/certifications/${profile.id}`);
      if (response.ok) {
        const data = await response.json();
        setCertifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch certifications:', err);
    }
  };

  const handleCreateCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.issuer || !newCert.issueDate) {
      setError('Title, Issuer, and Issue Date are required');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', profile.id);
      formData.append('title', newCert.title);
      formData.append('issuer', newCert.issuer);
      formData.append('issueDate', newCert.issueDate);
      if (newCert.expiryDate) formData.append('expiryDate', newCert.expiryDate);
      if (newCert.credentialId) formData.append('credentialId', newCert.credentialId);
      if (newCert.credentialUrl) formData.append('credentialUrl', newCert.credentialUrl);
      if (certFile) formData.append('file', certFile);

      const response = await fetch('/api/files/certification', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add certification');
        return;
      }

      setMessage('Certification added successfully!');
      setNewCert({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: ''
      });
      setCertFile(null);
      fetchCertifications();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCert = async (certId: string) => {
    if (!window.confirm("Are you sure you want to delete this certification?")) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const response = await fetch(`/api/files/certification/${certId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Delete failed');
        return;
      }
      setMessage('Certification deleted successfully!');
      fetchCertifications();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadResume(file);
    }
  };

  const uploadResume = async (file: File) => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/auth/resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Resume upload failed');
        return;
      }

      setMessage('Resume uploaded successfully!');
      setProfile(prev => ({ ...prev, resumeName: file.name }));
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during resume upload');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          linkedin: profile.linkedin,
          github: profile.github
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Update failed');
        return;
      }

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', profile.email);

      const response = await fetch('/api/auth/profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      setMessage('Profile image updated successfully!');
      setSelectedFile(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Change failed');
        return;
      }

      setMessage('Password changed successfully!');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-[95%] w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Manage your portfolio settings</p>
          </div>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {onViewPortfolio && (
              <button
                onClick={onViewPortfolio}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition shrink-0 cursor-pointer shadow-lg shadow-purple-600/20"
              >
                <Eye size={18} />
                <span>View Portfolio</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition shrink-0 cursor-pointer shadow-lg shadow-red-600/20"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800 border border-purple-500/30 rounded-lg overflow-hidden mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'profile' as const, label: 'Profile Info', icon: User },
              { id: 'image' as const, label: 'Profile Image', icon: ImageIcon },
              { id: 'resume' as const, label: 'Resume', icon: FileText },
              { id: 'certifications' as const, label: 'Certifications', icon: Award },
              { id: 'links' as const, label: 'Social Links', icon: Linkedin },
              { id: 'security' as const, label: 'Security', icon: Lock }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-gray-300 border-b-2 border-transparent'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-8">
          {/* Profile Info Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-slate-700 border border-purple-500/30 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-slate-700 border border-purple-500/30 rounded px-4 py-2 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Write something about yourself..."
                    rows={5}
                    className="w-full bg-slate-700 border border-purple-500/30 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {message && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded p-4 text-green-300">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded p-4 text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-2 px-6 rounded transition"
                >
                  {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Profile Image Tab */}
          {activeTab === 'image' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Profile Image</h2>

              <form onSubmit={handleImageUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">Upload Image</label>

                  {previewUrl && (
                    <div className="mb-6 relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded-lg border-2 border-purple-500"
                      />
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl('');
                          }}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 text-center hover:border-purple-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-input"
                    />
                    <label
                      htmlFor="image-input"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <ImageIcon size={32} className="text-purple-400 mb-2" />
                      <p className="text-gray-300">Click to upload or drag and drop</p>
                      <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 50MB</p>
                    </label>
                  </div>
                </div>

                {message && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded p-4 text-green-300">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded p-4 text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !selectedFile}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-2 px-6 rounded transition"
                >
                  {loading ? <Loader size={20} className="animate-spin" /> : <Upload size={20} />}
                  Upload Image
                </button>
              </form>
            </div>
          )}

          {/* Resume Tab */}
          {activeTab === 'resume' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Resume</h2>
              <div className="bg-slate-700 border border-purple-500/30 rounded-lg p-6 text-center">
                <FileText size={48} className="text-purple-400 mx-auto mb-4" />
                {profile.resumeName ? (
                  <p className="text-green-400 mb-4 font-mono text-sm">
                    Current file: {profile.resumeName}
                  </p>
                ) : (
                  <p className="text-gray-300 mb-4">No resume uploaded yet</p>
                )}
                <label className="inline-block">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    className="hidden" 
                    onChange={handleResumeSelect}
                  />
                  <span className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded cursor-pointer transition inline-block">
                    <Upload size={20} className="inline mr-2" />
                    {profile.resumeName ? 'Change Resume' : 'Upload Resume'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Manage Certifications</h2>

                {/* List of existing certifications */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-white">Current Certifications ({certifications.length})</h3>
                  {certifications.length === 0 ? (
                    <p className="text-gray-400 text-sm">No certifications uploaded to the database yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certifications.map((cert) => (
                        <div key={cert._id} className="bg-slate-700 border border-purple-500/20 rounded-lg p-4 flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold truncate text-sm">{cert.title}</h4>
                            <p className="text-purple-400 text-xs mt-1 font-semibold">{cert.issuer}</p>
                            <p className="text-gray-400 text-[10px] mt-1">
                              Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A'}
                            </p>
                            {cert.certificateFile && (
                              <a 
                                href={`/api/files/certification/${cert._id}/file`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold inline-flex items-center gap-1 mt-2.5"
                              >
                                <Eye size={14} />
                                <span>View Certificate</span>
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteCert(cert._id)}
                            className="p-2 bg-red-950/40 text-red-400 hover:bg-red-900/40 hover:text-red-300 rounded-lg transition shrink-0 cursor-pointer"
                            title="Delete Certification"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Create/Upload Form */}
                <div className="bg-slate-700/40 border border-purple-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus size={20} className="text-purple-400" />
                    <span>Add New Certification</span>
                  </h3>

                  <form onSubmit={handleCreateCert} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Certification Title *</label>
                        <input
                          type="text"
                          required
                          value={newCert.title}
                          onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                          placeholder="e.g. Google Cloud Architect"
                          className="w-full bg-slate-700 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Issuer *</label>
                        <input
                          type="text"
                          required
                          value={newCert.issuer}
                          onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                          placeholder="e.g. Google Cloud"
                          className="w-full bg-slate-700 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Issue Date *</label>
                        <input
                          type="date"
                          required
                          value={newCert.issueDate}
                          onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                          className="w-full bg-slate-700 border border-purple-500/30 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Expiry Date (Optional)</label>
                        <input
                          type="date"
                          value={newCert.expiryDate}
                          onChange={(e) => setNewCert({ ...newCert, expiryDate: e.target.value })}
                          className="w-full bg-slate-700 border border-purple-500/30 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Credential ID (Optional)</label>
                        <input
                          type="text"
                          value={newCert.credentialId}
                          onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                          placeholder="e.g. 123456"
                          className="w-full bg-slate-700 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Credential URL (Optional)</label>
                        <input
                          type="url"
                          value={newCert.credentialUrl}
                          onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                          placeholder="e.g. https://credentials.google.com/..."
                          className="w-full bg-slate-700 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Certificate Proof Document (Image or PDF)</label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-slate-600 hover:bg-slate-500 border border-purple-500/30 text-white text-xs px-4 py-2 rounded font-semibold transition inline-block">
                          <Upload size={14} className="inline mr-1.5" />
                          Choose File
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                          />
                        </label>
                        <span className="text-gray-300 text-xs truncate max-w-xs">
                          {certFile ? certFile.name : 'No file selected'}
                        </span>
                      </div>
                    </div>

                    {message && (
                      <div className="bg-green-900/20 border border-green-500/30 rounded p-3.5 text-green-300 text-xs">
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-900/20 border border-red-500/30 rounded p-3.5 text-red-300 text-xs">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-2 px-6 rounded text-sm transition cursor-pointer"
                    >
                      {loading ? <Loader size={16} className="animate-spin" /> : <Award size={16} />}
                      <span>Add Certification</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'links' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Social Media Links</h2>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Linkedin size={18} className="inline mr-2" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full bg-slate-700 border border-purple-500/30 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Github size={18} className="inline mr-2" />
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    placeholder="https://github.com/yourprofile"
                    className="w-full bg-slate-700 border border-purple-500/30 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {message && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded p-4 text-green-300">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded p-4 text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-2 px-6 rounded transition"
                >
                  {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
                  Save Links
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div className="bg-slate-700 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Lock size={20} />
                    Change Password
                  </h3>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwords.currentPassword}
                          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                          className="w-full bg-slate-600 border border-purple-500/30 rounded pl-10 pr-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-purple-400 hover:text-purple-300"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwords.newPassword}
                          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                          className="w-full bg-slate-600 border border-purple-500/30 rounded pl-10 pr-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwords.confirmPassword}
                          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                          className="w-full bg-slate-600 border border-purple-500/30 rounded pl-10 pr-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {message && (
                      <div className="bg-green-900/20 border border-green-500/30 rounded p-4 text-green-300">
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-900/20 border border-red-500/30 rounded p-4 text-red-300">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-2 px-6 rounded transition"
                    >
                      {loading ? <Loader size={20} className="animate-spin" /> : <Lock size={20} />}
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
