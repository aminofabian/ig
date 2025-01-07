'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsCard from '@/components/AnalyticsCard';

interface AnalyticsSummary {
  totalPosts: number;
  followerGrowth: number;
  topHashtags: Array<{
    name: string;
    avgLikes: number;
  }>;
}

interface Analytics {
  summary: AnalyticsSummary;
  // Add other analytics properties if needed
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/instagram-analytics');
        const data = await response.json();
        setAnalytics({
          summary: {
            totalPosts: data.postsCount || 0,
            followerGrowth: data.followersCount || 0,
            topHashtags: [] // Add your hashtags data here if needed
          }
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <AnalyticsCard />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#f059da]">
              {analytics?.summary?.totalPosts?.toLocaleString() || '0'}
            </p>
          </CardContent>
        </Card>
        {/* Other cards... */}
      </div>
    </div>
  );
} 