import {
  Download,
  FileText,
  RefreshCw,
  Share2,
  AlertTriangle,
  CreditCard,
  Wrench,
  Sparkles,
  Link,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { NotificationType } from './types';

export const notificationTypeIcons: Record<NotificationType, LucideIcon> = {
  export_complete: Download,
  report_ready: FileText,
  search_updated: RefreshCw,
  share_received: Share2,
  limit_warning: AlertTriangle,
  subscription_update: CreditCard,
  maintenance: Wrench,
  feature_announcement: Sparkles,
  integration_status: Link,
  team_invite: UserPlus,
};

export const getNotificationIcon = (type: NotificationType): LucideIcon => {
  return notificationTypeIcons[type];
};
