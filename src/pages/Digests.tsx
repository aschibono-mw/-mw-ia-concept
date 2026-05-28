import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, MoreVertical, Pencil, Trash2, Send, ChevronDown, X } from "lucide-react";
import { CreateDigestDialog } from "@/components/digests/CreateDigestDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const REPORT_TYPES = [
  "Explore Report",
  "Analyze Report",
  "Monitor Report",
  "Audience Report",
  "Newsletter Report",
  "GenAI Lens Report",
  "Social Trend Report",
  "Digest Report",
];

const TYPE_COLORS: Record<string, string> = {
  "Explore Report":      "bg-blue-50 text-blue-700 border-blue-200",
  "Analyze Report":      "bg-teal-50 text-teal-700 border-teal-200",
  "Monitor Report":      "bg-purple-50 text-purple-700 border-purple-200",
  "Audience Report":     "bg-pink-50 text-pink-700 border-pink-200",
  "Newsletter Report":   "bg-indigo-50 text-indigo-700 border-indigo-200",
  "GenAI Lens Report":   "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Social Trend Report": "bg-rose-50 text-rose-700 border-rose-200",
  "Digest Report":       "bg-amber-50 text-amber-700 border-amber-200",
};

const digests = [
  { id: "1",  name: "Digest Report",              type: "Digest Report",       basedOn: "Yelp Brand Search, Yelp Negative ...",                   recipients: ["Antonio Schibono"],                                                                                                                                                createdBy: "Antonio Schibono" },
  { id: "2",  name: "Weekly Brand Monitor",        type: "Monitor Report",      basedOn: "Meltwater Brand Coverage, Competitor Mentions",           recipients: ["Sarah Lin", "James Okoro", "Rachel Kim", "Ben Torres", "Mei Chen", "Luca Rossi", "Fatima Al-Hassan", "Noah Patel", "Chloe Dupont", "Marcus Webb", "Ingrid Svensson", "Yusuf Diallo", "Elena Vasquez", "Tariq Hassan", "Simone Moreau", "Dmitri Volkov", "Aisha Okonkwo"], createdBy: "Sarah Lin" },
  { id: "3",  name: "Executive News Briefing",     type: "Explore Report",      basedOn: "CEO Mentions, Leadership Coverage, ...",                  recipients: ["David Marsh", "Antonio Schibono", "Priya Nair", "Tom Reeves", "Sarah Lin", "James Okoro", "Rachel Kim", "Ben Torres"],                                             createdBy: "David Marsh" },
  { id: "4",  name: "Competitor Intelligence",     type: "Analyze Report",      basedOn: "Competitor A, Competitor B, Market Share ...",            recipients: ["Priya Nair"],                                                                                                                                                      createdBy: "Priya Nair" },
  { id: "5",  name: "Social Listening Weekly",     type: "Social Trend Report", basedOn: "Twitter Brand Mentions, Instagram Tags",                  recipients: ["Tom Reeves", "Sarah Lin", "James Okoro", "Rachel Kim", "Ben Torres", "Mei Chen"],                                                                                  createdBy: "Tom Reeves" },
  { id: "6",  name: "Crisis & Reputation Alerts",  type: "Monitor Report",      basedOn: "Negative Sentiment Search, Crisis Keywords",             recipients: ["Antonio Schibono", "David Marsh"],                                                                                                                                  createdBy: "Antonio Schibono" },
  { id: "7",  name: "Industry Trends Digest",      type: "GenAI Lens Report",   basedOn: "SaaS Industry News, Analyst Reports, ...",                recipients: ["Priya Nair", "Tom Reeves", "Luca Rossi", "Mei Chen"],                                                                                                              createdBy: "Priya Nair" },
  { id: "8",  name: "Campaign Performance Roundup",type: "Analyze Report",      basedOn: "Q2 Campaign Search, Paid Media Coverage",                 recipients: ["Sarah Lin"],                                                                                                                                                       createdBy: "Sarah Lin" },
  { id: "9",  name: "Product Launch Tracker",      type: "Explore Report",      basedOn: "Product Mentions, Launch Keywords, Reviews",              recipients: ["James Okoro", "Priya Nair", "Ben Torres", "Rachel Kim", "Chloe Dupont", "Marcus Webb", "Ingrid Svensson", "Yusuf Diallo", "Elena Vasquez", "Tariq Hassan", "Simone Moreau"], createdBy: "James Okoro" },
  { id: "10", name: "Monthly Earnings Coverage",   type: "Newsletter Report",   basedOn: "Earnings Call Search, Financial Media",                   recipients: ["David Marsh"],                                                                                                                                                     createdBy: "David Marsh" },
];

const Digests = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (type: string) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filtered = digests.filter((d) => {
    const matchesSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeFilters.length === 0 || activeFilters.includes(d.type);
    return matchesSearch && matchesType;
  });

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((d) => d.id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="digests" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-extrabold font-nunito text-foreground mb-1">Deliver insights to your inbox</h1>
                <p className="text-sm text-muted-foreground">
                  Schedule curated email digests from your searches to keep your team informed.
                </p>
              </div>
              <Button className="gap-2" onClick={() => setCreateOpen(true)}>
                <Plus className="w-4 h-4" />
                Create Digest
              </Button>
            </div>

            {/* Table Card */}
            <div className="bg-card rounded-lg border border-border">
              {/* Toolbar */}
              <div className="flex items-center px-4 py-2 border-b border-border gap-2">
                {/* Filter chip */}
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen((v) => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                      activeFilters.length > 0
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Report Type
                    {activeFilters.length > 0 && (
                      <span className="bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                        {activeFilters.length}
                      </span>
                    )}
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {filterOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
                      {REPORT_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleFilter(type)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted text-left"
                        >
                          <Checkbox
                            checked={activeFilters.includes(type)}
                            onCheckedChange={() => toggleFilter(type)}
                            className="pointer-events-none"
                          />
                          {type}
                        </button>
                      ))}
                      {activeFilters.length > 0 && (
                        <div className="border-t border-border mt-1 pt-1 px-3 pb-1">
                          <button
                            onClick={() => setActiveFilters([])}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Active filter pills */}
                {activeFilters.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                  >
                    {f}
                    <button onClick={() => toggleFilter(f)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <div className="ml-auto flex items-center gap-2">
                  {searchOpen && (
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search digests..."
                      className="text-sm border border-border rounded px-2 py-1 outline-none focus:border-primary w-44"
                    />
                  )}
                  <button
                    className="p-1.5 hover:bg-muted rounded"
                    onClick={() => { setSearchOpen((v) => !v); if (searchOpen) setSearchQuery(""); }}
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Table */}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-4 w-10">
                      <Checkbox
                        checked={selected.length === filtered.length && filtered.length > 0}
                        onCheckedChange={toggleAll}
                      />
                    </th>
                    <th className="p-4 text-sm font-bold text-foreground">Name</th>
                    <th className="p-4 text-sm font-bold text-foreground">Report Type</th>
                    <th className="p-4 text-sm font-bold text-foreground">Based on</th>
                    <th className="p-4 text-sm font-bold text-foreground">Recipients</th>
                    <th className="p-4 text-sm font-bold text-foreground">Created by</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((digest) => (
                    <tr
                      key={digest.id}
                      className="border-b border-border last:border-b-0 hover:bg-muted/50"
                    >
                      <td className="px-4 py-3.5">
                        <Checkbox
                          checked={selected.includes(digest.id)}
                          onCheckedChange={() => toggleOne(digest.id)}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium text-foreground">{digest.name}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${TYPE_COLORS[digest.type]}`}>
                          {digest.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-muted-foreground">{digest.basedOn}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm text-muted-foreground">
                            {digest.recipients.slice(0, 2).join(", ")}
                          </span>
                          {digest.recipients.length > 2 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-xs font-medium text-primary cursor-pointer leading-none underline-offset-2 hover:underline">
                                  +{digest.recipients.length - 2} more
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[220px] z-[9999]">
                                <p className="text-xs leading-relaxed">
                                  {digest.recipients.slice(2).join(", ")}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-muted-foreground">{digest.createdBy}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-muted rounded">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-card">
                            <DropdownMenuItem className="cursor-pointer">
                              <Send className="w-4 h-4 mr-2" />
                              Send now
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No digests match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-4 py-2.5 border-t border-border text-right">
                <span className="text-xs text-muted-foreground">
                  {filtered.length} of {digests.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <CreateDigestDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
};

export default Digests;
