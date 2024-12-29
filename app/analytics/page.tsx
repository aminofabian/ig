'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Loader2 } from 'lucide-react';

interface HashtagAnalytics {
  id: string;
  name: string;
  mediaCount: number;
  avgLikes: number;
  avgComments: number;
  createdAt: string;
}

interface EngagementTrend {
  date: string;
  likes: number;
  comments: number;
  posts: number;
}

export default function AnalyticsPage() {
  const [hashtags, setHashtags] = useState<HashtagAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'likes' | 'comments' | 'posts'>('likes');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  // Fetch saved hashtags
  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const response = await fetch('/api/hashtags');
        const data = await response.json();
        setHashtags(data);
      } catch (error) {
        console.error('Error fetching hashtags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHashtags();
  }, []);

  // Calculate engagement metrics
  const calculateEngagementRate = (likes: number, comments: number, mediaCount: number) => {
    return ((likes + comments) / mediaCount * 100).toFixed(2);
  };

  // Generate mock trend data (replace with real data in production)
  const generateTrendData = (days: number): EngagementTrend[] => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toISOString().split('T')[0],
        likes: Math.floor(Math.random() * 1000) + 500,
        comments: Math.floor(Math.random() * 200) + 50,
        posts: Math.floor(Math.random() * 20) + 5,
      };
    });
  };

  const trendData = generateTrendData(timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#f059da]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Hashtag Analytics Dashboard</h1>
        <div className="flex gap-4">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as 'likes' | 'comments' | 'posts')}
            className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
          >
            <option value="likes">Likes</option>
            <option value="comments">Comments</option>
            <option value="posts">Posts</option>
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
                dataKey="date" 
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

      {/* Hashtag Performance Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-white">Hashtag Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hashtags}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
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
                <Bar dataKey="avgLikes" fill="#f059da" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Hashtags */}
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-white">Top Performing Hashtags</h2>
          <div className="space-y-4">
            {hashtags
              .sort((a, b) => {
                const engagementA = Number(calculateEngagementRate(a.avgLikes || 0, a.avgComments || 0, a.mediaCount || 0));
                const engagementB = Number(calculateEngagementRate(b.avgLikes || 0, b.avgComments || 0, b.mediaCount || 0));
                return engagementB - engagementA;
              })
              .slice(0, 5)
              .map((hashtag) => (
                <div 
                  key={hashtag.id}
                  className="flex justify-between items-center p-4 bg-black/30 rounded-lg border border-white/10"
                >
                  <div>
                    <h3 className="text-white font-medium">#{hashtag.name}</h3>
                    <p className="text-sm text-gray-400">
                      Engagement Rate: {calculateEngagementRate(hashtag.avgLikes || 0, hashtag.avgComments || 0, hashtag.mediaCount || 0)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#f059da]">{(hashtag.avgLikes || 0).toLocaleString()} avg likes</p>
                    <p className="text-sm text-gray-400">{(hashtag.mediaCount || 0).toLocaleString()} posts</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 