import { useState } from "react";
import { 
  Search, 
  Filter, 
  Users, 
  Building2, 
  MapPin, 
  Globe, 
  Star, 
  Mail, 
  Phone, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight,
  Plus,
  X,
  Bookmark,
  Share2,
  MoreHorizontal,
  Sparkles,
  ListFilter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Journalist {
  id: number;
  name: string;
  title: string;
  outlet: string;
  outletLogo?: string;
  location: string;
  topics: string[];
  email?: string;
  phone?: string;
  twitter?: string;
  linkedin?: string;
  recentArticles: number;
  influence: "high" | "medium" | "low";
  saved?: boolean;
}

interface Outlet {
  id: number;
  name: string;
  type: string;
  location: string;
  reach: string;
  topics: string[];
  journalists: number;
  saved?: boolean;
}

const mockJournalists: Journalist[] = [
  { id: 1, name: "Sarah Chen", title: "Senior Technology Reporter", outlet: "TechCrunch", location: "San Francisco, CA", topics: ["AI", "Startups", "Enterprise"], email: "sarah.chen@tc.com", twitter: "@sarahchen", recentArticles: 47, influence: "high", saved: true },
  { id: 2, name: "Michael Roberts", title: "Business Editor", outlet: "Wall Street Journal", location: "New York, NY", topics: ["Finance", "Markets", "Leadership"], email: "m.roberts@wsj.com", recentArticles: 89, influence: "high", saved: false },
  { id: 3, name: "Emma Thompson", title: "Tech Correspondent", outlet: "BBC News", location: "London, UK", topics: ["Technology", "Digital", "Innovation"], twitter: "@emmathompsonbbc", recentArticles: 62, influence: "high", saved: true },
  { id: 4, name: "James Wilson", title: "Staff Writer", outlet: "Wired", location: "San Francisco, CA", topics: ["AI", "Science", "Culture"], email: "jwilson@wired.com", twitter: "@jameswired", recentArticles: 34, influence: "medium", saved: false },
  { id: 5, name: "Lisa Park", title: "Industry Analyst", outlet: "Bloomberg", location: "New York, NY", topics: ["Enterprise", "Cloud", "SaaS"], email: "lpark@bloomberg.net", recentArticles: 78, influence: "high", saved: false },
  { id: 6, name: "David Kim", title: "Contributing Editor", outlet: "Forbes", location: "Chicago, IL", topics: ["Leadership", "Entrepreneurship"], twitter: "@davidkimforbes", recentArticles: 23, influence: "medium", saved: true },
  { id: 7, name: "Rachel Green", title: "Tech Reporter", outlet: "The Verge", location: "Los Angeles, CA", topics: ["Consumer Tech", "Gadgets", "Apps"], email: "rgreen@theverge.com", recentArticles: 56, influence: "medium", saved: false },
  { id: 8, name: "Tom Anderson", title: "Correspondent", outlet: "Reuters", location: "Washington, DC", topics: ["Policy", "Regulation", "Government"], recentArticles: 91, influence: "high", saved: false },
];

const mockOutlets: Outlet[] = [
  { id: 1, name: "TechCrunch", type: "Online Publication", location: "San Francisco, CA", reach: "15M monthly", topics: ["Technology", "Startups", "VC"], journalists: 45, saved: true },
  { id: 2, name: "Wall Street Journal", type: "Newspaper", location: "New York, NY", reach: "42M monthly", topics: ["Business", "Finance", "Markets"], journalists: 250, saved: false },
  { id: 3, name: "BBC News", type: "Broadcast", location: "London, UK", reach: "500M monthly", topics: ["General News", "Technology", "World"], journalists: 2000, saved: true },
  { id: 4, name: "Wired", type: "Magazine", location: "San Francisco, CA", reach: "8M monthly", topics: ["Technology", "Science", "Culture"], journalists: 35, saved: false },
  { id: 5, name: "Bloomberg", type: "News Agency", location: "New York, NY", reach: "100M monthly", topics: ["Finance", "Technology", "Markets"], journalists: 2700, saved: false },
  { id: 6, name: "Forbes", type: "Magazine", location: "New York, NY", reach: "140M monthly", topics: ["Business", "Leadership", "Wealth"], journalists: 180, saved: false },
];

interface FilterSection {
  id: string;
  label: string;
  icon: React.ElementType;
  options: { value: string; label: string; count?: number }[];
}

const filterSections: FilterSection[] = [
  {
    id: "topics",
    label: "Topics & Beats",
    icon: Sparkles,
    options: [
      { value: "ai", label: "AI & Machine Learning", count: 234 },
      { value: "enterprise", label: "Enterprise Tech", count: 189 },
      { value: "startups", label: "Startups & VC", count: 156 },
      { value: "finance", label: "Finance & Markets", count: 145 },
      { value: "consumer", label: "Consumer Tech", count: 98 },
      { value: "policy", label: "Policy & Regulation", count: 67 },
    ],
  },
  {
    id: "location",
    label: "Location",
    icon: MapPin,
    options: [
      { value: "us", label: "United States", count: 1240 },
      { value: "uk", label: "United Kingdom", count: 456 },
      { value: "eu", label: "Europe", count: 312 },
      { value: "apac", label: "Asia Pacific", count: 189 },
    ],
  },
  {
    id: "outlet-type",
    label: "Outlet Type",
    icon: Building2,
    options: [
      { value: "online", label: "Online Publication", count: 890 },
      { value: "newspaper", label: "Newspaper", count: 234 },
      { value: "broadcast", label: "Broadcast", count: 156 },
      { value: "magazine", label: "Magazine", count: 123 },
      { value: "podcast", label: "Podcast", count: 89 },
    ],
  },
  {
    id: "influence",
    label: "Influence Level",
    icon: Star,
    options: [
      { value: "high", label: "High Influence", count: 245 },
      { value: "medium", label: "Medium Influence", count: 567 },
      { value: "low", label: "Emerging", count: 890 },
    ],
  },
];

export const JournalistsOutletsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"journalists" | "outlets">("journalists");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["topics"]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  const toggleFilter = (sectionId: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[sectionId] || [];
      if (current.includes(value)) {
        return { ...prev, [sectionId]: current.filter(v => v !== value) };
      }
      return { ...prev, [sectionId]: [...current, value] };
    });
  };

  const toggleFilterSection = (sectionId: string) => {
    setExpandedFilters(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSearchQuery("");
  };

  const activeFilterCount = Object.values(selectedFilters).flat().length;

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getInfluenceBadgeStyle = (influence: string) => {
    switch (influence) {
      case "high":
        return "bg-primary/10 text-primary border-primary/20";
      case "medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-3">
          {/* Main Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search journalists, outlets, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <ListFilter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Add to List */}
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Create List
          </Button>

          {/* Primary Action */}
          <Button className="gap-2">
            <Mail className="w-4 h-4" />
            Start Pitch
          </Button>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(selectedFilters).map(([sectionId, values]) =>
                values.map(value => {
                  const section = filterSections.find(s => s.id === sectionId);
                  const option = section?.options.find(o => o.value === value);
                  return (
                    <Badge
                      key={`${sectionId}-${value}`}
                      variant="secondary"
                      className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
                      onClick={() => toggleFilter(sectionId, value)}
                    >
                      {option?.label}
                      <X className="w-3 h-3" />
                    </Badge>
                  );
                })
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-sm text-muted-foreground hover:text-foreground ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-64 shrink-0">
            <div className="bg-card rounded-lg border border-border">
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-foreground">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-320px)]">
                <div className="p-2">
                  {filterSections.map((section) => (
                    <Collapsible
                      key={section.id}
                      open={expandedFilters.includes(section.id)}
                      onOpenChange={() => toggleFilterSection(section.id)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted/50 text-left">
                        <div className="flex items-center gap-2">
                          <section.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{section.label}</span>
                        </div>
                        {expandedFilters.includes(section.id) ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-2 pb-2">
                        <div className="space-y-1">
                          {section.options.map((option) => {
                            const isSelected = selectedFilters[section.id]?.includes(option.value);
                            return (
                              <label
                                key={option.value}
                                className={cn(
                                  "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                                  isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                                )}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleFilter(section.id, option.value)}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm text-foreground flex-1">{option.label}</span>
                                {option.count && (
                                  <span className="text-xs text-muted-foreground">{option.count}</span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="flex-1 min-w-0">
          {/* Tabs for Journalists/Outlets */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "journalists" | "outlets")}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="journalists" className="gap-2">
                  <Users className="w-4 h-4" />
                  Journalists
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {mockJournalists.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="outlets" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  Outlets
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {mockOutlets.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Sort by:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-foreground hover:text-primary">
                      Relevance
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Relevance</DropdownMenuItem>
                    <DropdownMenuItem>Recent Activity</DropdownMenuItem>
                    <DropdownMenuItem>Influence (High to Low)</DropdownMenuItem>
                    <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Journalists Results */}
            <TabsContent value="journalists" className="mt-0">
              <div className="bg-card rounded-lg border border-border divide-y divide-border">
                {mockJournalists.map((journalist) => (
                  <div
                    key={journalist.id}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Selection */}
                      <Checkbox
                        checked={selectedItems.includes(journalist.id)}
                        onCheckedChange={() => toggleSelectItem(journalist.id)}
                        className="mt-1"
                      />

                      {/* Avatar */}
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {journalist.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground hover:text-primary cursor-pointer">
                                {journalist.name}
                              </h4>
                              <Badge
                                variant="outline"
                                className={cn("text-xs", getInfluenceBadgeStyle(journalist.influence))}
                              >
                                {journalist.influence === "high" ? "★ High" : journalist.influence === "medium" ? "Medium" : "Emerging"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {journalist.title} at <span className="text-foreground font-medium">{journalist.outlet}</span>
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn("h-8 w-8", journalist.saved && "text-primary")}
                            >
                              <Bookmark className={cn("w-4 h-4", journalist.saved && "fill-current")} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Full Profile</DropdownMenuItem>
                                <DropdownMenuItem>Add to List</DropdownMenuItem>
                                <DropdownMenuItem>Create Pitch</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Recent Articles</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {journalist.location}
                          </span>
                          <span>{journalist.recentArticles} articles this year</span>
                        </div>

                        {/* Topics */}
                        <div className="flex items-center gap-1.5 mt-2">
                          {journalist.topics.map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs font-normal">
                              {topic}
                            </Badge>
                          ))}
                        </div>

                        {/* Contact Methods */}
                        <div className="flex items-center gap-3 mt-3">
                          {journalist.email && (
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                              <Mail className="w-3.5 h-3.5" />
                              Email
                            </button>
                          )}
                          {journalist.twitter && (
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                              <ExternalLink className="w-3.5 h-3.5" />
                              {journalist.twitter}
                            </button>
                          )}
                          {journalist.linkedin && (
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                              <ExternalLink className="w-3.5 h-3.5" />
                              LinkedIn
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Outlets Results */}
            <TabsContent value="outlets" className="mt-0">
              <div className="bg-card rounded-lg border border-border divide-y divide-border">
                {mockOutlets.map((outlet) => (
                  <div
                    key={outlet.id}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Selection */}
                      <Checkbox
                        checked={selectedItems.includes(outlet.id + 100)}
                        onCheckedChange={() => toggleSelectItem(outlet.id + 100)}
                        className="mt-1"
                      />

                      {/* Logo */}
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium text-foreground hover:text-primary cursor-pointer">
                              {outlet.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {outlet.type} • {outlet.location}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn("h-8 w-8", outlet.saved && "text-primary")}
                            >
                              <Bookmark className={cn("w-4 h-4", outlet.saved && "fill-current")} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Full Profile</DropdownMenuItem>
                                <DropdownMenuItem>View Journalists</DropdownMenuItem>
                                <DropdownMenuItem>Add to List</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" />
                            {outlet.reach}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {outlet.journalists} journalists
                          </span>
                        </div>

                        {/* Topics */}
                        <div className="flex items-center gap-1.5 mt-2">
                          {outlet.topics.map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs font-normal">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bulk Actions Bar (when items selected) */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 z-50">
          <span className="text-sm font-medium">{selectedItems.length} selected</span>
          <div className="h-4 w-px bg-background/20" />
          <Button size="sm" variant="secondary" className="h-8 gap-2">
            <Plus className="w-4 h-4" />
            Add to List
          </Button>
          <Button size="sm" variant="secondary" className="h-8 gap-2">
            <Mail className="w-4 h-4" />
            Create Pitch
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-background/70 hover:text-background hover:bg-background/10"
            onClick={() => setSelectedItems([])}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
