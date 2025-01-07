'use client';
import { useState, useEffect } from 'react';

interface InstagramUserData {
  username: string;
  full_name?: string;
  biography?: string;
  followers?: number;
  following?: number;
  posts?: number;
  verified?: boolean;
  private?: boolean;
  profile_pic_url?: string;
}

interface InstagramConnectProps {
  onUserData: (data: any) => void;
}

export default function InstagramConnect({ onUserData }: InstagramConnectProps) {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<InstagramUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('/api/instagram-profile');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch profile data');
        }
        
        setUserData(data);
        onUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [onUserData]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/instagram-contact?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user data');
      }
      
      setUserData(data);
      onUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-[#f059da]/10 rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-white mb-4">Instagram Profile Connection</h1>
          <form onSubmit={handleConnect} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Instagram username"
                className="flex-1 px-4 py-2 border rounded bg-[#f059da]/15 text-white"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#f059da] text-white rounded hover:bg-[#d441bf] disabled:bg-[#f059da]/50 transition-colors"
              >
                {loading ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </form>

          {error && (
            <div className="text-red-500 mb-4 p-4 bg-red-500/10 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-[#f059da]/10 rounded-lg p-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-8 bg-[#f059da]/20 rounded w-1/3"></div>
            <div className="h-4 bg-[#f059da]/20 rounded w-1/4"></div>
            <div className="h-20 bg-[#f059da]/20 rounded w-full"></div>
          </div>
        </div>
      ) : userData ? (
        <div className="bg-[#f059da]/10 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {userData.profile_pic_url && (
                  <img 
                    src={userData.profile_pic_url} 
                    alt={userData.username}
                    className="w-16 h-16 rounded-full hidden"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white mb-2">@{userData.username}</h2>
                    {userData.verified && (
                      <span className="text-blue-500">✓</span>
                    )}
                    {userData.private && (
                      <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">Private</span>
                    )}
                  </div>
                  {userData.full_name && (
                    <h3 className="text-gray-300 text-lg">{userData.full_name}</h3>
                  )}
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {userData.posts?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-gray-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {userData.followers?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {userData.following?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-gray-400">Following</div>
                </div>
              </div>
            </div>
            {userData.biography && (
              <div className="mt-4 p-4 bg-[#f059da]/5 rounded-lg">
                <p className="text-gray-300 whitespace-pre-wrap">{userData.biography}</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}