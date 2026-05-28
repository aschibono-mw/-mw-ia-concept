import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { BarChart2, SlidersHorizontal, Compass, GitCompare } from "lucide-react";

const PURPLE = "#B627A1";

const SECTIONS = [
  {
    id: "searches",
    label: "Searches & Filters",
    Icon: SlidersHorizontal,
    title: "Searches & Filters",
    description: "Manage your saved searches, boolean logic, source filters, and language rules in one place.",
  },
  {
    id: "analytics",
    label: "Analytics",
    Icon: BarChart2,
    title: "Analytics",
    description: "Volume trends, sentiment breakdowns, share of voice, and reach metrics across all your searches.",
  },
  {
    id: "discover",
    label: "Discover",
    Icon: Compass,
    title: "Discover",
    description: "Explore emerging topics, unexpected sources, and AI-surfaced signals you haven't tracked yet.",
  },
  {
    id: "compare",
    label: "Compare",
    Icon: GitCompare,
    title: "Compare",
    description: "Side-by-side comparison of searches, competitors, or time periods to spot what's changed.",
  },
];

export default function SearchPlusHub() {
  const [activeSection, setActiveSection] = useState("searches");

  const active = SECTIONS.find(s => s.id === activeSection)!;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar activePage="search-plus" />

      <main className="ml-52 pt-16">
        <div className="px-8 pt-6">

          {/* Page header */}
          <div className="mb-0">
            <h1 className="text-2xl font-extrabold font-nunito text-foreground mb-1">
              Explore media coverage in one place
            </h1>
            <p className="text-sm text-muted-foreground">
              Build searches across news, social, and online sources.
            </p>
          </div>

          {/* Tab nav */}
          <div className="border-b border-border mt-5">
            <nav className="flex gap-1">
              {SECTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className="px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
                  style={{
                    borderBottomColor: activeSection === id ? PURPLE : "transparent",
                    color: activeSection === id ? "var(--foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Section content */}
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(182,39,161,0.08)" }}
            >
              <active.Icon className="w-6 h-6" style={{ color: PURPLE }} />
            </div>
            <h2 className="text-lg font-bold font-nunito text-foreground mb-2">{active.title}</h2>
            <p className="text-sm text-muted-foreground max-w-sm">{active.description}</p>
          </div>

        </div>
      </main>
    </div>
  );
}
