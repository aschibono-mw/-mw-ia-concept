import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ShareDialog } from "@/components/discover/ShareDialog";
import { ChevronDown, Star, MoreVertical, Plus, Sparkles, FileText, Mail, Users, Clock, Send, RefreshCw, Copy, User } from "lucide-react";
import { CategoriesPanel } from "@/components/dashboard/CategoriesPanel";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CategoryItem {
  name: string;
  count: number;
}

interface NewsletterItem {
  id: number;
  name: string;
  category: string;
  status: 'draft' | 'scheduled' | 'sent';
  lastEdited: string;
  owner: string;
  starred?: boolean;
  // Stats for sent newsletters
  recipients?: number;
  openRate?: number;
  clickRate?: number;
  scheduledFor?: string;
}

const allNewsletterItems: NewsletterItem[] = [
  { id: 1, name: "The Daily Media Brief", category: "Media", status: "sent", lastEdited: "Yesterday", owner: "Laura Bennett", starred: true, recipients: 156, openRate: 72.4, clickRate: 4.2 },
  { id: 2, name: "The Brand Pulse", category: "Brand", status: "sent", lastEdited: "2 days ago", owner: "Alex Morgan", starred: true, recipients: 89, openRate: 68.1, clickRate: 3.8 },
  { id: 3, name: "Morning Media Roundup", category: "Media", status: "scheduled", lastEdited: "4 days ago", owner: "Sophia Patel", starred: true, scheduledFor: "Tomorrow, 8:00 AM" },
  { id: 4, name: "Market Trends Newsletter", category: "Market", status: "draft", lastEdited: "Nov 17", owner: "Rachel Wu", starred: true },
  { id: 5, name: "Weekly Industry Update", category: "Market", status: "sent", lastEdited: "Nov 15", owner: "Tom Nguyen", starred: false, recipients: 234, openRate: 65.2, clickRate: 2.9 },
  { id: 6, name: "Leadership Insights", category: "Leadership", status: "draft", lastEdited: "Nov 14", owner: "David Kim", starred: true },
  { id: 7, name: "Competitor Watch Weekly", category: "Competition", status: "sent", lastEdited: "Nov 12", owner: "Laura Bennett", starred: false, recipients: 178, openRate: 71.8, clickRate: 5.1 },
  { id: 8, name: "Social Trends Digest", category: "Social", status: "scheduled", lastEdited: "Nov 10", owner: "Sophia Patel", starred: true, scheduledFor: "Nov 25, 9:00 AM" },
  { id: 9, name: "Executive Summary Q4", category: "Leadership", status: "sent", lastEdited: "Nov 8", owner: "Rachel Wu", starred: true, recipients: 45, openRate: 82.3, clickRate: 6.7 },
  { id: 10, name: "Crisis Update Brief", category: "Crisis", status: "sent", lastEdited: "Nov 5", owner: "Tom Nguyen", starred: false, recipients: 312, openRate: 78.9, clickRate: 4.5 },
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

const templates = [
  { 
    id: 'scratch',
    title: "Minimalist Template", 
    description: "Start with a simple, minimalist email layout and fully customize it to your needs.",
    badge: null,
    layout: 'minimal' as const
  },
  { 
    id: 'executive',
    title: "Daily Snapshot", 
    description: "A fast, lightweight format designed to keep executives aligned without adding cognitive load.",
    badge: "Best for Executives",
    layout: 'snapshot' as const
  },
  { 
    id: 'weekly',
    title: "Standard Weekly Brief", 
    description: "A balanced brief giving teams context and must-reads, serving as the standard update over a week's worth of news.",
    badge: "Best for Internal Teams",
    layout: 'weekly' as const
  },
  { 
    id: 'longform',
    title: "Deep Dive Analysis", 
    description: "AI generates comprehensive analysis with multiple sections, detailed commentary, and deep insights.",
    badge: "Best for Stakeholders",
    layout: 'detailed' as const
  },
];

type SortField = 'name' | 'category' | 'lastEdited' | 'owner' | 'recipients' | 'openRate' | 'clickRate' | 'status';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'draft' | 'scheduled' | 'sent';

const Distribute = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>('lastEdited');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareItemName, setShareItemName] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const handleOpenShare = (itemName: string) => {
    setShareItemName(itemName);
    setIsShareOpen(true);
  };

  const handleUseTemplate = (templateTitle: string) => {
    toast.success(`Creating newsletter from "${templateTitle}" template`);
  };

  const handleReuse = (newsletterName: string) => {
    toast.success(`Creating new newsletter based on "${newsletterName}"`);
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

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const exists = categories.some(
        (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
      );
      if (exists) {
        toast.error('Category already exists');
        return;
      }
      setCategories(prev => [...prev, { name: newCategoryName.trim(), count: 0 }]);
      setNewCategoryName('');
      setIsAddCategoryOpen(false);
      toast.success(`Category "${newCategoryName.trim()}" added`);
    }
  };

  const filteredItems = statusFilter === 'all' 
    ? allNewsletterItems 
    : allNewsletterItems.filter(item => item.status === statusFilter);

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
    } else if (sortField === 'recipients') {
      comparison = (a.recipients || 0) - (b.recipients || 0);
    } else if (sortField === 'openRate') {
      comparison = (a.openRate || 0) - (b.openRate || 0);
    } else if (sortField === 'clickRate') {
      comparison = (a.clickRate || 0) - (b.clickRate || 0);
    } else if (sortField === 'status') {
      const statusOrder = { 'draft': 0, 'scheduled': 1, 'sent': 2 };
      comparison = (statusOrder[a.status as keyof typeof statusOrder] || 0) - (statusOrder[b.status as keyof typeof statusOrder] || 0);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const displayedItems = sortedItems;

  // Stats
  const totalSent = allNewsletterItems.filter(i => i.status === 'sent').length;
  const avgOpenRate = allNewsletterItems
    .filter(i => i.openRate)
    .reduce((acc, i) => acc + (i.openRate || 0), 0) / totalSent || 0;
  const avgClickRate = allNewsletterItems
    .filter(i => i.clickRate)
    .reduce((acc, i) => acc + (i.clickRate || 0), 0) / totalSent || 0;

  const getStatusBadge = (status: string, scheduledFor?: string) => {
    switch (status) {
      case 'sent':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"><Send className="w-3 h-3" />Sent</span>;
      case 'scheduled':
        return (
          <Tooltip>
            <TooltipTrigger>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600"><Clock className="w-3 h-3" />Scheduled</span>
            </TooltipTrigger>
            <TooltipContent>{scheduledFor}</TooltipContent>
          </Tooltip>
        );
      case 'draft':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"><FileText className="w-3 h-3" />Draft</span>;
      default:
        return null;
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
                Send insights to your stakeholders
              </h1>
              <p className="text-sm text-muted-foreground">
                Create and distribute newsletters to keep your team informed on what matters.
              </p>
            </div>

            {/* Tabbed Interface */}
            <TooltipProvider>
              <Tabs defaultValue="newsletters" className="w-full">
                <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 mb-6">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger 
                          value="newsletters" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Newsletters
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Manage your newsletters - drafts, scheduled, and sent</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger 
                          value="templates" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Templates
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start from pre-built templates</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsList>

                {/* Newsletters Tab */}
                <TabsContent value="newsletters" className="mt-0">
                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Sent</p>
                      <p className="text-2xl font-semibold text-foreground">{totalSent}</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Avg. Open Rate</p>
                      <p className="text-2xl font-semibold text-foreground">{avgOpenRate.toFixed(1)}%</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Avg. Click Rate</p>
                      <p className="text-2xl font-semibold text-foreground">{avgClickRate.toFixed(1)}%</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Drafts</p>
                      <p className="text-2xl font-semibold text-foreground">{allNewsletterItems.filter(i => i.status === 'draft').length}</p>
                    </div>
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

                      {/* Status Filter Tabs */}
                      <div className="px-4 border-b border-border">
                        <div className="flex gap-6">
                          <button 
                            className={`py-3 text-sm font-medium border-b-2 transition-colors ${statusFilter === 'all' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setStatusFilter('all')}
                          >
                            All ({allNewsletterItems.length})
                          </button>
                          <button 
                            className={`py-3 text-sm font-medium border-b-2 transition-colors ${statusFilter === 'draft' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setStatusFilter('draft')}
                          >
                            Drafts ({allNewsletterItems.filter(i => i.status === 'draft').length})
                          </button>
                          <button 
                            className={`py-3 text-sm font-medium border-b-2 transition-colors ${statusFilter === 'scheduled' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setStatusFilter('scheduled')}
                          >
                            Scheduled ({allNewsletterItems.filter(i => i.status === 'scheduled').length})
                          </button>
                          <button 
                            className={`py-3 text-sm font-medium border-b-2 transition-colors ${statusFilter === 'sent' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setStatusFilter('sent')}
                          >
                            Sent ({allNewsletterItems.filter(i => i.status === 'sent').length})
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
                              <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('status')}>
                                Status
                                {sortField === 'status' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                              </button>
                            </th>
                            <th className="p-4 text-sm font-bold text-foreground">
                              <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('recipients')}>
                                Recipients
                                {sortField === 'recipients' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                              </button>
                            </th>
                            <th className="p-4 text-sm font-bold text-foreground">
                              <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('openRate')}>
                                Open Rate
                                {sortField === 'openRate' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                              </button>
                            </th>
                            <th className="p-4 text-sm font-bold text-foreground">
                              <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('clickRate')}>
                                Click Rate
                                {sortField === 'clickRate' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
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
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-foreground underline cursor-pointer hover:text-primary">
                                    {item.name}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                {getStatusBadge(item.status, item.scheduledFor)}
                              </td>
                              <td className="p-4 text-sm text-muted-foreground">
                                {item.recipients ? item.recipients.toLocaleString() : '—'}
                              </td>
                              <td className="p-4 text-sm text-muted-foreground">
                                {item.openRate ? `${item.openRate}%` : '—'}
                              </td>
                              <td className="p-4 text-sm text-muted-foreground">
                                {item.clickRate ? `${item.clickRate}%` : '—'}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                    <User className="w-3 h-3 text-muted-foreground" />
                                  </div>
                                  <span className="text-sm font-bold text-foreground underline cursor-pointer hover:text-primary">{item.owner}</span>
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
                                      <DropdownMenuItem className="cursor-pointer" onClick={() => handleReuse(item.name)}>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Reuse as New
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="cursor-pointer">Copy Link</DropdownMenuItem>
                                      {item.status === 'draft' && (
                                        <>
                                          <DropdownMenuItem className="cursor-pointer">Send Now</DropdownMenuItem>
                                          <DropdownMenuItem className="cursor-pointer">Schedule</DropdownMenuItem>
                                        </>
                                      )}
                                      {item.status === 'scheduled' && (
                                        <DropdownMenuItem className="cursor-pointer">Reschedule</DropdownMenuItem>
                                      )}
                                      <DropdownMenuSeparator />
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
                    </div>

                    {/* Categories Sidebar */}
                    <div className="w-64 sticky top-20 space-y-4">
                      <CategoriesPanel 
                        categories={categories} 
                        onAddCategory={() => setIsAddCategoryOpen(true)} 
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Templates Tab */}
                <TabsContent value="templates" className="mt-0">
                  {/* Select a Template Pane */}
                  <div className="bg-card border border-border rounded-lg p-6 mb-6">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-semibold text-foreground mb-2">Select a template structure to get started</h2>
                      <p className="text-sm text-muted-foreground">
                        Choose a pre-designed layout or start from scratch. All templates are AI-powered.
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      {templates.map((template) => (
                        <div 
                          key={template.id} 
                          className="group cursor-pointer"
                          onClick={() => handleUseTemplate(template.title)}
                        >
                          {/* Thumbnail Preview */}
                          <div className="relative bg-background rounded-lg border border-border p-4 mb-4 aspect-[4/5] hover:border-primary transition-colors overflow-hidden">
                            {/* Selection circle */}
                            <div className="absolute top-3 left-3 w-5 h-5 rounded-full border-2 border-muted-foreground/30 bg-background group-hover:border-primary transition-colors" />
                            
                            {/* Badge */}
                            {template.badge && (
                              <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-primary text-primary-foreground">
                                  {template.badge}
                                </span>
                              </div>
                            )}
                            
                            {/* Schematic layout preview */}
                            <div className="mt-8 space-y-3">
                              {template.layout === 'minimal' && (
                                <>
                                  <div className="h-2 bg-muted-foreground/20 rounded w-3/4" />
                                  <div className="h-2 bg-muted-foreground/20 rounded w-full" />
                                  <div className="h-2 bg-muted-foreground/20 rounded w-5/6" />
                                  <div className="mt-4 h-16 bg-muted-foreground/10 rounded" />
                                  <div className="h-2 bg-muted-foreground/20 rounded w-2/3" />
                                </>
                              )}
                              {template.layout === 'snapshot' && (
                                <>
                                  <div className="flex gap-2">
                                    <div className="h-10 w-10 bg-muted-foreground/20 rounded" />
                                    <div className="flex-1 space-y-2">
                                      <div className="h-2 bg-muted-foreground/20 rounded w-full" />
                                      <div className="h-2 bg-muted-foreground/20 rounded w-3/4" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mt-4">
                                    <div className="h-12 bg-muted-foreground/10 rounded" />
                                    <div className="h-12 bg-muted-foreground/10 rounded" />
                                  </div>
                                  <div className="h-2 bg-muted-foreground/20 rounded w-1/2" />
                                </>
                              )}
                              {template.layout === 'weekly' && (
                                <>
                                  <div className="flex justify-center gap-2 mb-4">
                                    <div className="h-8 w-8 bg-muted-foreground/20 rounded-full" />
                                    <div className="h-8 w-8 bg-muted-foreground/30 rounded-full" />
                                  </div>
                                  <div className="h-2 bg-muted-foreground/20 rounded w-full" />
                                  <div className="h-2 bg-muted-foreground/20 rounded w-4/5" />
                                  <div className="mt-4 space-y-2">
                                    <div className="h-8 bg-muted-foreground/10 rounded" />
                                    <div className="h-8 bg-muted-foreground/10 rounded" />
                                    <div className="h-8 bg-muted-foreground/10 rounded" />
                                  </div>
                                </>
                              )}
                              {template.layout === 'detailed' && (
                                <>
                                  <div className="h-2 bg-muted-foreground/20 rounded w-1/2" />
                                  <div className="h-20 bg-muted-foreground/10 rounded flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-muted-foreground/20 rounded" style={{ borderStyle: 'dashed' }} />
                                  </div>
                                  <div className="space-y-1">
                                    <div className="h-2 bg-muted-foreground/20 rounded w-full" />
                                    <div className="h-2 bg-muted-foreground/20 rounded w-full" />
                                    <div className="h-2 bg-muted-foreground/20 rounded w-3/4" />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {/* Title and Description */}
                          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{template.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Saved Templates Section */}
                  <div className="bg-card border border-border rounded-lg p-6 mb-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Saved templates</h3>
                      <p className="text-sm text-muted-foreground">Templates you've customized and saved for reuse.</p>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="p-4 text-sm font-bold text-foreground">Template Name</th>
                          <th className="p-4 text-sm font-bold text-foreground">Based On</th>
                          <th className="p-4 text-sm font-bold text-foreground">Open Rate</th>
                          <th className="p-4 text-sm font-bold text-foreground">Times Used</th>
                          <th className="p-4 text-sm font-bold text-foreground">Created By</th>
                          <th className="p-4 text-sm font-bold text-foreground">Date Saved</th>
                          <th className="p-4 w-32"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border hover:bg-muted/50 cursor-pointer" onClick={() => handleUseTemplate("Monday Market Brief")}>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground underline hover:text-primary">Monday Market Brief</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Daily Snapshot</td>
                          <td className="p-4 text-sm"><span className="text-primary font-medium">78.2%</span></td>
                          <td className="p-4 text-sm text-muted-foreground">12</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <span className="text-sm font-bold text-foreground underline hover:text-primary">Rachel Wu</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Jan 15, 2026</td>
                          <td className="p-4">
                            <Button size="sm" variant="outline" className="gap-2">
                              <Plus className="w-3 h-3" />
                              Use
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b border-border hover:bg-muted/50 cursor-pointer" onClick={() => handleUseTemplate("Team Comms Weekly")}>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground underline hover:text-primary">Team Comms Weekly</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Standard Weekly Brief</td>
                          <td className="p-4 text-sm"><span className="text-primary font-medium">65.4%</span></td>
                          <td className="p-4 text-sm text-muted-foreground">24</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <span className="text-sm font-bold text-foreground underline hover:text-primary">Tom Nguyen</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Dec 8, 2025</td>
                          <td className="p-4">
                            <Button size="sm" variant="outline" className="gap-2">
                              <Plus className="w-3 h-3" />
                              Use
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b border-border hover:bg-muted/50 cursor-pointer" onClick={() => handleUseTemplate("Executive Flash Update")}>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground underline hover:text-primary">Executive Flash Update</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Minimalist Template</td>
                          <td className="p-4 text-sm"><span className="text-primary font-medium">82.1%</span></td>
                          <td className="p-4 text-sm text-muted-foreground">8</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <span className="text-sm font-bold text-foreground underline hover:text-primary">Laura Bennett</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Jan 22, 2026</td>
                          <td className="p-4">
                            <Button size="sm" variant="outline" className="gap-2">
                              <Plus className="w-3 h-3" />
                              Use
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b border-border hover:bg-muted/50 cursor-pointer" onClick={() => handleUseTemplate("Quarterly Board Update")}>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground underline hover:text-primary">Quarterly Board Update</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Deep Dive Analysis</td>
                          <td className="p-4 text-sm"><span className="text-primary font-medium">91.3%</span></td>
                          <td className="p-4 text-sm text-muted-foreground">4</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <span className="text-sm font-bold text-foreground underline hover:text-primary">Sophia Patel</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Nov 30, 2025</td>
                          <td className="p-4">
                            <Button size="sm" variant="outline" className="gap-2">
                              <Plus className="w-3 h-3" />
                              Use
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b border-border hover:bg-muted/50 cursor-pointer" onClick={() => handleUseTemplate("Client News Digest")}>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground underline hover:text-primary">Client News Digest</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Daily Snapshot</td>
                          <td className="p-4 text-sm"><span className="text-primary font-medium">69.8%</span></td>
                          <td className="p-4 text-sm text-muted-foreground">31</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <span className="text-sm font-bold text-foreground underline hover:text-primary">Rachel Wu</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Oct 12, 2025</td>
                          <td className="p-4">
                            <Button size="sm" variant="outline" className="gap-2">
                              <Plus className="w-3 h-3" />
                              Use
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer" onClick={() => handleUseTemplate("PR Crisis Brief")}>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground underline hover:text-primary">PR Crisis Brief</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Minimalist Template</td>
                          <td className="p-4 text-sm"><span className="text-primary font-medium">88.5%</span></td>
                          <td className="p-4 text-sm text-muted-foreground">3</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <span className="text-sm font-bold text-foreground underline hover:text-primary">Laura Bennett</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">Jan 5, 2026</td>
                          <td className="p-4">
                            <Button size="sm" variant="outline" className="gap-2">
                              <Plus className="w-3 h-3" />
                              Use
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Recent Newsletters to Reuse */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Reuse a previous newsletter</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Start from a newsletter you've already sent. All content and formatting will be copied.
                    </p>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="p-4 text-sm font-bold text-foreground">Newsletter</th>
                          <th className="p-4 text-sm font-bold text-foreground">Category</th>
                          <th className="p-4 text-sm font-bold text-foreground">Sent</th>
                          <th className="p-4 text-sm font-bold text-foreground">Performance</th>
                          <th className="p-4 w-32"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {allNewsletterItems.filter(i => i.status === 'sent').slice(0, 5).map((item) => (
                          <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">{item.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{item.category}</td>
                            <td className="p-4 text-sm text-muted-foreground">{item.lastEdited}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{item.openRate}% opens</span>
                                <span>{item.clickRate}% clicks</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-2"
                                onClick={() => handleReuse(item.name)}
                              >
                                <RefreshCw className="w-3 h-3" />
                                Reuse
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </TooltipProvider>
          </div>
        </div>
      </main>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="category-name">Category name</Label>
            <Input
              id="category-name"
              placeholder="e.g., Weekly Updates, Executive Briefs"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <p className="text-xs text-muted-foreground">
              Categories help you organize newsletters into logical groups.
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

export default Distribute;