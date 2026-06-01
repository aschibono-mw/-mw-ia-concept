import { useState } from "react";
import { Link, Link as RouterLink } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  LayoutGrid, GitCompare, Search, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, MoreVertical, SlidersHorizontal,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const TEAL = "#00827F";

interface DashboardItem {
  id: number;
  name: string;
  input: string;
  type: string;
  createdBy: string;
  createdOn: string;
  status: "Ready" | "Failed" | "Processing";
}

const ITEMS: DashboardItem[] = [
  { id: 1, name: "capcom",    input: "CAPCOM",  type: "Explore search", createdBy: "Matt Quinlan",   createdOn: "Mar 20, 2026", status: "Ready"   },
  { id: 2, name: "test",      input: "Crypto",  type: "Explore search", createdBy: "Robert Rydefalk", createdOn: "Apr 23, 2024", status: "Failed"  },
  { id: 3, name: "MarkTest",  input: "Airbnb",  type: "Explore search", createdBy: "",               createdOn: "Oct 25, 2023", status: "Ready"   },
];

type SortField = "name" | "input" | "type" | "createdBy" | "createdOn" | "status";
type SortDir   = "asc" | "desc";

const StatusBadge = ({ status }: { status: DashboardItem["status"] }) => {
  if (status === "Ready")
    return <span className="flex items-center gap-1 text-sm text-green-600"><CheckCircle2 className="w-3.5 h-3.5 fill-green-600 text-white" /> Ready</span>;
  if (status === "Failed")
    return <span className="flex items-center gap-1 text-sm text-red-500"><XCircle className="w-3.5 h-3.5 fill-red-500 text-white" /> Dashboard failed</span>;
  return <span className="text-sm text-muted-foreground">Processing…</span>;
};

export default function AuthorSegments() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>("createdOn");
  const [sortDir, setSortDir]     = useState<SortDir>("desc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };
  const toggleAll = () =>
    setSelected(s => s.length === ITEMS.length ? [] : ITEMS.map(i => i.id));

  const filtered = ITEMS.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.input.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const av = a[sortField] as string;
    const bv = b[sortField] as string;
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3" />;
  };

  const ColHeader = ({ field, label, className = "" }: { field: SortField; label: string; className?: string }) => (
    <th className={`p-4 text-sm font-bold text-foreground ${className}`}>
      <button className="flex items-center gap-1 hover:text-primary" onClick={() => toggleSort(field)}>
        {label} <SortIcon field={field} />
      </button>
    </th>
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="author-segments" />
      <Header />

      <main className="ml-52 pt-16 bg-white">
        <div className="px-8 pt-8 pb-10">
          <div className="rounded-[28px] px-8 pt-6 pb-8 w-full" style={{ backgroundColor: "#F2F5F5" }}>
          <div className="w-full max-w-[1100px] mx-auto">

          {/* Page header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-foreground mb-1">
                Author Segments
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover audience segments on X, analyze author behavior, and unlock targeting insights for your campaigns.
              </p>
            </div>
            <RouterLink to="/author-segments-landing" className="text-xs text-muted-foreground hover:text-foreground underline shrink-0 mt-1">
              View first time UX
            </RouterLink>
          </div>

          {/* Input / Compare cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Input dashboard */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <LayoutGrid className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-semibold text-foreground">Input dashboard</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Create a dashboard from a previously saved Explore search or X handle
              </p>
              <div className="flex items-center gap-3">
                <button
                  className="text-sm font-semibold text-foreground border border-border rounded px-3 py-1.5 hover:bg-muted"
                >
                  Create
                </button>
                <button className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                  Learn More
                </button>
              </div>
            </div>

            {/* Compare dashboard */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <GitCompare className="w-5 h-5 text-pink-500" />
                </div>
                <span className="font-semibold text-foreground">Compare dashboard</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Compare up to five previously saved input dashboards. Compare dashboards cannot be saved.
              </p>
              <div className="flex items-center gap-3">
                <button className="text-sm font-semibold text-foreground border border-border rounded px-3 py-1.5 hover:bg-muted">
                  Create
                </button>
                <button className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Table card */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Table header bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold text-foreground">{filtered.length} Dashboards</span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="pl-8 pr-3 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 w-48"
                  />
                </div>
                <button className="p-1.5 hover:bg-muted rounded text-muted-foreground">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-4 w-10">
                    <Checkbox
                      checked={selected.length === ITEMS.length}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  <ColHeader field="name"      label="Name"       />
                  <ColHeader field="input"     label="Input"      />
                  <ColHeader field="type"      label="Type"       />
                  <ColHeader field="createdBy" label="Created by" />
                  <ColHeader field="createdOn" label="Created on" />
                  <ColHeader field="status"    label="Status"     />
                  <th className="p-4 w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                    <td className="p-4">
                      <Checkbox
                        checked={selected.includes(item.id)}
                        onCheckedChange={() =>
                          setSelected(s =>
                            s.includes(item.id) ? s.filter(x => x !== item.id) : [...s, item.id]
                          )
                        }
                      />
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/author-segments-detail/${encodeURIComponent(item.name)}`}
                        className="text-sm font-medium text-foreground hover:text-primary underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-foreground">{item.input}</td>
                    <td className="p-4 text-sm text-muted-foreground">{item.type}</td>
                    <td className="p-4 text-sm text-muted-foreground">{item.createdBy}</td>
                    <td className="p-4 text-sm text-muted-foreground">{item.createdOn}</td>
                    <td className="p-4"><StatusBadge status={item.status} /></td>
                    <td className="p-4">
                      <button className="p-1 hover:bg-muted rounded text-muted-foreground opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-end px-4 py-3 border-t border-border text-sm text-muted-foreground gap-3">
              <span>1–{filtered.length} of {filtered.length}</span>
              <button className="p-1 hover:bg-muted rounded disabled:opacity-30" disabled>‹</button>
              <button className="p-1 hover:bg-muted rounded disabled:opacity-30" disabled>›</button>
            </div>
          </div>

          </div>
          </div>
        </div>
      </main>
    </div>
  );
}
