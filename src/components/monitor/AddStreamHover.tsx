import { useState } from 'react';
import { ExploreSearch } from './types';
import { Plus, Search, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AddStreamHoverProps {
  existingSearches: ExploreSearch[];
  onSelectSearch: (search: ExploreSearch) => void;
  onCreateNew: () => void;
}

const categoryColors: Record<string, string> = {
  Brand: 'bg-blue-500/10 text-blue-600 border-blue-200',
  Policy: 'bg-purple-500/10 text-purple-600 border-purple-200',
  Leadership: 'bg-amber-500/10 text-amber-600 border-amber-200',
  Competition: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  Social: 'bg-rose-500/10 text-rose-600 border-rose-200',
  Custom: 'bg-slate-500/10 text-slate-600 border-slate-200',
};

export const AddStreamHover = ({
  existingSearches,
  onSelectSearch,
  onCreateNew,
}: AddStreamHoverProps) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredSearches = existingSearches.filter((search) =>
    search.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Group by category
  const groupedSearches = filteredSearches.reduce((acc, search) => {
    const category = search.category || 'Custom';
    if (!acc[category]) acc[category] = [];
    acc[category].push(search);
    return acc;
  }, {} as Record<string, ExploreSearch[]>);

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <button
          className="group flex flex-col items-center justify-center min-w-[280px] h-[calc(100vh-280px)] border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <Plus className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 animate-scale-in">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
          </div>
          <span className="mt-3 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            Add Stream
          </span>
          <span className="text-xs text-muted-foreground/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Hover for quick add
          </span>
        </button>
      </HoverCardTrigger>
      
      <HoverCardContent 
        side="left" 
        align="start"
        sideOffset={12}
        className="w-80 p-0 bg-card border-border shadow-xl animate-scale-in"
      >
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">Quick Add from Explore</h4>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search saved searches..."
              className="pl-9 h-9 text-sm bg-background"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>
        
        <div className="max-h-[320px] overflow-y-auto p-2">
          {Object.entries(groupedSearches).map(([category, searches]) => (
            <div key={category} className="mb-3 last:mb-0">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {category}
              </div>
              {searches.map((search, index) => (
                <button
                  key={search.id}
                  onClick={() => onSelectSearch(search)}
                  onMouseEnter={() => setHoveredId(search.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    'w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-200',
                    'hover:bg-primary/5 hover:translate-x-1',
                    hoveredId === search.id && 'bg-primary/5'
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn(
                      'w-2 h-2 rounded-full shrink-0 transition-transform duration-200',
                      hoveredId === search.id ? 'scale-150 bg-primary' : 'bg-muted-foreground/30'
                    )} />
                    <span className="text-sm font-medium truncate">{search.name}</span>
                  </div>
                  <ArrowRight className={cn(
                    'w-4 h-4 text-muted-foreground transition-all duration-200 shrink-0',
                    hoveredId === search.id ? 'opacity-100 translate-x-0 text-primary' : 'opacity-0 -translate-x-2'
                  )} />
                </button>
              ))}
            </div>
          ))}
          
          {filteredSearches.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No searches found</p>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-border bg-muted/20">
          <button
            onClick={onCreateNew}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create new search & stream
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
