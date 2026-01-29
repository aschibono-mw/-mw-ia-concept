import { useState, useEffect, useRef, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ShareDialog } from "@/components/discover/ShareDialog";
import { Search, ChevronDown, Star, MoreVertical, Plus, LayoutGrid, Sparkles, Music2, Users, User, Grid3X3, List, X } from "lucide-react";
import { CategoriesPanel } from "@/components/dashboard/CategoriesPanel";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const initialCategories: CategoryItem[] = [
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
    label: "PR & Comms",
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
  { icon: Music2, title: "TikTok Trends", description: "Discover trending topics, creators, and signals shaping conversations on TikTok.", isPremium: true },
  { icon: Users, title: "Audience Segments", description: "Analyze your audience across demographics, trends, and language.", isPremium: true },
  { icon: Sparkles, title: "Sentiment AI", description: "Deep sentiment analysis powered by advanced machine learning.", isPremium: true },
  { icon: Music2, title: "Podcast Monitor", description: "Track brand mentions across podcast content and audio media.", isPremium: true },
  { icon: Users, title: "Influencer Intel", description: "AI-powered influencer identification and impact analysis.", isPremium: true },
  { icon: Sparkles, title: "Predictive Trends", description: "Forecast emerging topics before they become mainstream.", isPremium: true },
  { icon: Music2, title: "Video Analytics", description: "Track performance across YouTube, Reels, and video content.", isPremium: false },
  { icon: Users, title: "Community Pulse", description: "Monitor Reddit, forums, and community discussions.", isPremium: false },
  { icon: Sparkles, title: "Crisis Radar", description: "Early detection of potential brand crises using AI.", isPremium: true },
  { icon: Music2, title: "News Impact", description: "Measure the impact and reach of news coverage.", isPremium: false },
  { icon: Users, title: "Competitor Intel", description: "AI-driven competitive intelligence and benchmarking.", isPremium: true },
];

type SortField = 'name' | 'category' | 'lastEdited' | 'owner';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'cards' | 'table';

const ITEMS_PER_PAGE = 6;

const Analyze = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>('lastEdited');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [displayedItemsCount, setDisplayedItemsCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareItemName, setShareItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState<string>('Anyone');
  const loaderRef = useRef<HTMLDivElement>(null);

  const owners = ['Anyone', ...Array.from(new Set(allDashboardItems.map(item => item.owner)))];

  const handleOpenShare = (itemName: string) => {
    setShareItemName(itemName);
    setIsShareOpen(true);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const exists = categories.some(
        (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
      );
      if (exists) {
        toast.error('Category already exists');
        return;
      }
      setCategories([...categories, { name: newCategoryName.trim(), count: 0 }]);
      setNewCategoryName('');
      setIsAddCategoryOpen(false);
      toast.success(`Category "${newCategoryName.trim()}" added`);
    }
  };

  const toggleItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
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

  // Filter items by search query and owner
  const filteredItems = allDashboardItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOwner = ownerFilter === 'Anyone' || item.owner === ownerFilter;
    return matchesSearch && matchesOwner;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
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
  const hasMore = displayedItemsCount < filteredItems.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedItemsCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredItems.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, filteredItems.length]);

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

  // Reset displayed items when search changes
  useEffect(() => {
    setDisplayedItemsCount(ITEMS_PER_PAGE);
  }, [searchQuery]);

  const DashboardCard = ({ item }: { item: DashboardItem }) => (
    <Card className="hover:border-primary transition-colors cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {item.name}
              </h3>
              {item.starred && (
                <Star className="w-4 h-4 text-primary fill-primary flex-shrink-0" />
              )}
            </div>
            <span className="text-xs text-muted-foreground">{item.category}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card">
              <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Export</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Copy Link</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Create Alert</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">AI Brief</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Rename</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Move to Category</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenShare(item.name)}>Share</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3 text-muted-foreground" />
            </div>
            <span className="truncate">{item.owner}</span>
          </div>
          <span className="flex-shrink-0">{item.lastEdited}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="analyze" />
      <Header />
      
      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            {/* Page Header */}
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  Analyze your coverage and performance
                </h1>
                <p className="text-sm text-muted-foreground">
                  Build dashboards from your searches and social accounts, or add always-on intelligence.
                </p>
              </div>
              <Button onClick={() => setIsTemplateDrawerOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Dashboard
              </Button>
            </div>


            {/* Main Content */}
            <div className="flex gap-6 items-start flex-row-reverse">
              <div className="flex-1">
                {viewMode === 'cards' ? (
                  /* Card View */
                  <div className="bg-card rounded-lg border border-border">
                    {/* Card View Header Controls */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 font-semibold text-card-foreground hover:text-primary">
                            Recent
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40 bg-card">
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleSort('lastEdited')}>Recent</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleSort('name')}>Alphabetical</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleSort('category')}>Category</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="flex items-center gap-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                              Owner: {ownerFilter}
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-card">
                            {owners.map((owner) => (
                              <DropdownMenuItem 
                                key={owner} 
                                className="cursor-pointer"
                                onClick={() => setOwnerFilter(owner)}
                              >
                                {owner}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {/* View Toggle */}
                        <div className="flex items-center border border-border rounded-md">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => setViewMode('cards')}
                                  className="p-2 transition-colors bg-muted text-foreground"
                                >
                                  <Grid3X3 className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Card view</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => setViewMode('table')}
                                  className="p-2 transition-colors text-muted-foreground hover:text-foreground"
                                >
                                  <List className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Table view</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-4">
                        {displayedItems.map((item) => (
                          <DashboardCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                    
                    {/* Load More */}
                    <div ref={loaderRef} className="py-4 text-center">
                      {isLoading && (
                        <span className="text-sm text-muted-foreground">Loading...</span>
                      )}
                      {hasMore && !isLoading && (
                        <Button variant="ghost" onClick={loadMore} className="gap-1">
                          Show more
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Table View */
                  <div className="bg-card rounded-lg border border-border">
                    {/* Table Header Controls */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-1 font-semibold text-card-foreground hover:text-primary">
                            Recent
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40 bg-card">
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleSort('lastEdited')}>Recent</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleSort('name')}>Alphabetical</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleSort('category')}>Category</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="flex items-center gap-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                              Owner: {ownerFilter}
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-card">
                            {owners.map((owner) => (
                              <DropdownMenuItem 
                                key={owner} 
                                className="cursor-pointer"
                                onClick={() => setOwnerFilter(owner)}
                              >
                                {owner}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {/* View Toggle */}
                        <div className="flex items-center border border-border rounded-md">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => setViewMode('cards')}
                                  className="p-2 transition-colors text-muted-foreground hover:text-foreground"
                                >
                                  <Grid3X3 className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Card view</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => setViewMode('table')}
                                  className="p-2 transition-colors bg-muted text-foreground"
                                >
                                  <List className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Table view</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
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
                                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                  <User className="w-3 h-3 text-muted-foreground" />
                                </div>
                                <span className="text-sm font-semibold text-foreground underline cursor-pointer hover:text-primary">{item.owner}</span>
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
                                    <DropdownMenuItem className="cursor-pointer">AI Brief</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">Rename</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Move to Category</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenShare(item.name)}>Share</DropdownMenuItem>
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
                    <div ref={viewMode === 'table' ? loaderRef : undefined} className="p-4 text-center">
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
                )}
              </div>

              {/* Right Sidebar */}
              <div className="w-56 space-y-4 sticky top-20">
                <CategoriesPanel 
                  categories={categories} 
                  onAddCategory={() => setIsAddCategoryOpen(true)} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Dashboard Drawer - 80% screen takeover */}
      {isTemplateDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60" 
            onClick={() => setIsTemplateDrawerOpen(false)} 
          />
          
          {/* Drawer Content - 80% width from right */}
          <div className="fixed right-0 top-0 bottom-0 w-[80%] bg-background border-l border-border shadow-xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Create a Dashboard</h2>
                  <p className="text-sm text-muted-foreground">Choose a template or start from scratch</p>
                </div>
                <button 
                  onClick={() => setIsTemplateDrawerOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Drawer Body */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-8">
                  {/* Templates Section */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-foreground mb-1">Dashboard Templates</h3>
                      <p className="text-sm text-muted-foreground">Pre-built templates to get you started quickly</p>
                    </div>
                    
                    <div className="space-y-6">
                      {templateCategories.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{category.label}</h4>
                          <div className="grid grid-cols-4 gap-4">
                            {category.templates.map((template, index) => (
                              <div key={index} className="border border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors flex flex-col bg-card">
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

                  {/* Intelligence Section */}
                  <div className="border-t border-border pt-8">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">Intelligence Dashboards</h3>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">Premium</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Always-on dashboards with insights beyond your searches</p>
                    </div>

                    {/* GenAI Lens Hero Banner */}
                    <div className="border border-primary/30 rounded-lg p-6 mb-6 flex items-center justify-between bg-primary/5">
                      <div className="flex-1 max-w-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <span className="text-xs font-medium text-primary uppercase tracking-wide">Featured Upgrade</span>
                        </div>
                        <h4 className="text-lg font-semibold text-card-foreground mb-2">GenAI Lens</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          See how your brand is represented and ranked across leading AI models like ChatGPT, Claude, and Gemini. Understand your AI visibility and competitive positioning in the new era of search.
                        </p>
                        <button className="text-sm text-foreground underline hover:text-primary">Get started &gt;&gt;</button>
                      </div>
                      <div className="w-56 h-32 bg-muted rounded-lg border border-border flex items-center justify-center ml-6">
                        <div className="text-center text-muted-foreground">
                          <Sparkles className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-xs">Preview</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      {intelligenceDashboards.map((dashboard, index) => (
                        <div key={index} className={`border rounded-lg p-4 cursor-pointer transition-colors flex flex-col bg-card ${dashboard.isPremium ? 'border-primary/30 hover:border-primary' : 'border-border hover:border-primary'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <dashboard.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-card-foreground">{dashboard.title}</span>
                            {dashboard.isPremium && (
                              <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-auto">PRO</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 flex-1 line-clamp-2">{dashboard.description}</p>
                          <button className="text-sm text-foreground underline hover:text-primary self-start">
                            {dashboard.isPremium ? 'Upgrade &gt;&gt;' : 'Create &gt;&gt;'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="e.g., Industry, Partnerships"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Categories help you organize your dashboards into logical groups.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        itemName={shareItemName}
      />
    </div>
  );
};

export default Analyze;
