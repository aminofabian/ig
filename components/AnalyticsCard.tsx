'use client';
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";

interface InstagramAnalytics {
  instagram: string | null;
  instagramProfileId: string | null;
  instagramVerified: boolean;
  instagramPrivate: boolean;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  instagramBio: string | null;
  instagramFullName: string | null;
  instagramImage: string | null;
}

function getProxiedImageUrl(originalUrl: string | null): string | undefined {
  if (!originalUrl) return undefined;
  return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
}

export default function AnalyticsCard() {
  const [data, setData] = useState<InstagramAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/instagram-analytics');
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError('Failed to load Instagram analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-white text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-400 text-center p-8">{error}</div>;
  if (!data?.instagram) return (
    <div className="text-white text-center p-8">
      No Instagram profile connected. Please connect your profile first.
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Instagram Analytics Dashboard
      </h1>
      
      {/* Profile Overview */}
      <Card className="bg-gray-900/60 border border-gray-800">
        <div className="p-6 flex items-center gap-6">
          {data.instagramImage && (
            <img 
              src={getProxiedImageUrl(data.instagramImage)} 
              alt={data.instagram || ''} 
              className="w-20 h-20 rounded-full border-2 border-blue-500"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-white">{data.instagram}</h2>
              {data.instagramVerified && (
                <span className="text-blue-400 text-xl">✓</span>
              )}
            </div>
            <p className="text-gray-300 text-lg">{data.instagramFullName}</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Posts', value: data.postsCount },
          { label: 'Followers', value: data.followersCount },
          { label: 'Following', value: data.followingCount }
        ].map(({ label, value }) => (
          <Card key={label} className="bg-gray-900/60 border border-gray-800">
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {value.toLocaleString()}
              </div>
              <div className="text-gray-300 text-lg">{label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bio Section */}
      {data.instagramBio && (
        <Card className="bg-gray-900/60 border border-gray-800">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Biography</h3>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {data.instagramBio}
            </p>
          </div>
        </Card>
      )}

      {/* Account Info */}
      <Card className="bg-gray-900/60 border border-gray-800">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-300">Account Type</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                data.instagramPrivate 
                  ? 'bg-red-500/20 text-red-300' 
                  : 'bg-green-500/20 text-green-300'
              }`}>
                {data.instagramPrivate ? 'Private' : 'Public'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-300">Verification Status</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                data.instagramVerified 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : 'bg-gray-500/20 text-gray-300'
              }`}>
                {data.instagramVerified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 