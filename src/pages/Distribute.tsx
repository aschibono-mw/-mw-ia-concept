import { useState, useEffect, useRef, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ChevronDown, Star, MoreVertical, Plus, Sparkles, FileText, Mail } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryItem {
  name: string;
  count: number;
}

interface ReportItem {
  id: number;
  name: string;
  type: 'insight' | 'digest' | 'newsletter';
  category: string;
  lastEdited: string;
  owner: string;
  starred?: boolean;
}

const allReportItems: ReportItem[] = [
  { id: 1, name: "Executive Visibility Report", type: "insight", category: "Leadership", lastEdited: "3 hrs ago", owner: "Rachel Wu", starred: true },
  { id: 2, name: "Daily Coverage Digest", type: "digest", category: "Brand", lastEdited: "7 hrs ago", owner: "Sophia Patel", starred: true },
  { id: 3, name: "The Daily Media Brief", type: "newsletter", category: "Media", lastEdited: "Yesterday", owner: "Laura Bennett", starred: true },
  { id: 4, name: "Brand Risk Assessment", type: "insight", category: "Brand", lastEdited: "2 days ago", owner: "David Kim", starred: false },
  { id: 5, name: "The Brand Pulse", type: "newsletter", category: "Brand", lastEdited: "2 days ago", owner: "Alex Morgan", starred: true },
  { id: 6, name: "Narrative Shift Report", type: "insight", category: "Brand", lastEdited: "2 days ago", owner: "Alex Morgan", starred: false },
  { id: 7, name: "Morning Media Roundup", type: "newsletter", category: "Media", lastEdited: "4 days ago", owner: "Sophia Patel", starred: true },
  { id: 8, name: "Conversation Trends Analysis", type: "insight", category: "Brand", lastEdited: "5 days ago", owner: "Laura Bennett", starred: false },
  { id: 9, name: "Weekly Industry Digest", type: "digest", category: "Market", lastEdited: "Nov 20", owner: "Tom Nguyen", starred: true },
  { id: 10, name: "Competitor Watch Report", type: "insight", category: "Competition", lastEdited: "Nov 18", owner: "David Kim", starred: false },
  { id: 11, name: "Market Trends Newsletter", type: "newsletter", category: "Market", lastEdited: "Nov 17", owner: "Rachel Wu", starred: true },
  { id: 12, name: "Social Listening Digest", type: "digest", category: "Social", lastEdited: "Nov 15", owner: "Sophia Patel", starred: false },
  { id: 13, name: "Leadership Coverage Report", type: "insight", category: "Leadership", lastEdited: "Nov 14", owner: "Alex Morgan", starred: true },
  { id: 14, name: "Policy Impact Analysis", type: "insight", category: "Policy", lastEdited: "Nov 12", owner: "Tom Nguyen", starred: false },
  { id: 15, name: "Financial Media Digest", type: "digest", category: "Finance", lastEdited: "Nov 10", owner: "David Kim", starred: true },
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

const createOptions = [
  { 
    icon: Sparkles, 
    title: "Create a insights report", 
    description: "Start with a flexible report and organize analysis, charts, and commentary into a polished deliverable." 
  },
  { 
    icon: FileText, 
    title: "Create a digest report", 
    description: "Create a recurring summary that highlights the most important coverage, trends, and activity." 
  },
  { 
    icon: Mail, 
    title: "Create a newsletter", 
    description: "Design and send branded updates that package insights into a shareable email format." 
  },
];

type SortField = 'name' | 'category' | 'lastEdited' | 'owner';
type SortDirection = 'asc' | 'desc';
type ReportFilter = 'all' | 'insight' | 'digest' | 'newsletter';

const ITEMS_PER_PAGE = 10;

const Distribute = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>('lastEdited');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [displayedItemsCount, setDisplayedItemsCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ReportFilter>('all');
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
    ? allReportItems 
    : allReportItems.filter(item => item.type === activeFilter);

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

  const getTypeIcon = (type: ReportItem['type']) => {
    switch (type) {
      case 'insight':
        return <Sparkles className="w-4 h-4 text-muted-foreground" />;
      case 'digest':
        return <FileText className="w-4 h-4 text-muted-foreground" />;
      case 'newsletter':
        return <Mail className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="distribute" />
      <Header />
      
      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Distribute your insights
              </h1>
              <p className="text-sm text-muted-foreground">
                Create newsletters and reports to deliver insight to your team and stakeholders.
              </p>
            </div>

            {/* Create Options */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {createOptions.map((option, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <option.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-card-foreground">{option.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 flex-1">{option.description}</p>
                  <button className="text-sm text-foreground underline hover:text-primary self-start">Create &gt;&gt;</button>
                </div>
              ))}
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
                      className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeFilter === 'insight' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setActiveFilter('insight')}
                    >
                      Insight reports
                    </button>
                    <button 
                      className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeFilter === 'digest' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setActiveFilter('digest')}
                    >
                      Digest reports
                    </button>
                    <button 
                      className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeFilter === 'newsletter' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setActiveFilter('newsletter')}
                    >
                      Newsletters
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
                            {getTypeIcon(item.type)}
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
                                <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Copy Link</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Send Now</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Schedule</DropdownMenuItem>
                                <DropdownMenuSeparator />
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
                {hasMore && (
                  <div ref={loaderRef} className="p-4 text-center text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : 'Scroll for more'}
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

export default Distribute;
