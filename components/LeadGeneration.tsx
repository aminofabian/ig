'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { Search, Loader2, Users, Filter, Download } from 'lucide-react';

interface UserData {
  pk?: string;
  username?: string;
  full_name?: string;
  profile_pic_url?: string;
  follower_count?: number;
  following_count?: number;
  media_count?: number;
  biography?: string;
  website?: string;
  is_business?: boolean;
  business_category?: string;
  engagement_rate?: number;
  posts?: Array<{ like_count: number; comment_count: number }>;
  is_verified?: boolean;
  is_private?: boolean;
  taken_at?: number;
}

interface FilterOptions {
  minFollowers: number;
  maxFollowers: number;
  isBusiness: boolean | 'all';
  minEngagementRate: number;
  hasWebsite: boolean | 'all';
  hasBio: boolean | 'all';
}

export default function LeadGeneration() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    minFollowers: 0,
    maxFollowers: 1000000,
    isBusiness: 'all',
    minEngagementRate: 0,
    hasWebsite: 'all',
    hasBio: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (users.length > 0) {
      console.log('Applying filters to users:', users.length); // Debug log
      applyFilters();
    }
  }, [filters, users]);

  const applyFilters = () => {
    console.log('Current filters:', filters); // Debug log
    
    let filtered = users.filter(user => {
      const followerCount = user.follower_count || 0;
      const isBusinessMatch = filters.isBusiness === 'all' ? true : user.is_business === filters.isBusiness;
      const hasWebsiteMatch = filters.hasWebsite === 'all' ? true : (!!user.website === filters.hasWebsite);
      const hasBioMatch = filters.hasBio === 'all' ? true : (!!user.biography === filters.hasBio);
      const engagementMatch = (user.engagement_rate || 0) >= filters.minEngagementRate;

      const matches = followerCount >= filters.minFollowers &&
             followerCount <= filters.maxFollowers &&
             isBusinessMatch &&
             hasWebsiteMatch &&
             hasBioMatch &&
             engagementMatch;

      return matches;
    });

    console.log('Filtered users:', filtered.length); // Debug log
    setFilteredUsers(filtered);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const searchHashtag = async (term: string) => {
    if (!term) {
      toast.error("Please enter a hashtag to search");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/instagram/hashtag?hashtag=${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);

      console.log('API Response:', result); // Debug log

      // Check if we have the expected data structure
      if (!result.data?.items?.length) {
        toast.error("No results found for this hashtag");
        setUsers([]);
        setFilteredUsers([]);
        return;
      }

      // Extract unique users from posts
      const uniqueUsers = new Map();
      
      result.data.items.forEach((item: any) => {
        if (!item.user?.username) return; // Skip if no user data

        const user = {
          pk: item.pk,
          username: item.transformed?.user?.username || item.user?.username,
          full_name: item.transformed?.user?.full_name || item.user?.full_name,
          profile_pic_url: item.transformed?.user?.profile_pic_url || item.user?.profile_pic_url,
          follower_count: item.owner?.follower_count || item.user?.follower_count || 0,
          following_count: item.owner?.following_count || item.user?.following_count || 0,
          media_count: item.owner?.media_count || item.user?.media_count || 0,
          biography: item.owner?.biography || item.user?.biography || '',
          website: item.owner?.external_url || item.owner?.website || item.user?.website || '',
          is_business: item.owner?.is_business || item.owner?.account_type === 3,
          business_category: item.owner?.category || item.user?.business_category || '',
          is_verified: item.owner?.is_verified || false,
          is_private: item.owner?.is_private || false,
          taken_at: item.taken_at,
          engagement_rate: ((item.like_count || 0) + (item.comment_count || 0)) / 100,
          posts: [{
            like_count: item.like_count || 0,
            comment_count: item.comment_count || 0,
            taken_at: item.taken_at
          }]
        };

        console.log('User stats:', {
          username: user.username,
          follower_count: item.owner?.follower_count,
          following_count: item.owner?.following_count,
          media_count: item.owner?.media_count,
        });

        if (uniqueUsers.has(user.username)) {
          // Update existing user's engagement metrics
          const existingUser = uniqueUsers.get(user.username);
          existingUser.posts.push({
            like_count: item.like_count || 0,
            comment_count: item.comment_count || 0,
          });
        } else {
          uniqueUsers.set(user.username, user);
        }
      });

      const extractedUsers = Array.from(uniqueUsers.values());
      console.log('Extracted Users:', extractedUsers);

      if (extractedUsers.length === 0) {
        toast.warning("No user data found in the posts");
      } else {
        setUsers(extractedUsers);
        setFilteredUsers(extractedUsers);
        toast.success(`Found ${extractedUsers.length} potential leads`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Search Error:', err);
      toast.error(errorMessage);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const saveLeads = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          users: filteredUsers,
          hashtag: searchTerm,
        }),
      });

      if (!response.ok) throw new Error('Failed to save leads');
      
      toast.success(`Successfully saved ${filteredUsers.length} leads`);
    } catch (error) {
      toast.error('Failed to save leads');
    } finally {
      setSaving(false);
    }
  };

  const exportToCsv = () => {
    const headers = ['Username', 'Full Name', 'Followers', 'Following', 'Posts', 'Bio', 'Website', 'Business', 'Category', 'Engagement Rate'];
    const csvData = filteredUsers.map(user => [
      user.username,
      user.full_name,
      user.follower_count,
      user.following_count,
      user.media_count,
      user.biography?.replace(/,/g, ' '),
      user.website,
      user.is_business ? 'Yes' : 'No',
      user.business_category,
      `${(user.engagement_rate || 0).toFixed(2)}%`
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${searchTerm}-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getProxiedImageUrl = (originalUrl: string | undefined) => {
    if (!originalUrl) {
      return '/default-profile.png';
    }
    return `/api/instagram/proxy-image?url=${encodeURIComponent(originalUrl)}`;
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      
      {/* Search Section */}
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchHashtag(searchTerm)}
            placeholder="Enter hashtag to find leads..."
            className="flex-1 p-2 border border-white/10 rounded-lg bg-black/50 text-white"
          />
          <button
            onClick={() => searchHashtag(searchTerm)}
            disabled={loading}
            className="px-4 py-2 bg-[#ee46c7] text-white rounded-lg hover:bg-[#f059da] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-black/30 text-white rounded-lg hover:bg-black/40 border border-white/10"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-black/20 p-4 rounded-lg border border-white/10 mb-4">
            <h3 className="text-lg font-semibold mb-4 text-white">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Follower Range */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Follower Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minFollowers}
                    onChange={(e) => setFilters({...filters, minFollowers: parseInt(e.target.value) || 0})}
                    className="w-full p-2 bg-black/30 rounded border border-white/10 text-white"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.maxFollowers}
                    onChange={(e) => setFilters({...filters, maxFollowers: parseInt(e.target.value) || 0})}
                    className="w-full p-2 bg-black/30 rounded border border-white/10 text-white"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Business Account Filter */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Account Type</label>
                <select
                  value={filters.isBusiness === 'all' ? 'all' : filters.isBusiness.toString()}
                  onChange={(e) => setFilters({
                    ...filters,
                    isBusiness: e.target.value === 'all' ? 'all' : e.target.value === 'true'
                  })}
                  className="w-full p-2 bg-black/30 rounded border border-white/10 text-white"
                >
                  <option value="all">All Accounts</option>
                  <option value="true">Business Only</option>
                  <option value="false">Personal Only</option>
                </select>
              </div>

              {/* Engagement Rate Filter */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Min Engagement Rate (%)</label>
                <input
                  type="number"
                  value={filters.minEngagementRate}
                  onChange={(e) => setFilters({...filters, minEngagementRate: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 bg-black/30 rounded border border-white/10 text-white"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>

              {/* Website Filter */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Website</label>
                <select
                  value={filters.hasWebsite === 'all' ? 'all' : filters.hasWebsite.toString()}
                  onChange={(e) => setFilters({
                    ...filters,
                    hasWebsite: e.target.value === 'all' ? 'all' : e.target.value === 'true'
                  })}
                  className="w-full p-2 bg-black/30 rounded border border-white/10 text-white"
                >
                  <option value="all">All</option>
                  <option value="true">Has Website</option>
                  <option value="false">No Website</option>
                </select>
              </div>

              {/* Bio Filter */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Biography</label>
                <select
                  value={filters.hasBio === 'all' ? 'all' : filters.hasBio.toString()}
                  onChange={(e) => setFilters({
                    ...filters,
                    hasBio: e.target.value === 'all' ? 'all' : e.target.value === 'true'
                  })}
                  className="w-full p-2 bg-black/30 rounded border border-white/10 text-white"
                >
                  <option value="all">All</option>
                  <option value="true">Has Bio</option>
                  <option value="false">No Bio</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {filteredUsers.length > 0 && (
        <div className="bg-black/20 rounded-lg p-4 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Found {filteredUsers.length} potential leads
            </h2>
            <div className="flex gap-2">
              <button
                onClick={saveLeads}
                disabled={saving}
                className="px-4 py-2 bg-[#ee46c7] text-white rounded-lg hover:bg-[#f059da] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Leads'}
              </button>
              <button
                onClick={exportToCsv}
                className="px-4 py-2 bg-black/30 text-white rounded-lg hover:bg-black/40 border border-white/10"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div key={user.pk} className="bg-black/30 rounded-lg p-4 border border-white/10">
                {/* Header with Image and Name */}
                <div className="flex items-center gap-3 mb-4">
                  <a
                    href={`https://instagram.com/${user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                  >
                    <img
                      src={getProxiedImageUrl(user.profile_pic_url)}
                      alt={user.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#f059da]/30 transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/default-profile.png';
                      }}
                    />
                  </a>
                  <div>
                    <a
                      href={`https://instagram.com/${user.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white hover:text-[#f059da] transition-colors"
                    >
                      {user.username}
                    </a>
                    <p className="text-sm text-gray-400">{user.full_name}</p>
                    {user.is_business && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                        Business Account
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-black/20 p-2 rounded">
                    <p className="text-lg font-semibold text-white">{user.follower_count?.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Followers</p>
                  </div>
                  <div className="bg-black/20 p-2 rounded">
                    <p className="text-lg font-semibold text-white">{user.following_count?.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Following</p>
                  </div>
                  <div className="bg-black/20 p-2 rounded">
                    <p className="text-lg font-semibold text-white">{user.media_count?.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Posts</p>
                  </div>
                </div>

                {/* Bio and Details */}
                <div className="space-y-3 text-sm">
                  {user.biography && (
                    <div className="bg-black/20 p-3 rounded">
                      <p className="text-gray-300 whitespace-pre-wrap">{user.biography}</p>
                    </div>
                  )}

                  {user.business_category && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="font-semibold">Category:</span>
                      <span>{user.business_category}</span>
                    </div>
                  )}

                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-black/20 p-3 rounded text-blue-400 hover:text-blue-300 truncate"
                    >
                      🔗 {user.website}
                    </a>
                  )}

                  {/* Engagement Metrics */}
                  <div className="bg-black/20 p-3 rounded space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Engagement Rate:</span>
                      <span className="font-semibold text-[#f059da]">
                        {(user.engagement_rate || 0).toFixed(2)}%
                      </span>
                    </div>
                    
                    {user.posts && user.posts.length > 0 && (
                      <div className="text-xs text-gray-400">
                        <p>Recent Post Performance:</p>
                        <div className="mt-1 space-y-1">
                          {user.posts.map((post, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>Post {idx + 1}:</span>
                              <span>
                                ❤️ {post.like_count.toLocaleString()} • 
                                💬 {post.comment_count.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/20 p-2 rounded text-center">
                      <p className="text-xs text-gray-400">Follower/Following Ratio</p>
                      <p className="text-sm text-white font-semibold">
                        {((user.follower_count ?? 0) / (user.following_count || 1)).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-black/20 p-2 rounded text-center">
                      <p className="text-xs text-gray-400">Avg. Engagement</p>
                      <p className="text-sm text-white font-semibold">
                        {user.posts && user.posts.length > 0
                          ? (user.posts.reduce((sum, post) => sum + post.like_count + post.comment_count, 0) / user.posts.length).toFixed(0)
                          : '0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#f059da]" />
          <p className="text-gray-400 mt-4">Searching for leads...</p>
        </div>
      )}

      {!loading && users.length === 0 && searchTerm && (
        <div className="text-center py-12 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
          <p className="text-gray-400 text-lg">No leads found for #{searchTerm}</p>
          <p className="text-gray-500 mt-2">Try another hashtag or adjust your filters</p>
        </div>
      )}
    </div>
  );
} 