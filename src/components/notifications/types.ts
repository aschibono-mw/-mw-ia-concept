export type NotificationType =
  | 'export_complete'
  | 'report_ready'
  | 'search_updated'
  | 'share_received'
  | 'limit_warning'
  | 'subscription_update'
  | 'maintenance'
  | 'feature_announcement'
  | 'integration_status'
  | 'team_invite';

export interface SystemNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

export const notificationTypeLabels: Record<NotificationType, string> = {
  export_complete: 'Export Complete',
  report_ready: 'Report Ready',
  search_updated: 'Search Updated',
  share_received: 'Shared With You',
  limit_warning: 'Limit Warning',
  subscription_update: 'Subscription',
  maintenance: 'Maintenance',
  feature_announcement: 'New Feature',
  integration_status: 'Integration',
  team_invite: 'Team Invite',
};
