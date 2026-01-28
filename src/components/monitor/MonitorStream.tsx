import { useState, useEffect, useRef, useCallback } from 'react';
import { MonitorStream as MonitorStreamType, FeedItem } from './types';
import { MonitorFeedItem } from './MonitorFeedItem';
import { BarChart2, Filter, MoreVertical, RefreshCw, Search, Trash2, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

// Generate additional feed items for infinite scroll
const generateMoreItems = (searchName: string, startIndex: number, count: number): FeedItem[] => {
  const sources = ['Reuters', 'Associated Press', 'Bloomberg', 'CNBC', 'Wall Street Journal', 'Financial Times', 'Forbes', 'TechCrunch', 'The Verge', 'Wired'];
  const authors = ['Sarah Johnson', 'Michael Chen', 'Emma Williams', 'David Park', 'Lisa Thompson', 'James Miller', 'Alex Rivera', 'Chris Martinez', 'Nina Patel', 'Robert Kim'];
  const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'negative', 'neutral'];
  const timeUnits = ['m', 'h', 'd'];
  
  const titles = [
    'Breaking: Major Developments Unfold',
    'Analysis: Market Trends Shift Direction',
    'Report: Industry Leaders Respond',
    'Update: New Strategies Emerge',
    'Exclusive: Behind the Scenes Look',
    'Opinion: What This Means for the Future',
    'Deep Dive: Understanding the Impact',
    'News: Stakeholders React to Changes',
    'Feature: Innovation Takes Center Stage',
    'Review: Performance Metrics Revealed',
  ];

  const contents = [
    'Industry experts weigh in on the latest developments, highlighting key factors that could shape the market in coming months.',
    'Analysts are closely monitoring these changes, with many suggesting significant implications for stakeholders across the sector.',
    'The announcement has sparked widespread discussion among market participants and observers alike.',
    'Sources close to the matter reveal new details about the strategic direction being considered.',
    'This development marks a significant shift in how the industry approaches these challenges.',
    'Market watchers are divided on the long-term implications, with varying predictions for future outcomes.',
    'The latest data suggests a notable trend that could impact decision-making across the board.',
    'Experts highlight the importance of staying informed as situations continue to evolve rapidly.',
  ];

  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    return {
      id: `${searchName}-${index}`,
      source: sources[index % sources.length],
      author: authors[index % authors.length],
      timestamp: `${Math.floor(Math.random() * 59) + 1}${timeUnits[Math.floor(Math.random() * timeUnits.length)]} ago`,
      title: `${titles[index % titles.length]} - ${searchName}`,
      content: contents[index % contents.length],
      reach: Math.floor(Math.random() * 150000) + 5000,
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    };
  });
};

interface MonitorStreamProps {
  stream: MonitorStreamType;
  onAnalyze: (streamId: string) => void;
  onRemove: (streamId: string) => void;
}

export const MonitorStream = ({ stream, onAnalyze, onRemove }: MonitorStreamProps) => {
  const [items, setItems] = useState<FeedItem[]>(stream.items);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newItems = generateMoreItems(stream.searchName, items.length, 5);
      setItems(prev => [...prev, ...newItems]);
      setIsLoading(false);
    }, 500);
  }, [isLoading, items.length, stream.searchName]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { 
        threshold: 0.1,
        root: scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]') 
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, isLoading]);

  // Reset items when stream changes
  useEffect(() => {
    setItems(stream.items);
  }, [stream.items]);

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

      {/* Feed Items - Scrollable with Infinite Loading */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-3">
          {items.map((item) => (
            <MonitorFeedItem key={item.id} item={item} />
          ))}
          
          {/* Infinite scroll loader */}
          <div ref={loaderRef} className="py-4 flex justify-center">
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading more...
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
