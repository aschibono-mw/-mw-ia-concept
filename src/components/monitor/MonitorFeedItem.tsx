import { FeedItem } from './types';
import {
  ExternalLink, MoreVertical, BarChart2, Eye, User, FileText, Pin,
  Twitter, Radio, ChevronDown, ThumbsUp, ArrowUpRight,
  Play, SkipBack, SkipForward, RotateCcw, RotateCw,
  XCircle, CheckCircle2, Circle,
} from 'lucide-react';
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
  selected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
}

const formatReach = (reach?: number): string | null => {
  if (!reach) return null;
  if (reach >= 1000000) return `${(reach / 1000000).toFixed(1)}M`;
  if (reach >= 1000) return `${(reach / 1000).toFixed(1)}k`;
  return reach.toString();
};

const highlightKeyword = (text: string, keyword?: string): React.ReactNode => {
  if (!keyword || !text) return text;
  try {
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <span key={i} className="text-primary font-medium">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  } catch {
    return text;
  }
};

const SentimentBadge = ({ sentiment }: { sentiment?: string }) => {
  if (!sentiment) return null;
  const config: Record<string, { Icon: React.ElementType; color: string; label: string }> = {
    positive: { Icon: CheckCircle2, color: 'text-green-500', label: 'Positive' },
    negative: { Icon: XCircle, color: 'text-red-500', label: 'Negative' },
    neutral:  { Icon: Circle,       color: 'text-gray-400', label: 'Neutral' },
  };
  const { Icon, color, label } = config[sentiment] ?? config.neutral;
  return (
    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:bg-muted rounded px-1.5 py-0.5 border border-border/60">
      <Icon className={cn('w-3.5 h-3.5', color)} />
      <span>{label}</span>
      <ChevronDown className="w-2.5 h-2.5 opacity-50" />
    </button>
  );
};

const SourceAvatar = ({ item }: { item: FeedItem }) => {
  const avatarColors = ['bg-teal-500', 'bg-purple-500', 'bg-blue-500', 'bg-indigo-500', 'bg-pink-500'];
  const colorIdx = item.id.charCodeAt(0) % avatarColors.length;

  if (item.mediaType === 'social') {
    const initials = (item.source ?? '??').slice(0, 2).toUpperCase();
    return (
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0', avatarColors[colorIdx])}>
        {initials}
      </div>
    );
  }
  if (item.mediaType === 'reddit') {
    return (
      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-extrabold leading-none">R</span>
      </div>
    );
  }
  if (item.mediaType === 'radio') {
    const initials = (item.source ?? '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    return (
      <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[9px] font-bold leading-none">{initials || 'FM'}</span>
      </div>
    );
  }
  // News — gray circle with initials
  const initials = (item.source ?? '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
      <span className="text-muted-foreground text-[9px] font-bold leading-none">{initials}</span>
    </div>
  );
};

const AudioPlayer = ({ duration = '10:00' }: { duration?: string }) => (
  <div className="mt-3 rounded-lg border border-border bg-muted/20 p-2.5">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <button className="p-1 hover:bg-muted rounded"><SkipBack className="w-3.5 h-3.5 text-muted-foreground" /></button>
        <button className="p-1 hover:bg-muted rounded"><RotateCcw className="w-3.5 h-3.5 text-muted-foreground" /></button>
        <button className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center shadow">
          <Play className="w-3.5 h-3.5 text-background fill-background ml-0.5" />
        </button>
        <button className="p-1 hover:bg-muted rounded"><RotateCw className="w-3.5 h-3.5 text-muted-foreground" /></button>
        <button className="p-1 hover:bg-muted rounded"><SkipForward className="w-3.5 h-3.5 text-muted-foreground" /></button>
      </div>
      <span className="text-xs text-muted-foreground font-mono tabular-nums">06:12 / {duration}</span>
      <button className="text-[10px] text-muted-foreground hover:text-foreground border border-border rounded px-1.5 py-0.5">
        Speed
      </button>
    </div>
    {/* Progress bar */}
    <div className="mt-2 relative h-1.5 bg-border rounded-full">
      <div className="absolute left-0 top-0 h-full w-[62%] bg-primary rounded-full" />
      <div className="absolute top-1/2 -translate-y-1/2 left-[62%] w-3 h-3 -ml-1.5 bg-primary rounded-full shadow-sm ring-2 ring-background" />
    </div>
    <div className="flex justify-between mt-1">
      <span className="text-[10px] text-muted-foreground">00:00</span>
      <span className="text-[10px] text-muted-foreground">{duration}</span>
    </div>
  </div>
);

export const MonitorFeedItem = ({ item, selected = false, onSelect }: MonitorFeedItemProps) => {
  const isSocial = item.mediaType === 'social';
  const isRadio  = item.mediaType === 'radio';
  const isReddit = item.mediaType === 'reddit';

  // Avatar hides and checkbox shows on hover OR when the item is selected
  const showCheckbox = selected; // always visible when selected; hover handled via CSS

  return (
    <div className={cn(
      'group bg-card border rounded-lg p-3.5 hover:shadow-md transition-shadow',
      selected ? 'border-primary/40 bg-primary/5' : 'border-border',
    )}>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 min-w-0">
          {/* Avatar / checkbox toggle */}
          <div className="relative flex-shrink-0 w-8 h-8">
            {/* Avatar: hide on hover OR when selected */}
            <div className={cn(
              'absolute inset-0 transition-opacity',
              showCheckbox ? 'opacity-0' : 'group-hover:opacity-0',
            )}>
              <SourceAvatar item={item} />
            </div>
            {/* Checkbox: show on hover OR when selected */}
            <div className={cn(
              'absolute inset-0 transition-opacity flex items-center justify-center',
              showCheckbox ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            )}>
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => onSelect?.(item.id, e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer rounded"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="min-w-0">
            {/* Name / handle row */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-semibold text-sm text-foreground leading-tight">
                {isReddit ? `reddit.com/${item.subreddit ?? 'r/topic'}` : item.source}
              </span>
              {item.handle && (
                <span className="text-xs text-muted-foreground">· {item.handle}</span>
              )}
              {isReddit && item.author && (
                <span className="text-xs text-muted-foreground">· {item.author}</span>
              )}
            </div>
            {/* Platform / country / timestamp row */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              {item.platform ? (
                <>
                  {item.platform === 'X' && <Twitter className="w-3 h-3" />}
                  {item.platform === 'Radio' && <Radio className="w-3 h-3" />}
                  {item.platform === 'Reddit' && (
                    <span className="text-orange-500 font-extrabold text-[10px] leading-none">R</span>
                  )}
                  <span>{item.platform}</span>
                  {item.country && <><span>|</span><span>{item.country}</span></>}
                  <span>|</span>
                  <span>{item.timestamp}</span>
                </>
              ) : (
                <>
                  {item.author && <span>{item.author}</span>}
                  {item.author && <span>·</span>}
                  <span>{item.timestamp}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Kabob menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-muted rounded flex-shrink-0 -mt-0.5">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card">
            <DropdownMenuItem className="cursor-pointer">
              <ExternalLink className="w-4 h-4 mr-2" />Open source
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <BarChart2 className="w-4 h-4 mr-2" />Analyze
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />Open author profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FileText className="w-4 h-4 mr-2" />View content details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Pin className="w-4 h-4 mr-2" />Pin to newsletter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Title (news / reddit / radio only) ── */}
      {item.title && !isSocial && (
        <h4 className="font-semibold text-sm text-foreground mb-1.5 leading-tight hover:text-primary cursor-pointer">
          {item.title}
        </h4>
      )}

      {/* ── Content ── */}
      <div className={cn('text-sm text-muted-foreground leading-relaxed', !isSocial ? 'line-clamp-2' : 'line-clamp-3')}>
        {isSocial && item.imageUrl ? (
          <div className="flex gap-2">
            <span className="flex-1">{highlightKeyword(item.content, item.keyword)}</span>
            <img src={item.imageUrl} alt="" className="w-14 h-14 rounded object-cover flex-shrink-0" />
          </div>
        ) : (
          highlightKeyword(item.content, item.keyword)
        )}
      </div>

      {/* ── Audio player (radio) ── */}
      {isRadio && <AudioPlayer duration={item.audioDuration} />}

      {/* ── Keyword tag ── */}
      {item.keyword && !isRadio && (
        <div className="mt-2">
          <span className="inline-block text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {item.keyword}
          </span>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        <SentimentBadge sentiment={item.sentiment} />

        {item.reach != null && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span>{formatReach(item.reach)} Reach</span>
          </div>
        )}

        {isSocial && item.likes != null && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ThumbsUp className="w-3 h-3" />
            <span>{item.likes}</span>
          </div>
        )}

        {item.views != null && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span>{item.views} Views</span>
          </div>
        )}

        {(isSocial || isReddit) && (
          <button className="ml-auto p-1 hover:bg-muted rounded">
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
};
