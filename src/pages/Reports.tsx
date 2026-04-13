import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ShareDialog } from "@/components/discover/ShareDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  Download,
  FileText,
  MoreVertical,
  Search,
  Share2,
  Trash2,
  Copy,
  Eye,
  User,
} from "lucide-react";

interface ReportItem {
  id: number;
  name: string;
  type: string;
  generatedBy: string;
  generatedAt: string;
  status: "completed" | "scheduled" | "failed";
  format: string;
}

const mockReports: ReportItem[] = [
  { id: 1, name: "Weekly Brand Health Summary", type: "Dashboard Export", generatedBy: "Rachel Wu", generatedAt: "Apr 13, 2026 · 9:04 AM", status: "completed", format: "PDF" },
  { id: 2, name: "Competitor Benchmark Q1", type: "Scheduled Report", generatedBy: "Tom Nguyen", generatedAt: "Apr 12, 2026 · 6:00 AM", status: "completed", format: "PDF" },
  { id: 3, name: "Executive Visibility – March", type: "Dashboard Export", generatedBy: "Sophia Patel", generatedAt: "Apr 10, 2026 · 3:15 PM", status: "completed", format: "PPTX" },
  { id: 4, name: "Crisis Monitor Snapshot", type: "One-time Export", generatedBy: "Rachel Wu", generatedAt: "Apr 9, 2026 · 11:30 AM", status: "completed", format: "PDF" },
  { id: 5, name: "Daily Media Brief – Apr 8", type: "Scheduled Report", generatedBy: "System", generatedAt: "Apr 8, 2026 · 7:00 AM", status: "completed", format: "Email" },
  { id: 6, name: "Audience Insights Deep Dive", type: "Dashboard Export", generatedBy: "David Kim", generatedAt: "Apr 7, 2026 · 2:45 PM", status: "completed", format: "PDF" },
  { id: 7, name: "Sentiment Tracker – Weekly", type: "Scheduled Report", generatedBy: "System", generatedAt: "Apr 7, 2026 · 6:00 AM", status: "completed", format: "CSV" },
  { id: 8, name: "Campaign Performance Recap", type: "One-time Export", generatedBy: "Alex Morgan", generatedAt: "Apr 5, 2026 · 4:20 PM", status: "completed", format: "PPTX" },
  { id: 9, name: "Global Coverage Report", type: "Scheduled Report", generatedBy: "System", generatedAt: "Apr 5, 2026 · 6:00 AM", status: "failed", format: "PDF" },
  { id: 10, name: "Influencer Watch – Monthly", type: "Dashboard Export", generatedBy: "Sophia Patel", generatedAt: "Apr 1, 2026 · 10:00 AM", status: "completed", format: "PDF" },
  { id: 11, name: "Risk Monitor Summary", type: "Scheduled Report", generatedBy: "System", generatedAt: "Mar 31, 2026 · 6:00 AM", status: "completed", format: "PDF" },
  { id: 12, name: "Investor Sentiment Brief", type: "One-time Export", generatedBy: "David Kim", generatedAt: "Mar 28, 2026 · 1:10 PM", status: "completed", format: "PDF" },
];

const statusColors: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",
};

const formatColors: Record<string, string> = {
  PDF: "bg-orange-100 text-orange-700",
  PPTX: "bg-purple-100 text-purple-700",
  CSV: "bg-teal-100 text-teal-700",
  Email: "bg-sky-100 text-sky-700",
};

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareItemName, setShareItemName] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("Anyone");

  const types = ["All", ...Array.from(new Set(mockReports.map((r) => r.type)))];
  const owners = ["Anyone", ...Array.from(new Set(mockReports.map((r) => r.generatedBy)))];

  const filteredReports = mockReports.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.generatedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All" || r.type === typeFilter;
    const matchesOwner = ownerFilter === "Anyone" || r.generatedBy === ownerFilter;
    return matchesSearch && matchesType && matchesOwner;
  });

  const toggleItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === filteredReports.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredReports.map((r) => r.id));
    }
  };

  const handleShare = (name: string) => {
    setShareItemName(name);
    setIsShareOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="reports" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Reports Repository
              </h1>
              <p className="text-sm text-muted-foreground">
                History and archive of all generated reports across your workspace.
              </p>
            </div>

            {/* Table */}
            <div className="bg-card rounded-lg border border-border">
              {/* Controls */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-foreground">
                    All Reports{" "}
                    <span className="font-normal text-muted-foreground">
                      ({filteredReports.length})
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-8 w-52 text-sm"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        Type: {typeFilter}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-card">
                      {types.map((t) => (
                        <DropdownMenuItem
                          key={t}
                          className="cursor-pointer"
                          onClick={() => setTypeFilter(t)}
                        >
                          {t}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        By: {ownerFilter}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-card">
                      {owners.map((o) => (
                        <DropdownMenuItem
                          key={o}
                          className="cursor-pointer"
                          onClick={() => setOwnerFilter(o)}
                        >
                          {o}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-[40px_1fr_140px_150px_90px_80px_50px] items-center px-4 py-2.5 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <div>
                  <Checkbox
                    checked={
                      selectedItems.length === filteredReports.length &&
                      filteredReports.length > 0
                    }
                    onCheckedChange={toggleAll}
                  />
                </div>
                <div>Report Name</div>
                <div>Type</div>
                <div>Generated By</div>
                <div>Format</div>
                <div>Status</div>
                <div />
              </div>

              {/* Table Body */}
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="grid grid-cols-[40px_1fr_140px_150px_90px_80px_50px] items-center px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
                >
                  <div>
                    <Checkbox
                      checked={selectedItems.includes(report.id)}
                      onCheckedChange={() => toggleItem(report.id)}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">
                        {report.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-6">
                      {report.generatedAt}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">{report.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground truncate">
                      {report.generatedBy}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                        formatColors[report.format] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {report.format}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                        statusColors[report.status]
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 bg-card">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleShare(report.name)}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {filteredReports.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No reports found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        itemName={shareItemName}
      />
    </div>
  );
};

export default Reports;
