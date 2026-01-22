import { useState, useEffect, useRef, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Search, ChevronDown, ChevronUp, Star, MoreVertical, Plus, LayoutGrid, Sparkles, Music2, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryItem {
  name: string;
  count: number;
}

interface DashboardItem {
  id: number;
  name: string;
  category: string;
  lastEdited: string;
  owner: string;
  starred?: boolean;
}

const allDashboardItems: DashboardItem[] = [
  { id: 1, name: "Executive Visibility Report", category: "Leadership", lastEdited: "3 hrs ago", owner: "Rachel Wu", starred: true },
  { id: 2, name: "Brand Health Dashboard", category: "Brand", lastEdited: "7 hrs ago", owner: "Sophia Patel", starred: true },
  { id: 3, name: "Competitor Benchmark", category: "Competition", lastEdited: "Yesterday", owner: "Tom Nguyen", starred: true },
  { id: 4, name: "Audience Insights", category: "Audience", lastEdited: "2 days ago", owner: "David Kim", starred: false },
  { id: 5, name: "Campaign Performance", category: "Brand", lastEdited: "2 days ago", owner: "Alex Morgan", starred: false },
  { id: 6, name: "Crisis Monitor", category: "Crisis", lastEdited: "2 days ago", owner: "Rachel Wu", starred: false },
  { id: 7, name: "Influencer Watch", category: "Social", lastEdited: "4 days ago", owner: "Sophia Patel", starred: false },
  { id: 8, name: "Sentiment Tracker", category: "Brand", lastEdited: "5 days ago", owner: "Laura Burn..", starred: false },
  { id: 9, name: "Global Coverage", category: "Crisis", lastEdited: "Nov 20", owner: "Tom Nguyen", starred: false },
  { id: 10, name: "Usage Signals", category: "Product", lastEdited: "Nov 15", owner: "Tom Nguyen", starred: false },
  { id: 11, name: "Public Affairs Monitor", category: "Policy", lastEdited: "Oct 12", owner: "Sophia Patel", starred: false },
  { id: 12, name: "Risk Monitor", category: "Risk", lastEdited: "Oct 5", owner: "Rachel Wu", starred: false },
  { id: 13, name: "Investor Sentiment", category: "Finance", lastEdited: "Oct 2", owner: "David Kim", starred: false },
];

const categories: CategoryItem[] = [
  { name: "Brand", count: 24 },
  { name: "Market", count: 20 },
  { name: "Competition", count: 17 },
  { name: "Audience", count: 13 },
  { name: "Social", count: 12 },
  { name: "Leadership", count: 10 },
  { name: "Finance", count: 5 },
  { name: "Product", count: 5 },
  { name: "Policy", count: 4 },
  { name: "Risk", count: 1 },
  { name: "Crisis", count: 1 },
];

const templateCategories = [
  {
    label: "Analytics",
    templates: [
      { icon: LayoutGrid, title: "Custom", description: "Start from scratch with an empty dashboard." },
      { icon: LayoutGrid, title: "Audience", description: "Gain insights into your audience by exploring demographics, trending topics, and key phrases using both social and editorial content." },
      { icon: LayoutGrid, title: "Benchmark", description: "Compare brands, topics, or competitors to understand their share of voice across mentions, reach, sentiment, source type, and markets." },
      { icon: LayoutGrid, title: "Brand", description: "Understand and report on brand awareness using metrics such as number of mentions, reach, sentiment, coverage by market & key themes." },
      { icon: LayoutGrid, title: "Campaign", description: "Analyze and report on mentions from your campaign across various media types, engagement levels, and reach. Highlight the key coverage achieved." },
      { icon: LayoutGrid, title: "Coverage Report", description: "Highlight your coverage from a campaign or a time period in an easy-to-create and beautiful report." },
      { icon: LayoutGrid, title: "Crisis Management", description: "Monitor and detect emerging risks by tracking sentiment, spikes in mentions, and influential sources using both social and editorial content." },
      { icon: LayoutGrid, title: "Earned Media Measurement", description: "Measure and understand drivers of earned media metrics using an interactive dashboard template designed for PR teams." },
    ]
  },
  {
    label: "Social",
    templates: [
      { icon: LayoutGrid, title: "Facebook Overview", description: "Analyze your Facebook Page activity to measure your impact." },
      { icon: LayoutGrid, title: "Instagram Overview", description: "Track your performance, audience growth, views, and engagement." },
      { icon: LayoutGrid, title: "LinkedIn Overview", description: "Look at your LinkedIn Page data to understand your company's presence." },
      { icon: LayoutGrid, title: "TikTok Overview", description: "Analyze your profile performance to see your impact on TikTok." },
      { icon: LayoutGrid, title: "X Overview", description: "Monitor your X presence and track engagement, reach, and audience growth." },
      { icon: LayoutGrid, title: "YouTube Overview", description: "Track your YouTube channel performance, views, and subscriber engagement." },
    ]
  },
];

const intelligenceDashboards = [
  { icon: Sparkles, title: "GenAI Lens", description: "See how your brand is represented and ranked across leading AI models." },
  { icon: Music2, title: "TikTok Trends", description: "Discover trending topics, creators, and signals shaping conversations on TikTok." },
  { icon: Users, title: "Audience Segments", description: "Analyze your audience across demographics, trends, and language." },
  { icon: Sparkles, title: "Sentiment AI", description: "Deep sentiment analysis powered by advanced machine learning." },
  { icon: Music2, title: "Podcast Monitor", description: "Track brand mentions across podcast content and audio media." },
  { icon: Users, title: "Influencer Intel", description: "AI-powered influencer identification and impact analysis." },
  { icon: Sparkles, title: "Predictive Trends", description: "Forecast emerging topics before they become mainstream." },
  { icon: Music2, title: "Video Analytics", description: "Track performance across YouTube, Reels, and video content." },
  { icon: Users, title: "Community Pulse", description: "Monitor Reddit, forums, and community discussions." },
  { icon: Sparkles, title: "Crisis Radar", description: "Early detection of potential brand crises using AI." },
  { icon: Music2, title: "News Impact", description: "Measure the impact and reach of news coverage." },
  { icon: Users, title: "Competitor Intel", description: "AI-driven competitive intelligence and benchmarking." },
];

type SortField = 'name' | 'category' | 'lastEdited' | 'owner';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

const Analyze = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>('lastEdited');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [displayedItemsCount, setDisplayedItemsCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const toggleItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedItems.map(item => item.id));
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = [...allDashboardItems].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (sortField === 'owner') {
      comparison = a.owner.localeCompare(b.owner);
    } else if (sortField === 'lastEdited') {
      comparison = a.lastEdited.localeCompare(b.lastEdited);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const displayedItems = sortedItems.slice(0, displayedItemsCount);
  const hasMore = displayedItemsCount < allDashboardItems.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedItemsCount(prev => Math.min(prev + ITEMS_PER_PAGE, allDashboardItems.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore]);

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
    <div className="min-h-screen bg-background">
      <Sidebar activePage="analyze" />
      <Header />
      
      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Analyze your coverage and performance
              </h1>
              <p className="text-sm text-muted-foreground">
                Build dashboards from your searches and social accounts, or add always-on intelligence.
              </p>
            </div>

            {/* Tabbed Interface */}
            <Tabs defaultValue="dashboards" className="w-full">
              <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 mb-6">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger 
                          value="dashboards" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground"
                        >
                          Dashboards
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View and manage your saved dashboards</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger 
                          value="templates" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground"
                        >
                          Templates
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start with pre-built dashboard templates</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger 
                          value="intelligence" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground"
                        >
                          Intelligence
                          <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Premium</span>
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Always-on dashboards with insights beyond your searches.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TabsList>

              {/* My Dashboards Tab */}
              <TabsContent value="dashboards" className="mt-0">
                <div className="flex gap-6 items-start">
                  {/* Main Table */}
                  <div className="flex-1 bg-card rounded-lg border border-border">
                    {/* Table Header Controls */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-1 font-semibold text-card-foreground hover:text-primary">
                            Recent
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 bg-card">
                          <DropdownMenuItem className="cursor-pointer">Favorites</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Most Used</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Created by Me</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Shared with Me</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Alphabetical (A-Z)</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Last Edited</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground">
                        Owner: Anyone
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Table */}
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="p-4 w-10">
                            <Checkbox 
                              checked={selectedItems.length === displayedItems.length && displayedItems.length > 0}
                              onCheckedChange={toggleAll}
                            />
                          </th>
                          <th className="p-4 text-sm font-bold text-foreground">
                            <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('name')}>
                              Name
                              {sortField === 'name' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                            </button>
                          </th>
                          <th className="p-4 text-sm font-bold text-foreground">
                            <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('category')}>
                              Category
                              {sortField === 'category' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                            </button>
                          </th>
                          <th className="p-4 text-sm font-bold text-foreground">
                            <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('lastEdited')}>
                              Last Edited
                              {sortField === 'lastEdited' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                            </button>
                          </th>
                          <th className="p-4 text-sm font-bold text-foreground">
                            <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('owner')}>
                              Owner
                              {sortField === 'owner' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                            </button>
                          </th>
                          <th className="p-4 w-20"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedItems.map((item) => (
                          <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                            <td className="p-4">
                              <Checkbox 
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => toggleItem(item.id)}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground underline cursor-pointer hover:text-primary">
                                  {item.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-foreground underline cursor-pointer hover:text-primary">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{item.lastEdited}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">👤</div>
                                <span className="text-sm text-foreground cursor-pointer hover:text-primary">{item.owner}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Star className={`w-4 h-4 cursor-pointer ${item.starred ? 'text-primary fill-primary' : 'text-muted-foreground hover:text-primary'}`} />
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="p-1 hover:bg-muted rounded">
                                      <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48 bg-card">
                                    <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Export</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Copy Link</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Create Alert</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Schedule Reporting</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">AI Summary</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">Rename</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Move to Category</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer text-destructive">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Load More */}
                    <div ref={loaderRef} className="p-4 text-center">
                      {isLoading && (
                        <span className="text-sm text-muted-foreground">Loading...</span>
                      )}
                      {hasMore && !isLoading && (
                        <button 
                          onClick={loadMore}
                          className="flex items-center justify-center gap-1 w-full text-sm text-muted-foreground hover:text-primary"
                        >
                          Show more
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Sidebar */}
                  <div className="w-56 space-y-4 sticky top-20">
                    {/* Categories */}
                    <div className="bg-card rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-card-foreground">Categories</h3>
                        <button className="p-1 hover:bg-muted rounded">
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                      <ul className="space-y-1">
                        {categories.map((category, index) => (
                          <li key={index} className="text-sm text-foreground hover:text-primary cursor-pointer py-1">
                            <span className="underline">{category.name}</span>
                            <span className="text-muted-foreground ml-1">({category.count})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Templates Tab */}
              <TabsContent value="templates" className="mt-0">
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="mb-4">
                    <h2 className="font-semibold text-card-foreground mb-1">Dashboard Templates</h2>
                    <p className="text-sm text-muted-foreground">Choose a template to get started.</p>
                  </div>
                  
                  <div className="space-y-6">
                    {templateCategories.map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{category.label}</h3>
                        <div className="grid grid-cols-4 gap-4">
                          {category.templates.map((template, index) => (
                            <div key={index} className="border border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors flex flex-col">
                              <div className="flex items-center gap-2 mb-2">
                                <template.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium text-card-foreground">{template.title}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3 flex-1 line-clamp-3">{template.description}</p>
                              <button className="text-sm text-foreground underline hover:text-primary self-start">Create &gt;&gt;</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Intelligence Tab */}
              <TabsContent value="intelligence" className="mt-0">
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="mb-4">
                    <h2 className="font-semibold text-card-foreground mb-1">Intelligence Dashboards</h2>
                    <p className="text-sm text-muted-foreground">Always-on dashboards with insights beyond your searches.</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {intelligenceDashboards.map((dashboard, index) => (
                      <div key={index} className="border border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <dashboard.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-card-foreground">{dashboard.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 flex-1">{dashboard.description}</p>
                        <button className="text-sm text-foreground underline hover:text-primary self-start">Learn more &gt;&gt;</button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analyze;
