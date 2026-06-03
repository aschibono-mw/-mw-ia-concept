import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MessageSquare, Send, Image, BarChart2, Megaphone } from "lucide-react";

const TEAL = "#00827F";

const SECTIONS = [
  {
    id: "conversations",
    label: "Conversations",
    Icon: MessageSquare,
    title: "Conversations",
    description: "Monitor and join conversations happening around your brand across social and news channels.",
  },
  {
    id: "publish",
    label: "Publish",
    Icon: Send,
    title: "Publish",
    description: "Schedule and publish content across your social channels from one place.",
  },
  {
    id: "asset-library",
    label: "Asset Library",
    Icon: Image,
    title: "Asset Library",
    description: "Manage your brand assets, images, and creative files for use across campaigns.",
  },
  {
    id: "measure",
    label: "Measure",
    Icon: BarChart2,
    title: "Measure",
    description: "Track the performance of your published content and social engagement over time.",
  },
  {
    id: "advertise",
    label: "Advertise",
    Icon: Megaphone,
    title: "Advertise",
    description: "Amplify your top-performing content and reach new audiences with paid promotion.",
    beta: false,
  },
];

const ExecuteLanding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("tab") || "conversations";
  const setActiveSection = (id: string) => setSearchParams({ tab: id });
  const active = SECTIONS.find(s => s.id === activeSection) ?? SECTIONS[0];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="engage" />
      <Header />

      <main className="ml-52 pt-16 bg-white" style={{ minHeight: "100vh" }}>
        <div className="px-8 pt-8 pb-10" style={{ minHeight: "calc(100vh - 64px)" }}>
          <div className="rounded-[28px] px-8 pt-6 pb-8" style={{ backgroundColor: "#F2F5F5", minHeight: "calc(100vh - 64px - 72px)" }}>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold font-nunito text-foreground mb-1">Engage influencers and grow your social presence</h1>
            <p className="text-sm text-muted-foreground">Discover, connect, and collaborate with influencers — then publish, measure, and amplify across your social channels.</p>
          </div>

          {/* Tab bar */}
          <div className="border-b border-border">
            <nav className="flex gap-1">
              {SECTIONS.map(({ id, label, beta }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
                  style={{
                    borderBottomColor: activeSection === id ? TEAL : "transparent",
                    color: activeSection === id ? "var(--foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {label}
                  {beta && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border"
                      style={{ color: "#B627A1", borderColor: "#B627A1" }}>
                      Beta
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Section content */}
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "rgba(0,130,127,0.1)" }}
            >
              <active.Icon className="w-6 h-6" style={{ color: TEAL }} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{active.title}</h2>
            <p className="text-sm text-muted-foreground max-w-sm">{active.description}</p>
          </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ExecuteLanding;
