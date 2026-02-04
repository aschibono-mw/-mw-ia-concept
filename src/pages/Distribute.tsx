import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ShareDialog } from "@/components/discover/ShareDialog";
import { ChevronDown, ChevronRight, Star, MoreVertical, Plus, Sparkles, FileText, Mail, Users, Clock, Send, RefreshCw, Copy, User, Pencil, Link, FolderInput, Share2, Trash2, Calendar, Grid3X3, List, Folder, Eye } from "lucide-react";
import { CategoriesPanel } from "@/components/dashboard/CategoriesPanel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { Card, CardContent } from "@/components/ui/card";

interface CategoryItem {
  name: string;
  count: number;
}

interface NewsletterVersion {
  id: string;
  status: 'sent' | 'draft' | 'ready_for_review' | 'scheduled';
  date: string;
  recipients?: number;
  openRate?: number;
  clickRate?: number;
  scheduledFor?: string;
}

interface NewsletterItem {
  id: number;
  name: string;
  category: string;
  automationType: 'automated' | 'automated_review' | 'manual';
  lastEdited: string;
  owner: string;
  starred?: boolean;
  versions: NewsletterVersion[];
}

const allNewsletterItems: NewsletterItem[] = [
  { 
    id: 1, name: "The Daily Media Brief", category: "Media", automationType: "automated", lastEdited: "7/2/2025 11:00 AM", owner: "Laura Bennett", starred: true,
    versions: [
      { id: "1a", status: "sent", date: "7/2/2025", recipients: 156, openRate: 72.4, clickRate: 4.2 },
      { id: "1b", status: "sent", date: "7/1/2025", recipients: 148, openRate: 68.1, clickRate: 3.9 },
      { id: "1c", status: "draft", date: "7/3/2025" },
      { id: "1d", status: "ready_for_review", date: "7/3/2025" },
    ]
  },
  { 
    id: 2, name: "The Brand Pulse", category: "Brand", automationType: "automated_review", lastEdited: "2 days ago", owner: "Alex Morgan", starred: true,
    versions: [
      { id: "2a", status: "sent", date: "6/28/2025", recipients: 89, openRate: 68.1, clickRate: 3.8 },
      { id: "2b", status: "ready_for_review", date: "7/1/2025" },
      { id: "2c", status: "draft", date: "7/2/2025" },
    ]
  },
  { 
    id: 3, name: "Morning Media Roundup", category: "Media", automationType: "automated", lastEdited: "4 days ago", owner: "Sophia Patel", starred: true,
    versions: [
      { id: "3a", status: "scheduled", date: "7/5/2025", scheduledFor: "Tomorrow, 8:00 AM" },
      { id: "3b", status: "sent", date: "7/1/2025", recipients: 120, openRate: 75.2, clickRate: 4.8 },
    ]
  },
  { 
    id: 4, name: "Market Trends Newsletter", category: "Market", automationType: "manual", lastEdited: "Nov 17", owner: "Rachel Wu", starred: true,
    versions: [
      { id: "4a", status: "draft", date: "Nov 17" },
      { id: "4b", status: "draft", date: "Nov 15" },
    ]
  },
  { 
    id: 5, name: "Weekly Industry Update", category: "Market", automationType: "automated_review", lastEdited: "Nov 15", owner: "Tom Nguyen", starred: false,
    versions: [
      { id: "5a", status: "sent", date: "Nov 15", recipients: 234, openRate: 65.2, clickRate: 2.9 },
      { id: "5b", status: "sent", date: "Nov 8", recipients: 228, openRate: 63.1, clickRate: 2.7 },
      { id: "5c", status: "ready_for_review", date: "Nov 22" },
    ]
  },
  { 
    id: 6, name: "Leadership Insights", category: "Leadership", automationType: "manual", lastEdited: "Nov 14", owner: "David Kim", starred: true,
    versions: [
      { id: "6a", status: "draft", date: "Nov 14" },
    ]
  },
  { 
    id: 7, name: "Competitor Watch Weekly", category: "Competition", automationType: "automated", lastEdited: "Nov 12", owner: "Laura Bennett", starred: false,
    versions: [
      { id: "7a", status: "sent", date: "Nov 12", recipients: 178, openRate: 71.8, clickRate: 5.1 },
      { id: "7b", status: "scheduled", date: "Nov 19", scheduledFor: "Nov 19, 9:00 AM" },
    ]
  },
  { 
    id: 8, name: "Social Trends Digest", category: "Social", automationType: "automated_review", lastEdited: "Nov 10", owner: "Sophia Patel", starred: true,
    versions: [
      { id: "8a", status: "scheduled", date: "Nov 25", scheduledFor: "Nov 25, 9:00 AM" },
      { id: "8b", status: "ready_for_review", date: "Nov 24" },
      { id: "8c", status: "draft", date: "Nov 23" },
    ]
  },
  { 
    id: 9, name: "Executive Summary Q4", category: "Leadership", automationType: "manual", lastEdited: "Nov 8", owner: "Rachel Wu", starred: true,
    versions: [
      { id: "9a", status: "sent", date: "Nov 8", recipients: 45, openRate: 82.3, clickRate: 6.7 },
    ]
  },
  { 
    id: 10, name: "Crisis Update Brief", category: "Crisis", automationType: "automated", lastEdited: "Nov 5", owner: "Tom Nguyen", starred: false,
    versions: [
      { id: "10a", status: "sent", date: "Nov 5", recipients: 312, openRate: 78.9, clickRate: 4.5 },
      { id: "10b", status: "sent", date: "Oct 29", recipients: 298, openRate: 76.2, clickRate: 4.1 },
      { id: "10c", status: "draft", date: "Nov 12" },
      { id: "10d", status: "ready_for_review", date: "Nov 11" },
      { id: "10e", status: "scheduled", date: "Nov 15", scheduledFor: "Nov 15, 10:00 AM" },
    ]
  },
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

type SortField = 'name' | 'category' | 'lastEdited' | 'owner' | 'recipients' | 'openRate' | 'clickRate' | 'status' | 'automationType';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'draft' | 'scheduled' | 'sent';
type ViewMode = 'cards' | 'table';

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
  const [activeTab, setActiveTab] = useState<string>('newsletters');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

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

  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Helper functions for version counts
  const getVersionCounts = (versions: NewsletterVersion[]) => ({
    sent: versions.filter(v => v.status === 'sent').length,
    draft: versions.filter(v => v.status === 'draft').length,
    ready_for_review: versions.filter(v => v.status === 'ready_for_review').length,
    scheduled: versions.filter(v => v.status === 'scheduled').length,
  });

  const getAggregatedStats = (versions: NewsletterVersion[]) => {
    const sentVersions = versions.filter(v => v.status === 'sent');
    const totalRecipients = sentVersions.reduce((acc, v) => acc + (v.recipients || 0), 0);
    const avgOpenRate = sentVersions.length > 0 
      ? sentVersions.reduce((acc, v) => acc + (v.openRate || 0), 0) / sentVersions.length 
      : 0;
    const avgClickRate = sentVersions.length > 0 
      ? sentVersions.reduce((acc, v) => acc + (v.clickRate || 0), 0) / sentVersions.length 
      : 0;
    return { totalRecipients, avgOpenRate, avgClickRate };
  };

  // Filter newsletters based on whether any version matches the status
  const filteredItems = statusFilter === 'all' 
    ? allNewsletterItems 
    : allNewsletterItems.filter(item => 
        item.versions.some(v => v.status === statusFilter)
      );

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
      comparison = getAggregatedStats(a.versions).totalRecipients - getAggregatedStats(b.versions).totalRecipients;
    } else if (sortField === 'openRate') {
      comparison = getAggregatedStats(a.versions).avgOpenRate - getAggregatedStats(b.versions).avgOpenRate;
    } else if (sortField === 'clickRate') {
      comparison = getAggregatedStats(a.versions).avgClickRate - getAggregatedStats(b.versions).avgClickRate;
    } else if (sortField === 'automationType') {
      const automationOrder = { 'automated': 0, 'automated_review': 1, 'manual': 2 };
      comparison = (automationOrder[a.automationType as keyof typeof automationOrder] || 0) - (automationOrder[b.automationType as keyof typeof automationOrder] || 0);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const displayedItems = sortedItems;

  // Stats - count all sent versions across all newsletters
  const allSentVersions = allNewsletterItems.flatMap(i => i.versions.filter(v => v.status === 'sent'));
  const totalSent = allSentVersions.length;
  const avgOpenRate = totalSent > 0 
    ? allSentVersions.reduce((acc, v) => acc + (v.openRate || 0), 0) / totalSent 
    : 0;
  const avgClickRate = totalSent > 0 
    ? allSentVersions.reduce((acc, v) => acc + (v.clickRate || 0), 0) / totalSent 
    : 0;
  const totalDrafts = allNewsletterItems.reduce((acc, i) => acc + i.versions.filter(v => v.status === 'draft').length, 0);

  const getVersionStatusBadge = (status: string, scheduledFor?: string) => {
    switch (status) {
      case 'sent':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"><Send className="w-3 h-3" />Sent</span>;
      case 'scheduled':
        return scheduledFor ? (
          <Tooltip>
            <TooltipTrigger>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600"><Clock className="w-3 h-3" />Scheduled</span>
            </TooltipTrigger>
            <TooltipContent>{scheduledFor}</TooltipContent>
          </Tooltip>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600"><Clock className="w-3 h-3" />Scheduled</span>
        );
      case 'draft':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"><FileText className="w-3 h-3" />Draft</span>;
      case 'ready_for_review':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600"><Eye className="w-3 h-3" />Ready for review</span>;
      default:
        return null;
    }
  };

  const renderStatusSummary = (versions: NewsletterVersion[]) => {
    const counts = getVersionCounts(versions);
    const parts: React.ReactNode[] = [];
    
    if (counts.sent > 0) {
      parts.push(<span key="sent" className="text-primary font-medium">{counts.sent} Sent</span>);
    }
    if (counts.draft > 0) {
      parts.push(<span key="draft" className="text-muted-foreground">{counts.draft} Draft</span>);
    }
    if (counts.ready_for_review > 0) {
      parts.push(<span key="review" className="text-blue-600">{counts.ready_for_review} Ready for review</span>);
    }
    if (counts.scheduled > 0) {
      parts.push(<span key="scheduled" className="text-amber-600">{counts.scheduled} Scheduled</span>);
    }

    return (
      <div className="flex items-center gap-1 text-xs flex-wrap">
        {parts.map((part, i) => (
          <span key={i} className="flex items-center gap-1">
            {part}
            {i < parts.length - 1 && <span className="text-muted-foreground">,</span>}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="newsletters" />
      <Header />
      
      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Keep stakeholders informed
              </h1>
              <p className="text-sm text-muted-foreground">
                Create and send newsletters to keep your team up to date on what matters.
              </p>
            </div>

            {/* Tabbed Interface */}
            <TooltipProvider>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-border mb-6">
                  <TabsList className="bg-transparent w-auto justify-start rounded-none h-auto p-0 -mb-px">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <TabsTrigger 
                            value="newsletters" 
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Sent newsletters
                          </TabsTrigger>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View your sent newsletters and performance</p>
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
                    <button
                      onClick={() => setActiveTab('templates')}
                      className="ml-2 px-2 py-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Start new
                    </button>
                  </TabsList>
                </div>

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
                      <p className="text-2xl font-semibold text-foreground">{totalDrafts}</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start flex-row-reverse">
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
                        <div className="flex items-center gap-3">
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
                          {/* View Toggle */}
                          <div className="flex items-center border border-border rounded-md">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => setViewMode('cards')}
                                  className={`p-2 transition-colors ${viewMode === 'cards' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
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
                                  className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                  <List className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Table view</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
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
                            Drafts ({allNewsletterItems.reduce((acc, i) => acc + i.versions.filter(v => v.status === 'draft').length, 0)})
                          </button>
                          <button 
                            className={`py-3 text-sm font-medium border-b-2 transition-colors ${statusFilter === 'scheduled' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setStatusFilter('scheduled')}
                          >
                            Scheduled ({allNewsletterItems.reduce((acc, i) => acc + i.versions.filter(v => v.status === 'scheduled').length, 0)})
                          </button>
                          <button 
                            className={`py-3 text-sm font-medium border-b-2 transition-colors ${statusFilter === 'sent' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setStatusFilter('sent')}
                          >
                            Sent ({allNewsletterItems.reduce((acc, i) => acc + i.versions.filter(v => v.status === 'sent').length, 0)})
                          </button>
                        </div>
                      </div>

                      {/* Card View */}
                      {viewMode === 'cards' ? (
                        <div className="grid grid-cols-2 gap-4 p-4">
                          {displayedItems.map((item) => (
                            <Card key={item.id} className="hover:border-primary transition-colors cursor-pointer group">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3 mb-2">
                                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                        {item.name}
                                      </h3>
                                      {item.starred && (
                                        <Star className="w-4 h-4 text-primary fill-primary flex-shrink-0" />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Folder className="w-3 h-3" />
                                      <span>{item.category}</span>
                                    </div>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 bg-card">
                                      <DropdownMenuItem className="cursor-pointer"><Pencil className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                                      <DropdownMenuItem className="cursor-pointer" onClick={() => handleReuse(item.name)}><RefreshCw className="w-4 h-4 mr-2" />Reuse as New</DropdownMenuItem>
                                      <DropdownMenuItem className="cursor-pointer"><Link className="w-4 h-4 mr-2" />Copy Link</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="cursor-pointer"><FolderInput className="w-4 h-4 mr-2" />Move to Category</DropdownMenuItem>
                                      <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenShare(item.name)}><Share2 className="w-4 h-4 mr-2" />Share</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="cursor-pointer text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                {/* Status Summary and Type Badge */}
                                <div className="flex flex-col gap-2 mb-3 pl-[52px]">
                                  {renderStatusSummary(item.versions)}
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium w-fit ${
                                    item.automationType === 'automated' 
                                      ? 'bg-emerald-500/10 text-emerald-600' 
                                      : item.automationType === 'automated_review' 
                                        ? 'bg-blue-500/10 text-blue-600' 
                                        : 'bg-muted text-muted-foreground'
                                  }`}>
                                    {item.automationType === 'automated' && <><Sparkles className="w-3 h-3" />Automated</>}
                                    {item.automationType === 'automated_review' && <><Sparkles className="w-3 h-3" />For Review</>}
                                    {item.automationType === 'manual' && 'Manual'}
                                  </span>
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
                          ))}
                        </div>
                      ) : (
                        /* Table View */
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
                                <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort('automationType')}>
                                  Type
                                  {sortField === 'automationType' && <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
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
                            {displayedItems.map((item) => {
                              const isExpanded = expandedItems.includes(item.id);
                              const stats = getAggregatedStats(item.versions);
                              return (
                                <Collapsible key={item.id} open={isExpanded} onOpenChange={() => toggleExpand(item.id)}>
                                  <tr className="border-b border-border hover:bg-muted/50">
                                    <td className="p-4">
                                      <Checkbox 
                                        checked={selectedItems.includes(item.id)}
                                        onCheckedChange={() => toggleItem(item.id)}
                                      />
                                    </td>
                                    <td className="p-4">
                                      <CollapsibleTrigger asChild>
                                        <div className="flex items-center gap-2 cursor-pointer">
                                          {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                          )}
                                          <Mail className="w-4 h-4 text-muted-foreground" />
                                          <span className="text-sm font-medium text-foreground underline hover:text-primary">
                                            {item.name}
                                          </span>
                                        </div>
                                      </CollapsibleTrigger>
                                    </td>
                                    <td className="p-4">
                                      {renderStatusSummary(item.versions)}
                                    </td>
                                    <td className="p-4">
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                        item.automationType === 'automated' 
                                          ? 'bg-emerald-500/10 text-emerald-600' 
                                          : item.automationType === 'automated_review' 
                                            ? 'bg-blue-500/10 text-blue-600' 
                                            : 'bg-muted text-muted-foreground'
                                      }`}>
                                        {item.automationType === 'automated' && <><Sparkles className="w-3 h-3" />Automated</>}
                                        {item.automationType === 'automated_review' && <><Sparkles className="w-3 h-3" />For Review</>}
                                        {item.automationType === 'manual' && 'Manual'}
                                      </span>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                      {stats.totalRecipients > 0 ? stats.totalRecipients.toLocaleString() : '—'}
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                      {stats.avgOpenRate > 0 ? `${stats.avgOpenRate.toFixed(1)}%` : '—'}
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                      {stats.avgClickRate > 0 ? `${stats.avgClickRate.toFixed(1)}%` : '—'}
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
                                            <DropdownMenuItem className="cursor-pointer">
                                              <Pencil className="w-4 h-4 mr-2" />
                                              Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleReuse(item.name)}>
                                              <RefreshCw className="w-4 h-4 mr-2" />
                                              Reuse as New
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                              <Link className="w-4 h-4 mr-2" />
                                              Copy Link
                                            </DropdownMenuItem>
                                            {item.versions.some(v => v.status === 'draft') && (
                                              <>
                                                <DropdownMenuItem className="cursor-pointer">
                                                  <Send className="w-4 h-4 mr-2" />
                                                  Send Now
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">
                                                  <Calendar className="w-4 h-4 mr-2" />
                                                  Schedule
                                                </DropdownMenuItem>
                                              </>
                                            )}
                                            {item.versions.some(v => v.status === 'scheduled') && (
                                              <DropdownMenuItem className="cursor-pointer">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Reschedule
                                              </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="cursor-pointer">
                                              <FolderInput className="w-4 h-4 mr-2" />
                                              Move to Category
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenShare(item.name)}>
                                              <Share2 className="w-4 h-4 mr-2" />
                                              Share
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="cursor-pointer text-destructive">
                                              <Trash2 className="w-4 h-4 mr-2" />
                                              Delete
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </td>
                                  </tr>
                                  <CollapsibleContent asChild>
                                    <>
                                      {item.versions.map((version) => (
                                        <tr key={version.id} className="bg-muted/30 border-b border-border last:border-b-0">
                                          <td className="p-4"></td>
                                          <td className="p-4 pl-12">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                              <FileText className="w-3 h-3" />
                                              <span>{version.date}</span>
                                            </div>
                                          </td>
                                          <td className="p-4">
                                            {getVersionStatusBadge(version.status, version.scheduledFor)}
                                          </td>
                                          <td className="p-4"></td>
                                          <td className="p-4 text-sm text-muted-foreground">
                                            {version.recipients ? version.recipients.toLocaleString() : '—'}
                                          </td>
                                          <td className="p-4 text-sm text-muted-foreground">
                                            {version.openRate ? `${version.openRate}%` : '—'}
                                          </td>
                                          <td className="p-4 text-sm text-muted-foreground">
                                            {version.clickRate ? `${version.clickRate}%` : '—'}
                                          </td>
                                          <td className="p-4"></td>
                                          <td className="p-4">
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <button className="p-1 hover:bg-muted rounded">
                                                  <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                                                </button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="w-48 bg-card">
                                                <DropdownMenuItem className="cursor-pointer">
                                                  <Pencil className="w-4 h-4 mr-2" />
                                                  Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleReuse(item.name)}>
                                                  <RefreshCw className="w-4 h-4 mr-2" />
                                                  Reuse as New
                                                </DropdownMenuItem>
                                                {version.status === 'sent' && (
                                                  <DropdownMenuItem className="cursor-pointer">
                                                    <Link className="w-4 h-4 mr-2" />
                                                    View in Browser
                                                  </DropdownMenuItem>
                                                )}
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </td>
                                        </tr>
                                      ))}
                                    </>
                                  </CollapsibleContent>
                                </Collapsible>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
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
                        {allNewsletterItems.filter(i => i.versions.some(v => v.status === 'sent')).slice(0, 5).map((item) => {
                          const sentVersions = item.versions.filter(v => v.status === 'sent');
                          const latestSent = sentVersions[0];
                          const avgOpenRate = sentVersions.reduce((acc, v) => acc + (v.openRate || 0), 0) / sentVersions.length;
                          const avgClickRate = sentVersions.reduce((acc, v) => acc + (v.clickRate || 0), 0) / sentVersions.length;
                          return (
                            <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-sm text-muted-foreground">{item.category}</td>
                              <td className="p-4 text-sm text-muted-foreground">{latestSent?.date || item.lastEdited}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span>{avgOpenRate.toFixed(1)}% opens</span>
                                  <span>{avgClickRate.toFixed(1)}% clicks</span>
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
                          );
                        })}
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