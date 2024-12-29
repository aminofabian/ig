export interface HashtagAnalytics {
  id: string;
  name: string;
  mediaCount: number;
  avgLikes: number;
  avgComments: number;
  createdAt: string;
}

export interface EngagementTrend {
  date: string;
  likes: number;
  comments: number;
  posts: number;
} 