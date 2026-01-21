import { useState, useEffect, useRef, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Search, ChevronDown, ChevronUp, Star, MoreVertical, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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

interface CategoryItem {
  name: string;
  count: number;
}

interface SearchItem {
  id: number;
  name: string;
  category: string;
  lastEdited: string;
  owner: string;
  starred?: boolean;
}

const allSearchItems: SearchItem[] = [
  { id: 1, name: "Brand + Earnings Risk", category: "Brand", lastEdited: "3 hrs ago", owner: "Rachel Wu", starred: true },
  { id: 2, name: "Regulatory & Policy Mentions", category: "Policy", lastEdited: "7 hrs ago", owner: "Sophia Patel", starred: true },
  { id: 3, name: "Executive Leadership Coverage", category: "Leadership", lastEdited: "Yesterday", owner: "Tom Nguyen", starred: true },
  { id: 4, name: "Industry Layoffs & Restructuring", category: "Leadership", lastEdited: "2 days ago", owner: "David Kim", starred: true },
  { id: 5, name: "Brand Sentiment Watch", category: "Brand", lastEdited: "2 days ago", owner: "Alex Morgan", starred: true },
  { id: 6, name: "M&A and Acquisition Activity", category: "Competition", lastEdited: "2 days ago", owner: "Alex Morgan", starred: true },
  { id: 7, name: "Social Backlash Monitoring", category: "Social", lastEdited: "4 days ago", owner: "Sophia Patel", starred: true },
  { id: 8, name: "Influencer Mentions Tracker", category: "Social", lastEdited: "5 days ago", owner: "Laura Burn..", starred: true },
  { id: 9, name: "Crisis & Reputation Risk", category: "Crisis", lastEdited: "Nov 20", owner: "Tom Nguyen", starred: true },
  { id: 10, name: "Competitor Product Launches", category: "Competition", lastEdited: "Nov 18", owner: "David Kim", starred: false },
  { id: 11, name: "Market Share Analysis", category: "Market", lastEdited: "Nov 17", owner: "Rachel Wu", starred: true },
  { id: 12, name: "Customer Feedback Trends", category: "Brand", lastEdited: "Nov 15", owner: "Sophia Patel", starred: false },
  { id: 13, name: "Supply Chain Disruptions", category: "Risk", lastEdited: "Nov 14", owner: "Alex Morgan", starred: true },
  { id: 14, name: "ESG Coverage Tracker", category: "Policy", lastEdited: "Nov 12", owner: "Tom Nguyen", starred: false },
  { id: 15, name: "Earnings Call Mentions", category: "Finance", lastEdited: "Nov 10", owner: "David Kim", starred: true },
  { id: 16, name: "Product Review Sentiment", category: "Product", lastEdited: "Nov 8", owner: "Laura Burn..", starred: false },
  { id: 17, name: "CEO Media Appearances", category: "Leadership", lastEdited: "Nov 5", owner: "Rachel Wu", starred: true },
  { id: 18, name: "Industry Trends Report", category: "Market", lastEdited: "Nov 3", owner: "Sophia Patel", starred: false },
  { id: 19, name: "Cybersecurity Incidents", category: "Risk", lastEdited: "Nov 1", owner: "Tom Nguyen", starred: true },
  { id: 20, name: "Partner Announcements", category: "Competition", lastEdited: "Oct 28", owner: "David Kim", starred: false },
  { id: 21, name: "Investor Relations Updates", category: "Finance", lastEdited: "Oct 25", owner: "Alex Morgan", starred: true },
  { id: 22, name: "New Feature Coverage", category: "Product", lastEdited: "Oct 22", owner: "Laura Burn..", starred: false },
  { id: 23, name: "Board Changes Tracker", category: "Leadership", lastEdited: "Oct 20", owner: "Rachel Wu", starred: true },
  { id: 24, name: "Consumer Spending Trends", category: "Market", lastEdited: "Oct 18", owner: "Sophia Patel", starred: false },
  { id: 25, name: "Legal & Litigation News", category: "Risk", lastEdited: "Oct 15", owner: "Tom Nguyen", starred: true },
  { id: 26, name: "Startup Acquisitions", category: "Competition", lastEdited: "Oct 12", owner: "David Kim", starred: false },
  { id: 27, name: "Quarterly Financials", category: "Finance", lastEdited: "Oct 10", owner: "Alex Morgan", starred: true },
  { id: 28, name: "Product Recall Alerts", category: "Crisis", lastEdited: "Oct 8", owner: "Laura Burn..", starred: false },
  { id: 29, name: "Executive Departures", category: "Leadership", lastEdited: "Oct 5", owner: "Rachel Wu", starred: true },
  { id: 30, name: "Industry Awards & Recognition", category: "Brand", lastEdited: "Oct 3", owner: "Sophia Patel", starred: false },
];

const initialCategories: CategoryItem[] = [
  { name: "Brand", count: 24 },
  { name: "Market", count: 20 },
  { name: "Competition", count: 17 },
  { name: "Social", count: 12 },
  { name: "Leadership", count: 10 },
  { name: "Finance", count: 5 },
  { name: "Product", count: 5 },
  { name: "Policy", count: 4 },
  { name: "Risk", count: 1 },
  { name: "Crisis", count: 1 },
];

type SortField = 'name' | 'category' | 'lastEdited' | 'owner';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

const Discover = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>('lastEdited');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchMode, setSearchMode] = useState('Single Keyword');
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
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

  const sortedItems = [...allSearchItems].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (sortField === 'owner') {
      comparison = a.owner.localeCompare(b.owner);
    } else if (sortField === 'lastEdited') {
      // Simple string comparison for demo - in real app would parse dates
      comparison = a.lastEdited.localeCompare(b.lastEdited);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const displayedItems = sortedItems.slice(0, displayedItemsCount);
  const hasMore = displayedItemsCount < allSearchItems.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedItemsCount(prev => Math.min(prev + ITEMS_PER_PAGE, allSearchItems.length));
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
      <Sidebar activePage="discover" />
      <Header />
      
      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Discover and explore media coverage in one place
              </h1>
              <p className="text-sm text-muted-foreground">
                Build searches across news, social, and online sources.
              </p>
            </div>

            {/* Build a new search */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <button 
                className="w-full flex items-center justify-between text-left"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold text-card-foreground">Build a new search</span>
                </div>
                {isSearchExpanded ? (
                  <ChevronUp className="w-4 h-4 text-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              
              {isSearchExpanded && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-foreground mb-4">
                    Enter a keyword. We'll guide you from a single keyword to a fully formed boolean search.
                  </p>
                  <div className="flex gap-3">
                    <Input 
                      type="text"
                      placeholder="Enter a keyword to get started"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="flex-1 bg-white border-border"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted whitespace-nowrap">
                          {searchMode}
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card">
                        <DropdownMenuItem onClick={() => setSearchMode('Single Keyword')}>
                          Single Keyword
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSearchMode('Advanced Boolean')}>
                          Advanced Boolean
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSearchMode('AI Assisted')}>
                          AI Assisted
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </div>

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
                          Last edited
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
                            <Search className="w-4 h-4 text-muted-foreground" />
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
                            <Star className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
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
                
                {/* Infinite scroll loader */}
                <div ref={loaderRef} className="py-4 flex justify-center">
                  {isLoading && (
                    <div className="text-sm text-muted-foreground">Loading more...</div>
                  )}
                  {!hasMore && displayedItems.length > 0 && (
                    <div className="text-sm text-muted-foreground">All items loaded</div>
                  )}
                </div>
              </div>

              {/* Categories Sidebar */}
              <div className="w-64 sticky top-20">
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

                {/* Add Category Dialog */}
                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Input
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsAddCategoryOpen(false);
                          setNewCategoryName('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => {
                          if (newCategoryName.trim()) {
                            setCategories(prev => [...prev, { name: newCategoryName.trim(), count: 0 }]);
                            setNewCategoryName('');
                            setIsAddCategoryOpen(false);
                          }
                        }}
                        disabled={!newCategoryName.trim()}
                      >
                        Add Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Discover;
