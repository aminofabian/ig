import { InstagramUserData } from "@/types/instagram";
import { useState } from 'react';

function getProxiedImageUrl(originalUrl: string) {
  return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
}

export default function UserProfile({ user }: { user?: InstagramUserData }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      
      const response = await fetch('/api/save-instagram-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error('Failed to save profile');
      
      setShowConfirm(false);
    } catch (error) {
      setSaveError('Failed to save profile data');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-6">
          <img 
            src={getProxiedImageUrl(user.profile_pic_url)} 
            alt={user.username}
            className="w-24 h-24 rounded-full border-4 border-gray-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{user.username}</h2>
              {user.is_verified && (
                <span className="text-blue-500 text-xl">✓</span>
              )}
            </div>
            <p className="text-gray-600 text-lg">{user.full_name}</p>
            {user.is_private && (
              <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">Private Account</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {user.edge_owner_to_timeline_media?.count.toLocaleString()}
            </div>
            <div className="text-gray-600">Posts</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {user.edge_followed_by?.count.toLocaleString()}
            </div>
            <div className="text-gray-600">Followers</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {user.edge_follow?.count.toLocaleString()}
            </div>
            <div className="text-gray-600">Following</div>
          </div>
        </div>
      </div>

      {/* Bio Card */}
      {user.biography && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Biography</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{user.biography}</p>
        </div>
      )}

      {/* Save Button */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-2 px-4 rounded-md text-white font-medium bg-blue-500 hover:bg-blue-600"
          >
            Connect This Instagram Profile
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-md">
              <p className="text-yellow-800">
                ⚠️ Please confirm this is your Instagram account. This will update your profile with your Instagram information.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                  isSaving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isSaving ? 'Saving...' : 'Confirm & Save'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSaving}
                className="flex-1 py-2 px-4 rounded-md text-gray-700 font-medium bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {saveError && (
          <p className="mt-2 text-red-500 text-sm text-center">{saveError}</p>
        )}
      </div>
    </div>
  );
} 