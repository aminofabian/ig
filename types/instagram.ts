export interface HashtagPost {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  username: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export interface HashtagSearchResponse {
  data: HashtagPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}


export interface InstagramUserData {
  username?: string;
  full_name?: string;
  biography?: string;
  followers?: number;
  following?: number;
  edge_followed_by?: {
    count: number;
  };
  edge_follow?: {
    count: number;
  };
  [key: string]: any;
}
