import { useState, useRef } from "react";
import { Upload, Download, Trash2, FileImage, FileText, Presentation, Film, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type AssetCategory = "Logo" | "Brand Guide" | "Marketing" | "Template" | "Video" | "Other";

interface BrandAsset {
  id: string;
  name: string;
  category: AssetCategory;
  fileType: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  description: string;
}

const INITIAL_ASSETS: BrandAsset[] = [
  { id: "1", name: "Primary Logo – Full Color",        category: "Logo",        fileType: "SVG",  size: "48 KB",  uploadedBy: "Tony S.",   uploadedAt: "May 12, 2026", description: "Main logo on white/light backgrounds" },
  { id: "2", name: "Primary Logo – White Reverse",     category: "Logo",        fileType: "SVG",  size: "44 KB",  uploadedBy: "Tony S.",   uploadedAt: "May 12, 2026", description: "White version for dark backgrounds" },
  { id: "3", name: "Logo Icon Mark",                   category: "Logo",        fileType: "PNG",  size: "120 KB", uploadedBy: "Tony S.",   uploadedAt: "May 12, 2026", description: "Square icon for avatars and favicons" },
  { id: "4", name: "Brand Guidelines 2026",            category: "Brand Guide", fileType: "PDF",  size: "8.4 MB", uploadedBy: "Design",    uploadedAt: "Jan 3, 2026",  description: "Full brand identity documentation" },
  { id: "5", name: "Tone of Voice Guide",              category: "Brand Guide", fileType: "PDF",  size: "2.1 MB", uploadedBy: "Design",    uploadedAt: "Jan 3, 2026",  description: "Writing style and messaging principles" },
  { id: "6", name: "Color & Typography Tokens",        category: "Brand Guide", fileType: "PDF",  size: "1.2 MB", uploadedBy: "Design",    uploadedAt: "Feb 18, 2026", description: "Hex codes, fonts, spacing rules" },
  { id: "7", name: "Q2 Campaign – Hero Banner",        category: "Marketing",   fileType: "PNG",  size: "3.8 MB", uploadedBy: "Marketing", uploadedAt: "Apr 1, 2026",  description: "Main visual for Q2 brand campaign" },
  { id: "8", name: "Social Media Ad Pack",             category: "Marketing",   fileType: "ZIP",  size: "22 MB",  uploadedBy: "Marketing", uploadedAt: "Mar 15, 2026", description: "Sized for Instagram, LinkedIn, X" },
  { id: "9", name: "Press Kit 2026",                   category: "Marketing",   fileType: "ZIP",  size: "15 MB",  uploadedBy: "PR Team",   uploadedAt: "Feb 1, 2026",  description: "Logos, bios, and fact sheet bundle" },
  { id: "10", name: "PowerPoint Master Template",      category: "Template",    fileType: "PPTX", size: "6.2 MB", uploadedBy: "Design",    uploadedAt: "Jan 10, 2026", description: "Branded slide deck for all teams" },
  { id: "11", name: "Email Newsletter Template",       category: "Template",    fileType: "HTML", size: "88 KB",  uploadedBy: "Design",    uploadedAt: "Jan 10, 2026", description: "Responsive HTML email template" },
  { id: "12", name: "Word Document Template",          category: "Template",    fileType: "DOCX", size: "210 KB", uploadedBy: "Design",    uploadedAt: "Jan 10, 2026", description: "Letterhead and body formatting" },
  { id: "13", name: "Brand Launch Video 60s",          category: "Video",       fileType: "MP4",  size: "84 MB",  uploadedBy: "Marketing", uploadedAt: "Mar 22, 2026", description: "Hero brand video for web and events" },
  { id: "14", name: "Product Demo Reel",               category: "Video",       fileType: "MP4",  size: "47 MB",  uploadedBy: "Marketing", uploadedAt: "Apr 10, 2026", description: "60s product overview for sales use" },
];

const CATEGORY_COLORS: Record<AssetCategory, string> = {
  Logo:        "bg-blue-100 text-blue-700",
  "Brand Guide": "bg-purple-100 text-purple-700",
  Marketing:   "bg-green-100 text-green-700",
  Template:    "bg-amber-100 text-amber-700",
  Video:       "bg-rose-100 text-rose-700",
  Other:       "bg-gray-100 text-gray-600",
};

const FILE_ICONS: Record<string, React.ReactNode> = {
  SVG:  <FileImage className="w-4 h-4 text-blue-500" />,
  PNG:  <FileImage className="w-4 h-4 text-green-500" />,
  PDF:  <FileText className="w-4 h-4 text-red-500" />,
  PPTX: <Presentation className="w-4 h-4 text-orange-500" />,
  ZIP:  <Package className="w-4 h-4 text-gray-500" />,
  HTML: <FileText className="w-4 h-4 text-teal-500" />,
  DOCX: <FileText className="w-4 h-4 text-blue-600" />,
  MP4:  <Film className="w-4 h-4 text-pink-500" />,
};

const TEAL = "#00827F";

export const BrandTab = () => {
  const [assets, setAssets] = useState<BrandAsset[]>(INITIAL_ASSETS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<AssetCategory | "All">("All");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: Array<AssetCategory | "All"> = ["All", "Logo", "Brand Guide", "Marketing", "Template", "Video", "Other"];

  const filtered = filterCategory === "All" ? assets : assets.filter((a) => a.category === filterCategory);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((a) => a.id)));
  };

  const deleteSelected = () => {
    setAssets((prev) => prev.filter((a) => !selected.has(a.id)));
    setSelected(new Set());
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAssets: BrandAsset[] = Array.from(files).map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: f.name.replace(/\.[^.]+$/, ""),
      category: "Other",
      fileType: f.name.split(".").pop()?.toUpperCase() ?? "FILE",
      size: f.size > 1_000_000 ? `${(f.size / 1_000_000).toFixed(1)} MB` : `${Math.round(f.size / 1000)} KB`,
      uploadedBy: "You",
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      description: "",
    }));
    setAssets((prev) => [...newAssets, ...prev]);
    e.target.value = "";
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={filterCategory === cat
                ? { backgroundColor: TEAL, color: "white", borderColor: TEAL }
                : { backgroundColor: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Download className="w-3.5 h-3.5" /> Download ({selected.size})
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs text-destructive border-destructive/40 hover:bg-destructive/10" onClick={deleteSelected}>
                <Trash2 className="w-3.5 h-3.5" /> Delete ({selected.size})
              </Button>
            </>
          )}
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />
          <Button size="sm" className="gap-1.5 text-xs text-white" style={{ backgroundColor: TEAL }} onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-3.5 h-3.5" /> Upload asset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" />
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Asset</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Category</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Size</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Uploaded</th>
              <th className="w-24 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => (
              <tr
                key={asset.id}
                className={`border-b border-border last:border-0 transition-colors group ${selected.has(asset.id) ? "bg-primary/5" : "hover:bg-muted/30"}`}
              >
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(asset.id)} onChange={() => toggleSelect(asset.id)} className="rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    {FILE_ICONS[asset.fileType] ?? <FileText className="w-4 h-4 text-gray-400" />}
                    <div>
                      <p className="font-medium text-foreground">{asset.name}</p>
                      {asset.description && <p className="text-xs text-muted-foreground mt-0.5">{asset.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[asset.category]}`}>
                    {asset.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{asset.fileType}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{asset.size}</td>
                <td className="px-4 py-3">
                  <p className="text-xs text-muted-foreground">{asset.uploadedAt}</p>
                  <p className="text-xs text-muted-foreground/60">{asset.uploadedBy}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                    <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Download">
                      <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
                      title="Delete"
                      onClick={() => { setAssets((prev) => prev.filter((a) => a.id !== asset.id)); setSelected((prev) => { const next = new Set(prev); next.delete(asset.id); return next; }); }}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive/70" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-sm text-muted-foreground">No assets found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-3">{filtered.length} asset{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  );
};
