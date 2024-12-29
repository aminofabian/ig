'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface InstagramSnapshot {
  id: string;
  timestamp: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

interface EngagementTrend {
  timestamp: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

interface Analytics {
  snapshots: InstagramSnapshot[];
  hashtags: {
    id: string;
    name: string;
    postsCount: number;
    avgLikes: number;
    avgComments: number;
    searchedAt: string;
  }[];
  summary: {
    totalPosts: number;
    followerGrowth: number;
    topHashtags: any[];
  };
}

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'postsCount' | 'followersCount' | 'followingCount'>('followersCount');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/instagram-analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchAnalytics();
    }
  }, [session?.user?.id]);

  // Format data for charts
  const formatTrendData = (data: InstagramSnapshot[]): EngagementTrend[] => {
    return data.map(snapshot => ({
      timestamp: new Date(snapshot.timestamp).toLocaleDateString(),
      postsCount: snapshot.postsCount,
      followersCount: snapshot.followersCount,
      followingCount: snapshot.followingCount
    }));
  };

  const trendData = formatTrendData(analytics?.snapshots || []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <Loader2 className="w-8 h-8 animate-spin text-[#f059da]/90" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#f059da]">
              {analytics?.summary.totalPosts.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Follower Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#f059da]">
              {(analytics?.summary.followerGrowth ?? 0) > 0 ? '+' : ''}
              {(analytics?.summary.followerGrowth ?? 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Top Hashtag</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#f059da]">
              #{analytics?.summary.topHashtags[0]?.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-400">
              {analytics?.summary.topHashtags[0]?.avgLikes.toLocaleString()} avg likes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Hashtag Analytics Dashboard</h1>
        <div className="flex gap-4">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as 'postsCount' | 'followersCount' | 'followingCount')}
            className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
          >
            <option value="postsCount">Posts</option>
            <option value="followersCount">Followers</option>
            <option value="followingCount">Following</option>
          </select>
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as '7d' | '30d' | '90d')}
            className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4 text-white">Engagement Trends</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="timestamp" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.5)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.5)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#f059da" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hashtag Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Hashtag Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.hashtags.slice(0, 5).map((hashtag) => (
                <div 
                  key={hashtag.id}
                  className="flex justify-between items-center p-4 bg-black/30 rounded-lg"
                >
                  <div>
                    <h3 className="text-white font-medium">#{hashtag.name}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(hashtag.searchedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#f059da]">{hashtag.avgLikes.toLocaleString()} avg likes</p>
                    <p className="text-sm text-gray-400">{hashtag.postsCount.toLocaleString()} posts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-white">
              <p>
                <span className="font-semibold">Account Growth:</span> Your account has 
                {(analytics?.summary.followerGrowth ?? 0) > 0 ? ' gained ' : ' lost '}
                {Math.abs(analytics?.summary.followerGrowth ?? 0).toLocaleString()} followers
                since first snapshot.
              </p>
              <p>
                <span className="font-semibold">Content Performance:</span> Your most engaging hashtag
                is #{analytics?.summary.topHashtags[0]?.name} with an average of
                {' '}{analytics?.summary.topHashtags[0]?.avgLikes.toLocaleString()} likes per post.
              </p>
              <p>
                <span className="font-semibold">Posting Activity:</span> You have shared
                {' '}{analytics?.summary.totalPosts.toLocaleString()} posts in total.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/20 backdrop-blur-sm border-white/10 mt-6">
        <CardHeader>
          <CardTitle className="text-white">All Hashtags Ranked</CardTitle>
          <p className="text-sm text-gray-400">Sorted by average likes</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics?.hashtags
              .sort((a, b) => (b.avgLikes ?? 0) - (a.avgLikes ?? 0))
              .map((hashtag, index) => (
                <div 
                  key={hashtag.id}
                  className="flex items-center p-4 bg-black/30 rounded-lg border border-white/10"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f059da]/10 text-[#f059da] font-bold mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">#{hashtag.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{hashtag.avgLikes.toLocaleString()} avg likes</span>
                      <span>•</span>
                      <span>{hashtag.postsCount.toLocaleString()} posts</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 