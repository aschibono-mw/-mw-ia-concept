import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Search, ArrowRight, ChevronDown, Check,
  Globe, TrendingUp, ShieldAlert, BarChart2, Building2, Users,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const TEAL       = "#00827F";
const TEAL_LIGHT = "rgba(0,130,127,0.08)";
const PURPLE     = "#B627A1";
const AMBER      = "#f59e0b";

// ── Illustration ──────────────────────────────────────────────────────────────
function SegmentsVisual() {
  // Sunburst-style rings
  const cx = 100; const cy = 95;

  const innerSlices = [
    { value: 30, color: TEAL       },
    { value: 25, color: PURPLE     },
    { value: 20, color: AMBER      },
    { value: 15, color: "#4F6AF5"  },
    { value: 10, color: "#e86c5a"  },
  ];
  const outerSlices = [
    { value: 12, color: `${TEAL}99`    },
    { value: 8,  color: `${TEAL}66`    },
    { value: 10, color: `${PURPLE}99`  },
    { value: 8,  color: `${PURPLE}66`  },
    { value: 10, color: `${AMBER}99`   },
    { value: 8,  color: `${AMBER}66`   },
    { value: 8,  color: "#4F6AF599"    },
    { value: 8,  color: "#4F6AF566"    },
    { value: 6,  color: "#e86c5a99"    },
    { value: 6,  color: "#e86c5a66"    },
    { value: 8,  color: "#0ea5e999"    },
    { value: 8,  color: "#0ea5e966"    },
  ];

  const makeRing = (
    slices: { value: number; color: string }[],
    r1: number, r2: number
  ) => {
    const total = slices.reduce((s, d) => s + d.value, 0);
    let cursor = -Math.PI / 2;
    return slices.map((s, i) => {
      const angle = (s.value / total) * 2 * Math.PI;
      const x1o = cx + r2 * Math.cos(cursor); const y1o = cy + r2 * Math.sin(cursor);
      const x1i = cx + r1 * Math.cos(cursor); const y1i = cy + r1 * Math.sin(cursor);
      cursor += angle;
      const x2o = cx + r2 * Math.cos(cursor); const y2o = cy + r2 * Math.sin(cursor);
      const x2i = cx + r1 * Math.cos(cursor); const y2i = cy + r1 * Math.sin(cursor);
      const large = angle > Math.PI ? 1 : 0;
      return (
        <path key={i}
          d={`M${x1i},${y1i} L${x1o},${y1o} A${r2},${r2} 0 ${large},1 ${x2o},${y2o} L${x2i},${y2i} A${r1},${r1} 0 ${large},0 ${x1i},${y1i} Z`}
          fill={s.color} stroke="white" strokeWidth="1"
        />
      );
    });
  };

  // Floating author chips
  const chips = [
    { x: 6,   y: 12,  color: "#4F6AF5", name: "Gamers",    count: "4.2k" },
    { x: 158, y: 8,   color: TEAL,      name: "Tech",      count: "3.1k" },
    { x: 170, y: 130, color: PURPLE,    name: "Creators",  count: "2.8k" },
    { x: 0,   y: 140, color: AMBER,     name: "Finance",   count: "1.9k" },
  ];

  return (
    <svg width="210" height="200" viewBox="0 0 210 200" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        <filter id="as-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,130,127,0.18)" />
        </filter>
        <filter id="chip-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.10)" />
        </filter>
      </defs>

      {/* White centre circle with shadow */}
      <circle cx={cx} cy={cy} r={38} fill="white" filter="url(#as-shadow)" />

      {/* Rings */}
      <g>{makeRing(innerSlices, 40, 60)}</g>
      <g>{makeRing(outerSlices, 62, 80)}</g>

      {/* Centre icon placeholder */}
      <circle cx={cx} cy={cy} r={24} fill="white" />
      <circle cx={cx} cy={cy} r={12} fill={`${TEAL}22`} />
      <circle cx={cx} cy={cy} r={6}  fill={TEAL} />

      {/* Floating chips */}
      {chips.map(c => (
        <g key={c.name} filter="url(#chip-sh)">
          <rect x={c.x} y={c.y} width={56} height={28} rx={6} fill="white" />
          <circle cx={c.x + 10} cy={c.y + 10} r={4} fill={c.color} />
          <rect x={c.x + 18} y={c.y + 7}  width={30} height={4} rx={2} fill={`${c.color}55`} />
          <rect x={c.x + 8}  y={c.y + 17} width={40} height={3} rx={1.5} fill="rgba(0,0,0,0.10)" />
        </g>
      ))}
    </svg>
  );
}

// ── Saved searches (mock) ─────────────────────────────────────────────────────
const SAVED_SEARCHES = [
  { id: "tesla",     label: "Tesla",                    folder: "American Competitors" },
  { id: "brand",     label: "Brand Health",             folder: "Brand"                },
  { id: "exec",      label: "Executive Departures",     folder: "Leadership"           },
  { id: "product",   label: "Product Recall Alerts",    folder: "Crisis"               },
  { id: "industry",  label: "Industry Awards & Recognition", folder: "Brand"           },
  { id: "partner",   label: "Partner Announcements",    folder: "Competition"          },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AuthorSegmentsLanding() {
  const navigate = useNavigate();
  const [query, setQuery]           = useState("");
  const [selected, setSelected]     = useState<string | null>(null);
  const [dropdownOpen, setDropdown] = useState(false);

  const filtered = query
    ? SAVED_SEARCHES.filter(s =>
        s.label.toLowerCase().includes(query.toLowerCase()) ||
        s.folder.toLowerCase().includes(query.toLowerCase())
      )
    : SAVED_SEARCHES;

  const selectedSearch = SAVED_SEARCHES.find(s => s.id === selected);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1" style={{ paddingTop: 64 }}>
        <Sidebar activePage="author-segments" />
        <main className="ml-52 flex-1 overflow-auto bg-white">
          <div className="px-8 pt-8 pb-10">

            {/* ── Rounded grey pane ── */}
            <div
              className="rounded-[28px] px-12 pt-8 pb-10 flex flex-col items-center"
              style={{ backgroundColor: "#F2F5F5" }}
            >
              {/* Eyebrow */}
              <p className="text-[13px] font-bold text-foreground mb-3 tracking-wide text-center">
                X Audience Intelligence
              </p>

              {/* Illustration */}
              <div style={{
                position: "relative", height: 180, overflow: "hidden",
                display: "flex", justifyContent: "center", alignItems: "flex-start",
                width: "100%", marginBottom: -48, marginTop: -4,
              }}>
                <div style={{ transform: "scale(0.88)", transformOrigin: "top center", flexShrink: 0 }}>
                  <SegmentsVisual />
                </div>
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 80, pointerEvents: "none",
                  background: "linear-gradient(to bottom, transparent, #F2F5F5)",
                }} />
              </div>

              {/* Headline */}
              <h1
                className="font-nunito font-black leading-[1.05] tracking-tight text-foreground mb-3 text-center"
                style={{ fontSize: "clamp(34px, 4.5vw, 52px)", position: "relative", zIndex: 1 }}
              >
                Understand who's talking<br />
                <span style={{ color: TEAL }}>and how to reach them.</span>
              </h1>

              {/* Body */}
              <p
                className="text-[15px] leading-relaxed mb-8 text-center"
                style={{ color: "#6b7280", maxWidth: 540 }}
              >
                Author Segments maps X audiences around your searches — revealing who they are, what they care about, and how to target them through ads or direct outreach.
              </p>

              {/* ── Search selector card ── */}
              <div
                className="bg-white rounded-2xl overflow-visible"
                style={{
                  width: "min(580px, 100%)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                {/* Header row */}
                <div className="px-5 pt-5 pb-3">
                  <p className="text-[14px] font-semibold text-foreground mb-1">
                    Select a saved search to get started
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    Author Segments will analyse the X authors in your search results and map them into audience segments.
                  </p>
                </div>

                {/* Dropdown selector */}
                <div className="px-5 pb-2 relative">
                  <button
                    onClick={() => setDropdown(o => !o)}
                    className="w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-[13px] transition-all text-left"
                    style={{
                      border: `1.5px solid ${dropdownOpen || selected ? `${TEAL}60` : "rgba(0,0,0,0.10)"}`,
                    }}
                  >
                    {selectedSearch ? (
                      <span className="flex items-center gap-2 text-foreground font-medium">
                        <Search className="w-4 h-4 flex-shrink-0" style={{ color: TEAL }} />
                        {selectedSearch.label}
                        <span className="text-muted-foreground font-normal text-[11px]">· {selectedSearch.folder}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-muted-foreground/60">
                        <Search className="w-4 h-4 flex-shrink-0" />
                        Choose a search…
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div
                      className="absolute left-5 right-5 top-full mt-1 bg-white rounded-xl overflow-hidden z-50"
                      style={{ border: "1px solid rgba(0,0,0,0.10)", boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
                    >
                      {/* Search within dropdown */}
                      <div className="px-3 pt-3 pb-2">
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-muted/50">
                          <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <input
                            autoFocus
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search saved searches…"
                            className="flex-1 text-[12px] bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto pb-2">
                        {filtered.length === 0 ? (
                          <p className="px-4 py-3 text-[12px] text-muted-foreground">No searches found</p>
                        ) : filtered.map(s => (
                          <button
                            key={s.id}
                            onClick={() => { setSelected(s.id); setDropdown(false); setQuery(""); }}
                            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                          >
                            <span className="flex items-center gap-2">
                              <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                              <span className="text-[13px] text-foreground">{s.label}</span>
                              <span className="text-[11px] text-muted-foreground">· {s.folder}</span>
                            </span>
                            {selected === s.id && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    Analyses X authors from the last 30 days of results
                  </p>
                  <button
                    disabled={!selected}
                    onClick={() => navigate("/author-segments")}
                    className="flex items-center gap-2 text-[13px] font-semibold text-white px-4 py-2 rounded-lg transition-all disabled:opacity-40"
                    style={{ backgroundColor: TEAL }}
                  >
                    Build segment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Powered by X data · Segment by interest, demographics & reach · Export to Ad Targeting
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
