import {
  MessageCircle,
  Reply,
  TrendingUp,
  TrendingDown,
  Zap,
  Megaphone,
  Twitter,
  Building2,
  Factory,
  DollarSign,
  BarChart3,
  Flame,
  Rss,
  type LucideIcon,
} from 'lucide-react';
import { AlertType } from './types';

export const alertTypeIcons: Record<AlertType, LucideIcon> = {
  every_mention: MessageCircle,
  follow_post: Reply,
  sentiment_shift: TrendingUp,
  spike_detection: Zap,
  top_reach: Megaphone,
  x_influencer: Twitter,
  company_events: Building2,
  industry_events: Factory,
  likely_boosted: DollarSign,
  page_engagement: BarChart3,
  breakout_post: Flame,
  rss_feed: Rss,
};

export const getAlertIcon = (type: AlertType): LucideIcon => {
  return alertTypeIcons[type];
};
