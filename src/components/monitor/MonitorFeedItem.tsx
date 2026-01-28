import { FeedItem } from './types';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MoreVertical, BarChart2, Eye, User, FileText, Pin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MonitorFeedItemProps {
  item: FeedItem;
}

export const MonitorFeedItem = ({ item }: MonitorFeedItemProps) => {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'negative':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatReach = (reach?: number) => {
    if (!reach) return null;
    if (reach >= 1000000) return `${(reach / 1000000).toFixed(1)}M`;
    if (reach >= 1000) return `${(reach / 1000).toFixed(1)}K`;
    return reach.toString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">{item.source}</span>
          {item.handle && (
            <span className="text-primary">{item.handle}</span>
          )}
          {item.author && !item.handle && (
            <span className="text-muted-foreground">· {item.author}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{item.timestamp}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-muted rounded">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card">
              <DropdownMenuItem className="cursor-pointer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open source
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <BarChart2 className="w-4 h-4 mr-2" />
                Analyze
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Open author profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in new tab
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FileText className="w-4 h-4 mr-2" />
                View content details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Pin className="w-4 h-4 mr-2" />
                Pin to newsletter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title */}
      {item.title && (
        <h4 className="font-semibold text-foreground mb-2 leading-tight hover:text-primary cursor-pointer">
          {item.title}
        </h4>
      )}

      {/* Content */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
        {item.content}
      </p>

      {/* Image if present */}
      {item.imageUrl && (
        <div className="mb-3 rounded-md overflow-hidden">
          <img src={item.imageUrl} alt="" className="w-full h-32 object-cover" />
        </div>
      )}

      {/* Mentions */}
      {item.mentions && item.mentions.length > 0 && (
        <div className="mb-3">
          <span className="text-xs text-muted-foreground">Mentions: </span>
          {item.mentions.map((mention, idx) => (
            <span key={idx} className="text-xs text-primary">
              {mention}{idx < item.mentions!.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2">
        {item.reach && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span>{formatReach(item.reach)}</span>
          </div>
        )}
        {item.sentiment && (
          <Badge 
            variant="secondary" 
            className={cn('text-xs capitalize', getSentimentColor(item.sentiment))}
          >
            {item.sentiment}
          </Badge>
        )}
      </div>
    </div>
  );
};
