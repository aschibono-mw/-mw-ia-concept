import { MonitorStream as MonitorStreamType } from './types';
import { MonitorFeedItem } from './MonitorFeedItem';
import { BarChart2, Filter, MoreVertical, RefreshCw, Search, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MonitorStreamProps {
  stream: MonitorStreamType;
  onAnalyze: (streamId: string) => void;
  onRemove: (streamId: string) => void;
}

export const MonitorStream = ({ stream, onAnalyze, onRemove }: MonitorStreamProps) => {
  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-w-[340px] max-w-[380px] bg-card rounded-lg border border-border shadow-sm">
      {/* Stream Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <h3 className="font-semibold text-foreground text-sm">{stream.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-muted rounded" title="Filter">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 hover:bg-muted rounded" title="Analyze">
              <BarChart2 
                className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" 
                onClick={() => onAnalyze(stream.id)}
              />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 hover:bg-muted rounded">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card">
                <DropdownMenuItem className="cursor-pointer">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh feed
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Search className="w-4 h-4 mr-2" />
                  Edit search
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => onAnalyze(stream.id)}>
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Analyze stream
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive"
                  onClick={() => onRemove(stream.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove stream
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Search className="w-3 h-3" />
          {stream.searchName}
        </p>
      </div>

      {/* Feed Items - Scrollable */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {stream.items.map((item) => (
            <MonitorFeedItem key={item.id} item={item} />
          ))}
        </div>
      </ScrollArea>

      {/* Stream Footer */}
      <div className="p-3 border-t border-border text-center bg-muted/30">
        <button className="text-xs text-muted-foreground hover:text-foreground hover:underline">
          Load more results
        </button>
      </div>
    </div>
  );
};
