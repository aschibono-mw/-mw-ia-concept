export interface FeedItem {
  id: string;
  source: string;
  sourceIcon?: string;
  author?: string;
  handle?: string;
  timestamp: string;
  title?: string;
  content: string;
  reach?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  imageUrl?: string;
  mentions?: string[];
}

export interface MonitorStream {
  id: string;
  name: string;
  searchId: string;
  searchName: string;
  items: FeedItem[];
}

export interface MonitorCanvas {
  id: string;
  name: string;
  streams: MonitorStream[];
}

export interface ExploreSearch {
  id: string;
  name: string;
  category: string;
}
