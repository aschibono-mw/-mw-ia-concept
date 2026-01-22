import { useState, useEffect, useRef, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ChevronDown, Star, MoreVertical, Plus, Mail, Users, Megaphone, Radio } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CategoryItem {
  name: string;
  count: number;
}

interface OutreachItem {
  id: number;
  subject: string;
  subtitle: string;
  status: 'sent' | 'scheduled' | 'draft';
  category: string;
  sentDate: string;
  owner: string;
  starred?: boolean;
}

const allOutreachItems: OutreachItem[] = [
  { id: 1, subject: "Executive Visibility Report", subtitle: "Sent to 12 recipients", status: "sent", category: "Leadership", sentDate: "7 hrs ago", owner: "Rachel Wu", starred: true },
  { id: 2, subject: "The Daily Media Brief", subtitle: "Sent to 10 recipients", status: "sent", category: "Brand", sentDate: "Yesterday", owner: "Sophia Patel", starred: true },
  { id: 3, subject: "Morning Media Roundup", subtitle: "Draft", status: "draft", category: "Leadership", sentDate: "2 days ago", owner: "Tom Nguyen", starred: false },
  { id: 4, subject: "Crisis Impact Report", subtitle: "Scheduled for tomorrow", status: "scheduled", category: "Crisis", sentDate: "2 days ago", owner: "David Kim", starred: false },
  { id: 5, subject: "Conversation Trends Analysis", subtitle: "Sent to 32 recipients", status: "sent", category: "Social", sentDate: "4 days ago", owner: "Sophia Patel", starred: true },
  { id: 6, subject: "Weekly Intelligence Brief", subtitle: "Draft", status: "draft", category: "Brand", sentDate: "Nov 20", owner: "Rachel Wu", starred: false },
  { id: 7, subject: "Narrative Shift Report", subtitle: "Sent to 65 recipients", status: "sent", category: "Leadership", sentDate: "Oct 12", owner: "Laura Bennett", starred: true },
  { id: 8, subject: "The Brand Pulse", subtitle: "Scheduled for Nov 30", status: "scheduled", category: "Leadership", sentDate: "Oct 5", owner: "Tom Nguyen", starred: false },
  { id: 9, subject: "Market & Media Performance", subtitle: "Sent to 6 recipients", status: "sent", category: "Media", sentDate: "Oct 2", owner: "Rachel Wu", starred: true },
  { id: 10, subject: "Daily Coverage Report", subtitle: "Sent to 22 recipients", status: "sent", category: "Leadership", sentDate: "Oct 2", owner: "Rachel Wu", starred: false },
  { id: 11, subject: "Competitor Watch Update", subtitle: "Sent to 18 recipients", status: "sent", category: "Competition", sentDate: "Sep 28", owner: "David Kim", starred: true },
  { id: 12, subject: "Industry Trends Digest", subtitle: "Draft", status: "draft", category: "Market", sentDate: "Sep 25", owner: "Sophia Patel", starred: false },
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
  { name: "Media", count: 2 },
  { name: "Risk", count: 1 },
  { name: "Crisis", count: 1 },
];

const stats = [
  { label: "Sent", value: "129" },
  { label: "Open rate", value: "68.4%" },
  { label: "Click rate", value: "3.5%" },
  { label: "Unsubscribe rate", value: "0.9%" },
];

type SortField = 'subject' | 'category' | 'sentDate' | 'owner';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'sent' | 'scheduled' | 'draft';

const ITEMS_PER_PAGE = 10;

const Outreach = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>('sentDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [displayedItemsCount, setDisplayedItemsCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const loaderRef = useRef<HTMLDivElement>(null);

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

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories(prev => [...prev, { name: newCategoryName.trim(), count: 0 }]);
      setNewCategoryName('');
      setIsAddCategoryOpen(false);
    }
  };

  const filteredItems = activeFilter === 'all' 
    ? allOutreachItems 
    : allOutreachItems.filter(item => item.status === activeFilter);

  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'subject') {
      comparison = a.subject.localeCompare(b.subject);
    } else if (sortField === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (sortField === 'owner') {
      comparison = a.owner.localeCompare(b.owner);
    } else if (sortField === 'sentDate') {
      comparison = a.sentDate.localeCompare(b.sentDate);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const displayedItems = sortedItems.slice(0, displayedItemsCount);
  const hasMore = displayedItemsCount < sortedItems.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedItemsCount(prev => Math.min(prev + ITEMS_PER_PAGE, sortedItems.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, sortedItems.length]);

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
      <Sidebar activePage="outreach" />
      <Header />
      
      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Manage your PR Outreach
              </h1>
              <p className="text-sm text-muted-foreground">
                Create pitches, discover journalists and outlets, and track engagement across your outreach.
              </p>
            </div>

            {/* Tabbed Interface */}
            <Tabs defaultValue="pitches" className="w-full">
              <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 mb-6">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger 
                          value="pitches" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Pitches
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Manage and send your media pitches</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger 
                          value="journalists" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          Journalists & Outlets
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Discover and manage media contacts</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger 
                          value="studio" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground flex items-center gap-2"
                        >
                          <Megaphone className="w-4 h-4" />
                          PR Studio
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create and design PR content</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger 
                          value="newswire" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground flex items-center gap-2"
                        >
                          <Radio className="w-4 h-4" />
                          Newswire
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Distribute press releases via newswire</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TabsList>

              {/* Pitches Tab */}
              <TabsContent value="pitches" className="mt-0">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-6 items-start">
                  {/* Main Table */}
                  <div className="flex-1 bg-card rounded-lg border border-border">
                    {/* Table Header Controls */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <h2 className="font-semibold text-card-foreground">Outreach activity</h2>
                      <div className="flex items-center gap-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                              Date range
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-card">
                            <DropdownMenuItem className="cursor-pointer">Last 7 days</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Last 30 days</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Last 90 days</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">All time</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                              Owner: Anyone
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-card">
                            <DropdownMenuItem className="cursor-pointer">Anyone</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Me</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Rachel Wu</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Sophia Patel</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Tom Nguyen</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="px-4 border-b border-border">
                      <div className="flex gap-6">
                        <button 
                          className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeFilter === 'all' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                          onClick={() => setActiveFilter('all')}
                        >
                          All
                        </button>
                        <button 
                          className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeFilter === 'sent' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                          onClick={() => setActiveFilter('sent')}
                        >
                          Sent
                        </button>
                        <button 
                          className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeFilter === 'scheduled' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                          onClick={() => setActiveFilter('scheduled')}
                        >
                          Scheduled
                        </button>
                        <button 
                          className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeFilter === 'draft' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                          onClick={() => setActiveFilter('draft')}
                        >
                          Draft
                        </button>
                      </div>
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
                            <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('subject')}>
                              Subject
                              {sortField === 'subject' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                            </button>
                          </th>
                          <th className="p-4 text-sm font-bold text-foreground">
                            <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('category')}>
                              Category
                              {sortField === 'category' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                            </button>
                          </th>
                          <th className="p-4 text-sm font-bold text-foreground">
                            <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('sentDate')}>
                              Sent
                              {sortField === 'sentDate' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
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
                                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                  <span className="text-sm font-medium text-foreground underline cursor-pointer hover:text-primary block">
                                    {item.subject}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-foreground underline cursor-pointer hover:text-primary">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{item.sentDate}</td>
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
                                    <DropdownMenuItem className="cursor-pointer">Open</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Create Alert</DropdownMenuItem>
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

                    {/* Load more */}
                    {hasMore && (
                      <div ref={loaderRef} className="p-4 text-center">
                        <button className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 w-full">
                          {isLoading ? 'Loading...' : 'Show more'}
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Categories Sidebar */}
                  <div className="w-64 sticky top-20 space-y-4">
                    <div className="bg-card rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-card-foreground">Categories</h3>
                        <button 
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => setIsAddCategoryOpen(true)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <ul className="space-y-2">
                        {categories.map((category) => (
                          <li key={category.name}>
                            <button className="text-sm text-foreground underline hover:text-primary cursor-pointer">
                              {category.name} ({category.count})
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Journalists & Outlets Tab */}
              <TabsContent value="journalists" className="mt-0">
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="font-semibold text-card-foreground mb-2">Journalists & Outlets</h2>
                    <p className="text-sm text-muted-foreground mb-4">Discover and manage your media contacts database.</p>
                    <button className="text-sm text-foreground underline hover:text-primary">Get started &gt;&gt;</button>
                  </div>
                </div>
              </TabsContent>

              {/* PR Studio Tab */}
              <TabsContent value="studio" className="mt-0">
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="text-center py-12">
                    <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="font-semibold text-card-foreground mb-2">PR Studio</h2>
                    <p className="text-sm text-muted-foreground mb-4">Create and design professional PR content.</p>
                    <button className="text-sm text-foreground underline hover:text-primary">Get started &gt;&gt;</button>
                  </div>
                </div>
              </TabsContent>

              {/* Newswire Tab */}
              <TabsContent value="newswire" className="mt-0">
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="text-center py-12">
                    <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="font-semibold text-card-foreground mb-2">Newswire</h2>
                    <p className="text-sm text-muted-foreground mb-4">Distribute your press releases to major news outlets worldwide.</p>
                    <button className="text-sm text-foreground underline hover:text-primary">Get started &gt;&gt;</button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Outreach;
