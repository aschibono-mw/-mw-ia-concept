import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SystemNotification {
  id: string;
  name: string;
  description: string;
  channels: string;
  enabled: boolean;
}

const initialNotifications: SystemNotification[] = [
  { id: '1', name: 'Publish Assignment', description: 'Alert me when I have a new assigned post in Publish Engage', channels: 'Email, In-app', enabled: true },
  { id: '2', name: 'Publish Approval', description: 'Alert me when I have a new approved post in Publish Engage', channels: 'Email, In-app', enabled: true },
  { id: '3', name: 'Downloads', description: 'Alert me when my files are ready', channels: 'Email, In-app', enabled: true },
  { id: '4', name: 'Historical data retrieval', description: 'Alert me when my historical data retrieval is finished', channels: 'Email, In-app', enabled: false },
  { id: '5', name: 'Contact updates', description: 'Alert me when contacts on media lists have their profiles updated', channels: 'Email, In-app', enabled: true },
  { id: '6', name: 'Alerts Error', description: "Alert me if an alert doesn't run properly", channels: 'Email, In-app', enabled: true },
];

export const ManageNotificationsTab = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    );
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        System notifications for Meltwater features and activity
      </p>

      <div className="bg-card rounded-lg border border-border">
        {/* Section Header */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">System notifications</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>Configure which system notifications you receive</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Notification Rows */}
        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{notification.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{notification.description}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-8">
                <span className="text-sm text-muted-foreground">{notification.channels}</span>
                <Switch
                  checked={notification.enabled}
                  onCheckedChange={() => toggleNotification(notification.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
