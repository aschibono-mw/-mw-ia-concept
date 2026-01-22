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
  Loader2,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["All", "Mine", "My team", "Searches", "Dashboards", "Mentions", "GenAI", "Alerts", "Publishing", "Outreach"];

type ActivityType = "search" | "dashboard" | "newsletter" | "pitch" | "mention" | "alert" | "genai" | "publishing" | "outreach";

interface ActivityItem {
  id: number;
  type: ActivityType;
  icon: React.ReactNode;
  content: React.ReactNode;
  time: string;
  isSystem?: boolean;
}

// Consistent data matching other pages
const initialActivities: ActivityItem[] = [
  {
    id: 1,
    type: "alert",
    icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />,
    content: (
      <>Spike detected: <span className="font-medium underline cursor-pointer">Brand mentions in Finance (+43%)</span></>
    ),
    time: "5 mins ago",
    isSystem: true
  },
  {
    id: 2,
    type: "search",
    icon: <Search className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">David Kim</span> created a search: <span className="font-medium underline cursor-pointer">Brand + Earnings Risk</span></>
    ),
    time: "10 mins ago"
  },
  {
    id: 3,
    type: "dashboard",
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">Rachel Wu</span> updated a dashboard: <span className="font-medium underline cursor-pointer">Executive Visibility Report</span></>
    ),
    time: "1 hr ago"
  },
  {
    id: 4,
    type: "alert",
    icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />,
    content: (
      <>Sentiment shift detected: <span className="font-medium underline cursor-pointer">Negative tone in Europe</span></>
    ),
    time: "3 hrs ago",
    isSystem: true
  },
  {
    id: 5,
    type: "dashboard",
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">Sophia Patel</span> created a dashboard: <span className="font-medium underline cursor-pointer">Brand Health Dashboard</span></>
    ),
    time: "5 hrs ago"
  },
  {
    id: 6,
    type: "alert",
    icon: <Globe className="w-4 h-4 text-muted-foreground" />,
    content: (
      <>Geography shift detected: <span className="font-medium underline cursor-pointer">Conversation moved from US to APAC</span></>
    ),
    time: "6 hrs ago",
    isSystem: true
  },
  {
    id: 7,
    type: "genai",
    icon: <Sparkles className="w-4 h-4 text-muted-foreground" />,
    content: (
      <>GenAI generated a summary: <span className="font-medium underline cursor-pointer">Today's global media coverage</span></>
    ),
    time: "10 hrs ago",
    isSystem: true
  },
  {
    id: 8,
    type: "publishing",
    icon: <FileText className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">Laura Bennett</span> scheduled a newsletter: <span className="font-medium underline cursor-pointer">The Daily Media Brief</span></>
    ),
    time: "Yesterday"
  },
  {
    id: 9,
    type: "search",
    icon: <Search className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">Tom Nguyen</span> edited a search: <span className="font-medium underline cursor-pointer">Competitor Monitoring</span></>
    ),
    time: "Yesterday"
  },
  {
    id: 10,
    type: "dashboard",
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">Tom Nguyen</span> shared a dashboard: <span className="font-medium underline cursor-pointer">Competitor Benchmark</span></>
    ),
    time: "Yesterday"
  },
  {
    id: 11,
    type: "alert",
    icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />,
    content: (
      <>Topic surge detected: <span className="font-medium underline cursor-pointer">"AI regulation"</span></>
    ),
    time: "2 days ago",
    isSystem: true
  },
  {
    id: 12,
    type: "outreach",
    icon: <Mail className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">Rachel Wu</span> sent a pitch: <span className="font-medium underline cursor-pointer">Executive Visibility Report</span></>
    ),
    time: "2 days ago"
  },
  {
    id: 13,
    type: "dashboard",
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">David Kim</span> created a dashboard: <span className="font-medium underline cursor-pointer">Audience Insights</span></>
    ),
    time: "2 days ago"
  },
  {
    id: 14,
    type: "mention",
    icon: <Flag className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">Alex Morgan</span> flagged a mention: <span className="font-medium underline cursor-pointer">WSJ — Leadership Change Reported</span></>
    ),
    time: "3 days ago"
  },
  {
    id: 15,
    type: "search",
    icon: <Search className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">Alex Morgan</span> created a search: <span className="font-medium underline cursor-pointer">ESG Coverage Tracker</span></>
    ),
    time: "4 days ago"
  },
  {
    id: 16,
    type: "dashboard",
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">Rachel Wu</span> updated a dashboard: <span className="font-medium underline cursor-pointer">Crisis Monitor</span></>
    ),
    time: "4 days ago"
  },
  {
    id: 17,
    type: "publishing",
    icon: <FileText className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">Sophia Patel</span> published a report: <span className="font-medium underline cursor-pointer">Daily Coverage Digest</span></>
    ),
    time: "5 days ago"
  },
  {
    id: 18,
    type: "search",
    icon: <Search className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">David Kim</span> created a search: <span className="font-medium underline cursor-pointer">Earnings Call Mentions</span></>
    ),
    time: "5 days ago"
  },
  {
    id: 19,
    type: "dashboard",
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">Sophia Patel</span> shared a dashboard: <span className="font-medium underline cursor-pointer">Sentiment Tracker</span></>
    ),
    time: "5 days ago"
  },
  {
    id: 20,
    type: "outreach",
    icon: <Mail className="w-4 h-4 text-muted-foreground" />,
    content: (
      <><span className="font-medium text-primary">David Kim</span> sent a pitch: <span className="font-medium underline cursor-pointer">Competitor Watch Update</span></>
    ),
    time: "6 days ago"
  },
];

// Additional activities for infinite scroll
const moreActivities: Omit<ActivityItem, 'id'>[] = [
  {
    type: "search",
    icon: <Search className="w-4 h-4 text-muted-foreground" />,
    content: <><span className="font-medium text-primary">Rachel Wu</span> created a search: <span className="font-medium underline cursor-pointer">CEO Media Appearances</span></>,
    time: "1 week ago"
  },
  {
    type: "dashboard",
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />,
    content: <><span className="font-medium text-primary">Tom Nguyen</span> updated a dashboard: <span className="font-medium underline cursor-pointer">Influencer Watch</span></>,
    time: "1 week ago"
  },
  {
    type: "alert",
    icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />,
    content: <>Volume increase: <span className="font-medium underline cursor-pointer">Social media mentions up 28%</span></>,
    time: "1 week ago",
    isSystem: true
  },
  {
    type: "publishing",
    icon: <FileText className="w-4 h-4 text-muted-foreground" />,
    content: <><span className="font-medium text-primary">Alex Morgan</span> scheduled a newsletter: <span className="font-medium underline cursor-pointer">The Brand Pulse</span></>,
    time: "1 week ago"
  },
  {
    type: "search",
    icon: <Search className="w-4 h-4 text-muted-foreground" />,
    content: <><span className="font-medium text-primary">Tom Nguyen</span> created a search: <span className="font-medium underline cursor-pointer">Cybersecurity Incidents</span></>,
    time: "2 weeks ago"
  },
  {
    type: "genai",
    icon: <Sparkles className="w-4 h-4 text-muted-foreground" />,
    content: <>GenAI insight: <span className="font-medium underline cursor-pointer">Competitor sentiment trending negative</span></>,
    time: "2 weeks ago",
    isSystem: true
  },
  {
    type: "dashboard",
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />,
    content: <><span className="font-medium text-primary">Laura Bennett</span> created a dashboard: <span className="font-medium underline cursor-pointer">Campaign Performance</span></>,
    time: "2 weeks ago"
  },
  {
    type: "outreach",
    icon: <Mail className="w-4 h-4 text-muted-foreground" />,
    content: <><span className="font-medium text-primary">Sophia Patel</span> sent a pitch: <span className="font-medium underline cursor-pointer">Industry Trends Digest</span></>,
    time: "2 weeks ago"
  },
];

export const ActivityFeed = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadCount, setLoadCount] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const startIdx = (loadCount * 4) % moreActivities.length;
      const newActivities = moreActivities.slice(startIdx, startIdx + 4).map((activity, i) => ({
        ...activity,
        id: activities.length + i + 1
      }));
      setActivities(prev => [...prev, ...newActivities]);
      setLoadCount(prev => prev + 1);
      setIsLoading(false);
      if (loadCount >= 5) setHasMore(false);
    }, 500);
  }, [isLoading, hasMore, activities.length, loadCount]);

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

  // Filter activities based on active tab
  const filteredActivities = activities.filter(activity => {
    if (activeTab === "All") return true;
    if (activeTab === "Searches") return activity.type === "search";
    if (activeTab === "Dashboards") return activity.type === "dashboard";
    if (activeTab === "Mentions") return activity.type === "mention";
    if (activeTab === "GenAI") return activity.type === "genai";
    if (activeTab === "Alerts") return activity.type === "alert";
    if (activeTab === "Publishing") return activity.type === "publishing";
    if (activeTab === "Outreach") return activity.type === "outreach";
    return true;
  });

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">What's happening now</h2>
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          Last 7 days
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="relative mb-4 border-b border-border pb-2">
        <div className="flex gap-1 overflow-x-auto scrollbar-none pr-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                activeTab === tab
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Scroll fade indicator */}
        <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-card to-transparent pointer-events-none" />
      </div>

      {/* Activity List */}
      <div className="space-y-0">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="grid grid-cols-[32px_20px_1fr_auto] items-center gap-3 py-2.5 border-b border-border last:border-b-0"
          >
            <div className="w-8 flex items-center justify-end">
              <span className="whitespace-nowrap leading-none">{activity.icon}</span>
            </div>

            {activity.isSystem ? (
              <div className="w-5 h-5" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                <User className="w-3 h-3 text-muted-foreground" />
              </div>
            )}

            <div className="text-sm text-card-foreground min-w-0">
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
