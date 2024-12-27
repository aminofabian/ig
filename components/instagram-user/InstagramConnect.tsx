'use client';
import { useState } from 'react';

interface InstagramUserData {
  username: string;
  full_name?: string;
  biography?: string;
  followers?: number;
  following?: number;
  // Add other fields you need
}

interface InstagramConnectProps {
  onUserData: (data: any) => void;
}

export default function InstagramConnect({ onUserData }: InstagramConnectProps) {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<InstagramUserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      <form onSubmit={handleConnect} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Instagram username"
            className="flex-1 px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {userData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">{userData.username}</h2>
          {userData.full_name && (
            <p className="mb-2">
              <span className="font-semibold">Full Name:</span> {userData.full_name}
            </p>
          )}
          {userData.biography && (
            <p className="mb-2">
              <span className="font-semibold">Bio:</span> {userData.biography}
            </p>
          )}
          <div className="flex gap-4 mt-4">
            <div>
              <span className="font-semibold">Followers:</span>{' '}
              {userData.followers?.toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Following:</span>{' '}
              {userData.following?.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}