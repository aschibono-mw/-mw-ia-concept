import { useState } from "react";
import { 
  TrendingUp, 
  Search, 
  Globe, 
  Sparkles, 
  FileText, 
  Mail, 
  Flag,
  LayoutGrid,
  Pencil,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["All", "Mine", "My team", "Searches", "Mentions", "GenAI", "Alerts", "Publishing", "Outreach"];

interface ActivityItem {
  id: number;
  icon: React.ReactNode;
  content: React.ReactNode;
  time: string;
}

const activities: ActivityItem[] = [
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
];

export const ActivityFeed = () => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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
    </div>
  );
};
