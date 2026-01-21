import { useState, useEffect, useRef, useCallback } from "react";
import { 
  TrendingUp, 
  Search, 
  Globe, 
  Sparkles, 
  FileText, 
  Mail, 
  Flag,
  LayoutGrid,
  ChevronDown,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["All", "Mine", "My team", "Searches", "Mentions", "GenAI", "Alerts", "Publishing", "Outreach"];

interface ActivityItem {
  id: number;
  icon: React.ReactNode;
  content: React.ReactNode;
  time: string;
}

const names = ["David Kim", "Laura Bennett", "Sophia Patel", "Rachel Wu", "Tom Nguyen", "Alex Morgan", "James Chen", "Emily Davis", "Michael Brown", "Sarah Wilson"];
const actions = [
  { action: "created a search", link: "Brand + Earnings Risk" },
  { action: "edited a search", link: "Competitor Watch" },
  { action: "scheduled a Newsletter", link: "The Daily Media Brief" },
  { action: "sent a pitch", link: "AI Leadership in 2025" },
  { action: "flagged a mention", link: "WSJ — Leadership Change Reported" },
  { action: "created a dashboard", link: "Market Share Tracker" },
  { action: "shared a report", link: "Q4 Media Analysis" },
  { action: "updated a dashboard", link: "Executive Visibility" },
];
const systemEvents = [
  { text: "Spike detected:", link: "Brand mentions in Finance (+43%)" },
  { text: "Sentiment shift detected:", link: "Negative tone in Europe" },
  { text: "Geography shift detected:", link: "Conversation moved from US to APAC" },
  { text: "Topic surge detected:", link: '"AI regulation"' },
  { text: "Volume increase:", link: "Social media mentions up 28%" },
  { text: "New trend identified:", link: "ESG discussions rising" },
];
const times = ["5 mins ago", "10 mins ago", "30 mins ago", "1 hr ago", "2 hrs ago", "3 hrs ago", "6 hrs ago", "10 hrs ago", "Yesterday", "2 days ago", "3 days ago", "5 days ago", "1 week ago"];
const icons = [TrendingUp, Search, Globe, Sparkles, FileText, Mail, Flag, LayoutGrid];

const generateActivity = (id: number): ActivityItem => {
  const isUserAction = Math.random() > 0.4;
  const Icon = icons[Math.floor(Math.random() * icons.length)];
  const time = times[Math.floor(Math.random() * times.length)];
  
  if (isUserAction) {
    const name = names[Math.floor(Math.random() * names.length)];
    const { action, link } = actions[Math.floor(Math.random() * actions.length)];
    return {
      id,
      icon: (
        <div className="flex items-center gap-1">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">👤</div>
        </div>
      ),
      content: (
        <><span className="font-semibold text-primary cursor-pointer">{name}</span> {action}: <span className="font-semibold underline cursor-pointer">{link}</span></>
      ),
      time
    };
  } else {
    const { text, link } = systemEvents[Math.floor(Math.random() * systemEvents.length)];
    const useEmoji = Math.random() > 0.7;
    return {
      id,
      icon: useEmoji ? <span className="text-sm">😐→😟</span> : <Icon className="w-4 h-4 text-muted-foreground" />,
      content: (
        <>{text} <span className="font-semibold underline cursor-pointer">{link}</span></>
      ),
      time
    };
  }
};

const initialActivities: ActivityItem[] = [
  {
    id: 1,
    icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />,
    content: (
      <>Spike detected: <span className="font-semibold underline cursor-pointer">Brand mentions in Finance (+43%)</span></>
    ),
    time: "5 mins ago"
  },
  {
    id: 2,
    icon: (
      <div className="flex items-center gap-1">
        <Search className="w-4 h-4 text-muted-foreground" />
        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">👤</div>
      </div>
    ),
    content: (
      <><span className="font-semibold text-primary cursor-pointer">David Kim</span> created a search: <span className="font-semibold underline cursor-pointer">Brand + Earnings Risk</span></>
    ),
    time: "10 mins ago"
  },
  {
    id: 3,
    icon: <span className="text-sm">😐→😟</span>,
    content: (
      <>Sentiment shift detected: <span className="font-semibold underline cursor-pointer">Negative tone in Europe</span></>
    ),
    time: "3 hrs ago"
  },
  {
    id: 4,
    icon: <Globe className="w-4 h-4 text-muted-foreground" />,
    content: (
      <>Geography shift detected: <span className="font-semibold underline cursor-pointer">Conversation moved from US to APAC</span></>
    ),
    time: "6 hrs ago"
  },
  {
    id: 5,
    icon: <Sparkles className="w-4 h-4 text-muted-foreground" />,
    content: (
      <>GenAI generated a summary: <span className="font-semibold underline cursor-pointer">Today's global media coverage</span></>
    ),
    time: "10 hrs ago"
  },
  {
    id: 6,
    icon: (
      <div className="flex items-center gap-1">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">👤</div>
      </div>
    ),
    content: (
      <><span className="font-semibold text-primary cursor-pointer">Laura Bennett</span> scheduled a Newsletter: <span className="font-semibold underline cursor-pointer">The Daily Media Brief</span></>
    ),
    time: "Yesterday"
  },
  {
    id: 7,
    icon: (
      <div className="flex items-center gap-1">
        <Search className="w-4 h-4 text-muted-foreground" />
        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">👤</div>
      </div>
    ),
    content: (
      <><span className="font-semibold text-primary cursor-pointer">Sophia Patel</span> edited a search: <span className="font-semibold underline cursor-pointer">Competitor Watch</span></>
    ),
    time: "Yesterday"
  },
  {
    id: 8,
    icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />,
    content: (
      <>Topic surge detected: <span className="font-semibold underline cursor-pointer">"AI regulation"</span></>
    ),
    time: "2 days ago"
  },
  {
    id: 9,
    icon: (
      <div className="flex items-center gap-1">
        <Mail className="w-4 h-4 text-muted-foreground" />
        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">👤</div>
      </div>
    ),
    content: (
      <><span className="font-semibold text-primary cursor-pointer">Rachel Wu</span> sent a pitch: <span className="font-semibold underline cursor-pointer">AI Leadership in 2025</span></>
    ),
    time: "3 days ago"
  },
  {
    id: 10,
    icon: (
      <div className="flex items-center gap-1">
        <Flag className="w-4 h-4 text-muted-foreground" />
        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">👤</div>
      </div>
    ),
    content: (
      <><span className="font-semibold text-primary cursor-pointer">Tom Nguyen</span> flagged a mention: <span className="font-semibold underline cursor-pointer">WSJ — Leadership Change Reported</span></>
    ),
    time: "5 days ago"
  },
  {
    id: 11,
    icon: (
      <div className="flex items-center gap-1">
        <LayoutGrid className="w-4 h-4 text-muted-foreground" />
        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">👤</div>
      </div>
    ),
    content: (
      <><span className="font-semibold text-primary cursor-pointer">Alex Morgan</span> created a dashboard: <span className="font-semibold underline cursor-pointer">Market Share Tracker</span></>
    ),
    time: "5 days ago"
  },
  // Additional items to make the page scroll
  ...Array.from({ length: 15 }, (_, i) => generateActivity(12 + i))
];

export const ActivityFeed = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const newActivities = Array.from({ length: 10 }, (_, i) => 
        generateActivity(activities.length + i + 1)
      );
      setActivities(prev => [...prev, ...newActivities]);
      setIsLoading(false);
      // Stop after 100 items for demo purposes
      if (activities.length >= 90) {
        setHasMore(false);
      }
    }, 500);
  }, [isLoading, hasMore, activities.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">What's happening now</h2>
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          Last 7 days
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-border pb-3 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
              activeTab === tab
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-0">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 py-3 border-b border-border last:border-b-0"
          >
            <div className="flex-shrink-0 w-8 flex justify-center">
              {activity.icon}
            </div>
            <div className="flex-1 text-sm text-card-foreground">
              {activity.content}
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </div>
          </div>
        ))}
      </div>

      {/* Loader */}
      <div ref={loaderRef} className="flex justify-center py-4">
        {isLoading && (
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        )}
        {!hasMore && (
          <span className="text-sm text-muted-foreground">No more activities</span>
        )}
      </div>
    </div>
  );
};
