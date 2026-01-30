export type AlertType =
  | 'every_mention'
  | 'follow_post'
  | 'sentiment_shift'
  | 'spike_detection'
  | 'top_reach'
  | 'x_influencer'
  | 'company_events'
  | 'industry_events'
  | 'likely_boosted'
  | 'page_engagement'
  | 'breakout_post'
  | 'rss_feed';

export interface Alert {
  id: string;
  type: AlertType;
  source: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  metadata?: {
    searchName?: string;
    sentimentFrom?: 'positive' | 'negative' | 'neutral';
    sentimentTo?: 'positive' | 'negative' | 'neutral';
    mentionCount?: number;
    reach?: number;
    engagement?: number;
    platform?: string;
  };
}

export const alertTypeLabels: Record<AlertType, string> = {
  every_mention: 'Every Mention',
  follow_post: 'Follow Post',
  sentiment_shift: 'Sentiment Shift',
  spike_detection: 'Spike Detection',
  top_reach: 'Top Reach',
  x_influencer: 'X Influencer',
  company_events: 'Company Events',
  industry_events: 'Industry Events',
  likely_boosted: 'Likely Boosted',
  page_engagement: 'Page Engagement',
  breakout_post: 'Breakout Post',
  rss_feed: 'RSS Feed',
};

export const alertTypeDescriptions: Record<AlertType, string> = {
  every_mention: 'Sends an alert every time a new mention appears in a search.',
  follow_post: 'Notifies you when there\'s activity on a specific post you\'re following.',
  sentiment_shift: 'Triggers when overall sentiment for a search meaningfully changes.',
  spike_detection: 'Alerts when mention volume suddenly jumps above normal levels.',
  top_reach: 'Flags when a high-reach source mentions your search.',
  x_influencer: 'Notifies when a high-influence X account posts about your search.',
  company_events: 'Alerts when a significant business event is detected for a company.',
  industry_events: 'Alerts on major developments affecting an entire industry.',
  likely_boosted: 'Identifies Facebook posts that are likely being paid-boosted.',
  page_engagement: 'Triggers when a Facebook page\'s engagement is much higher than usual.',
  breakout_post: 'Alerts when a post dramatically outperforms the page\'s average.',
  rss_feed: 'Sends an alert when a new article appears in a connected RSS feed.',
};
