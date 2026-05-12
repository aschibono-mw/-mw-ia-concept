import { useState } from "react";
import { Info, Search, Plus, ChevronLeft, ChevronRight, MoreVertical, Zap, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AutomationRule {
  id: number;
  name: string;
  status: "active" | "inactive";
  summary: string;
  lastEditedBy: string;
  type: string;
  lastEdit: string;
}

const initialRules: AutomationRule[] = [
  {
    id: 1,
    name: "Tag high-reach articles",
    status: "active",
    summary: "If reach > 1M, apply tag 'High Impact'",
    lastEditedBy: "Rachel Wu",
    type: "Tagging",
    lastEdit: "May 10, 2026",
  },
  {
    id: 2,
    name: "Flag CEO mentions",
    status: "active",
    summary: "If mention includes CEO name, apply tag 'Executive Coverage'",
    lastEditedBy: "Tom Nguyen",
    type: "Tagging",
    lastEdit: "May 8, 2026",
  },
  {
    id: 3,
    name: "Archive low-relevance content",
    status: "active",
    summary: "If relevance score < 20%, move to archive folder",
    lastEditedBy: "Sophia Patel",
    type: "Folder",
    lastEdit: "May 5, 2026",
  },
  {
    id: 4,
    name: "Escalate crisis keywords",
    status: "active",
    summary: "If sentiment is negative and reach > 500K, send alert",
    lastEditedBy: "David Kim",
    type: "Alert",
    lastEdit: "Apr 29, 2026",
  },
  {
    id: 5,
    name: "Label competitor coverage",
    status: "inactive",
    summary: "If source mentions competitor brands, apply label 'Competitor Watch'",
    lastEditedBy: "Alex Morgan",
    type: "Labelling",
    lastEdit: "Apr 14, 2026",
  },
  {
    id: 6,
    name: "Route earnings mentions",
    status: "inactive",
    summary: "If article contains earnings-related keywords, tag 'Earnings Season'",
    lastEditedBy: "Rachel Wu",
    type: "Tagging",
    lastEdit: "Mar 31, 2026",
  },
];

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export const AutomationTab = () => {
  const [rules, setRules] = useState<AutomationRule[]>(initialRules);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleType, setNewRuleType] = useState("Tagging");

  const filtered = rules.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const start = filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, filtered.length);

  const toggleStatus = (id: number) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "active" ? "inactive" : "active" } : r
      )
    );
  };

  const deleteRule = (id: number) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCreateRule = () => {
    if (!newRuleName.trim()) return;
    const newRule: AutomationRule = {
      id: Date.now(),
      name: newRuleName.trim(),
      status: "inactive",
      summary: "No conditions set yet",
      lastEditedBy: "John Box",
      type: newRuleType,
      lastEdit: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setRules((prev) => [newRule, ...prev]);
    setNewRuleName("");
    setNewRuleType("Tagging");
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-0">
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-base font-semibold text-foreground">
            {filtered.length} Automation rule{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search rules..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="pl-8 h-8 w-48 text-sm"
                  onBlur={() => { if (!searchQuery) setIsSearchOpen(false); }}
                />
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
            <Button size="sm" className="h-8 gap-1.5" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Create Rule
            </Button>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 border-b border-blue-100 text-sm text-blue-800">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
          <span>Your account has a limit of 5,000 document changes per day that can be processed with rules automation.</span>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[2fr_100px_2fr_140px_110px_120px_44px] items-center px-4 py-2.5 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div>Name</div>
          <div>Status</div>
          <div>Summary</div>
          <div>Last Edited By</div>
          <div>Type</div>
          <div>Last Edit</div>
          <div />
        </div>

        {/* Rows */}
        {paginated.length > 0 ? (
          <div className="divide-y divide-border">
            {paginated.map((rule) => (
              <div
                key={rule.id}
                className="grid grid-cols-[2fr_100px_2fr_140px_110px_120px_44px] items-center px-4 py-3 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0 pr-4">
                  <Zap className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate">{rule.name}</span>
                </div>
                <div>
                  <button
                    onClick={() => toggleStatus(rule.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                      rule.status === "active"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Circle className={`w-1.5 h-1.5 ${rule.status === "active" ? "fill-emerald-500 text-emerald-500" : "fill-muted-foreground text-muted-foreground"}`} />
                    {rule.status === "active" ? "Active" : "Inactive"}
                  </button>
                </div>
                <div className="pr-4">
                  <span className="text-sm text-muted-foreground line-clamp-1">{rule.summary}</span>
                </div>
                <div>
                  <span className="text-sm text-foreground">{rule.lastEditedBy}</span>
                </div>
                <div>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{rule.type}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">{rule.lastEdit}</span>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-card">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => toggleStatus(rule.id)}>
                        {rule.status === "active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive"
                        onClick={() => deleteRule(rule.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center">
              <Zap className="w-10 h-10 text-teal-400" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground mb-1">No automation rules found</p>
              <p className="text-sm text-muted-foreground">You can manage automation rules here</p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>Create Rule</Button>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 px-4 py-3 border-t border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 font-medium text-foreground hover:text-primary">
                  {rowsPerPage}
                  <ChevronLeft className="w-3 h-3 rotate-[-90deg]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-20 bg-card">
                {ROWS_PER_PAGE_OPTIONS.map((n) => (
                  <DropdownMenuItem
                    key={n}
                    className="cursor-pointer"
                    onClick={() => { setRowsPerPage(n); setPage(1); }}
                  >
                    {n}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <span>{start}–{end} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Rule dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create automation rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Rule name</label>
              <Input
                autoFocus
                placeholder="e.g. Tag high-reach articles"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreateRule(); }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type</label>
              <Select value={newRuleType} onValueChange={setNewRuleType}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tagging">Tagging</SelectItem>
                  <SelectItem value="Labelling">Labelling</SelectItem>
                  <SelectItem value="Folder">Folder</SelectItem>
                  <SelectItem value="Alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); setNewRuleName(""); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateRule} disabled={!newRuleName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
