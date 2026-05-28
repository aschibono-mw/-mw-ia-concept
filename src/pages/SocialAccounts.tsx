import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  CheckCircle2, Plus, Trash2, RefreshCw,
  AlertCircle, HelpCircle, Link2,
} from "lucide-react";

const TEAL       = "#00827F";
const TEAL_LIGHT = "rgba(0,130,127,0.08)";

// ── Platform definitions ──────────────────────────────────────────────────────
interface ConnectedAccount {
  name: string;
  searches: number;
  lastSync: string;
}

interface Platform {
  id: string;
  name: string;
  color: string;
  bg: string;
  description: string;
  features: string[];
  helpText: string;
  connected: ConnectedAccount[];
}

const PLATFORMS: Platform[] = [
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    bg: "rgba(24,119,242,0.08)",
    description: "Monitor pages, groups, and public posts. Add monitored pages and competitors after authenticating.",
    features: ["Pages", "Groups", "Public posts", "Competitor pages"],
    helpText: "Need help setting up?",
    connected: [],
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "#E1306C",
    bg: "rgba(225,48,108,0.08)",
    description: "Track branded content, hashtags, and mentions. Add monitored pages after authenticating.",
    features: ["Posts", "Stories", "Reels", "Hashtags"],
    helpText: "Need help setting up?",
    connected: [],
  },
  {
    id: "x",
    name: "X (Twitter)",
    color: "#000000",
    bg: "rgba(0,0,0,0.06)",
    description: "Real-time brand mentions, hashtag tracking, and trending conversations.",
    features: ["Mentions", "Hashtags", "Trends", "Lists"],
    helpText: "Need help setting up?",
    connected: [],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    color: "#0A66C2",
    bg: "rgba(10,102,194,0.08)",
    description: "Track company pages, organic posts, and professional content.",
    features: ["Company Pages", "Posts", "Articles", "Employee content"],
    helpText: "Need help setting up?",
    connected: [],
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    bg: "rgba(255,0,0,0.08)",
    description: "Monitor video mentions, comments, and channels relevant to your brand.",
    features: ["Videos", "Comments", "Channels", "Shorts"],
    helpText: "Need help setting up?",
    connected: [
      { name: "Tony Schibono's Buddy Account", searches: 1, lastSync: "2 hours ago" },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#010101",
    bg: "rgba(1,1,1,0.06)",
    description: "Discover trending brand content, sounds, and creator mentions.",
    features: ["Videos", "Sounds", "Hashtags", "Creators"],
    helpText: "Need help setting up?",
    connected: [],
  },
  {
    id: "threads",
    name: "Threads",
    color: "#101010",
    bg: "rgba(16,16,16,0.06)",
    description: "Monitor text-based conversations, replies, and brand mentions.",
    features: ["Posts", "Replies", "Mentions"],
    helpText: "Need help setting up?",
    connected: [],
  },
  {
    id: "reddit",
    name: "Reddit",
    color: "#FF4500",
    bg: "rgba(255,69,0,0.08)",
    description: "Track subreddit discussions, community sentiment, and brand mentions.",
    features: ["Subreddits", "Posts", "Comments", "Sentiment"],
    helpText: "Need help setting up?",
    connected: [],
  },
];

// ── Platform logo SVGs ────────────────────────────────────────────────────────
function PlatformLogo({ id, size = 20 }: { id: string; size?: number }) {
  const s = size;
  if (id === "facebook") return <svg width={s} height={s} viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  if (id === "instagram") return <svg width={s} height={s} viewBox="0 0 24 24"><defs><linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FED373"/><stop offset="25%" stopColor="#F15245"/><stop offset="50%" stopColor="#D92E7F"/><stop offset="75%" stopColor="#9B36B7"/><stop offset="100%" stopColor="#515ECF"/></linearGradient></defs><path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
  if (id === "x") return <svg width={s} height={s} viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  if (id === "linkedin") return <svg width={s} height={s} viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
  if (id === "youtube") return <svg width={s} height={s} viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
  if (id === "tiktok") return <svg width={s} height={s} viewBox="0 0 24 24" fill="#010101"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/></svg>;
  if (id === "threads") return <svg width={s} height={s} viewBox="0 0 24 24" fill="#101010"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 1.332-.009 2.497-.175 3.465-.498.924-.309 1.748-.801 2.444-1.467.816-.775 1.492-1.863 2.009-3.24.453-1.21.706-2.62.753-4.202h-9.29v-2.042h11.44c.052.47.079.965.079 1.487 0 2.055-.275 3.91-.82 5.52-.569 1.68-1.415 3.106-2.517 4.242-1.27 1.297-2.822 2.25-4.613 2.836-1.294.42-2.75.635-4.33.644z"/></svg>;
  if (id === "reddit") return <svg width={s} height={s} viewBox="0 0 24 24" fill="#FF4500"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>;
  return null;
}

// ── Platform card ─────────────────────────────────────────────────────────────
function PlatformCard({ platform }: { platform: Platform }) {
  const isConnected = platform.connected.length > 0;
  const labelColor  = ["#000000", "#010101", "#101010"].includes(platform.color) ? "#444" : platform.color;

  return (
    <div
      className="bg-white rounded-xl flex flex-col overflow-hidden transition-shadow hover:shadow-md"
      style={{
        border: isConnected ? `1.5px solid ${platform.color}28` : "1px solid var(--border)",
        boxShadow: isConnected ? `0 2px 12px ${platform.color}10` : undefined,
      }}
    >
      {/* Card header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: platform.bg }}
            >
              <PlatformLogo id={platform.id} size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-bold text-foreground">{platform.name}</h3>
                {isConnected && (
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: TEAL_LIGHT, color: TEAL }}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {platform.connected.length} connected
                  </span>
                )}
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{platform.description}</p>
            </div>
          </div>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {platform.features.map((f) => (
            <span
              key={f}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${platform.color}10`, color: labelColor }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-1.5 text-[12px] font-semibold rounded-lg px-3 py-1.5 transition-colors"
            style={{ backgroundColor: TEAL, color: "#ffffff" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add account
          </button>
          <a
            href="#"
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            {platform.helpText}
          </a>
        </div>
      </div>

      {/* Connected accounts */}
      {isConnected && (
        <div className="border-t border-border px-4 pb-3 pt-3 flex flex-col gap-2">
          {platform.connected.map((acc) => (
            <div
              key={acc.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{ backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ backgroundColor: platform.color + "22", color: platform.color }}
              >
                {acc.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">{acc.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {acc.searches} search{acc.searches !== 1 ? "es" : ""} · synced {acc.lastSync}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors" title="Re-authenticate">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Disconnect">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isConnected && (
        <div
          className="mx-4 mb-4 px-4 py-3 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: "rgba(0,0,0,0.02)", border: "1px dashed rgba(0,0,0,0.10)" }}
        >
          <Link2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <p className="text-[12px] text-muted-foreground">No accounts connected yet</p>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SocialAccounts() {
  const [filter, setFilter] = useState<"all" | "connected" | "disconnected">("all");

  const connectedCount = PLATFORMS.filter(p => p.connected.length > 0).length;
  const totalAccounts  = PLATFORMS.reduce((sum, p) => sum + p.connected.length, 0);

  const filtered = PLATFORMS.filter(p => {
    if (filter === "connected")    return p.connected.length > 0;
    if (filter === "disconnected") return p.connected.length === 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="social-accounts" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="px-8 pt-6 pb-10">

          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold font-nunito text-foreground mb-1">
                Connect your social accounts
              </h1>
              <p className="text-sm text-muted-foreground">
                Authenticate your accounts to monitor, track, and analyse content across platforms.
              </p>
            </div>

            {/* Stats */}
            {totalAccounts > 0 && (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full mt-1 flex-shrink-0"
                style={{ backgroundColor: TEAL_LIGHT, border: `1px solid ${TEAL}25` }}
              >
                <CheckCircle2 className="w-4 h-4" style={{ color: TEAL }} />
                <span className="text-sm font-semibold" style={{ color: TEAL }}>
                  {connectedCount} platform{connectedCount !== 1 ? "s" : ""} · {totalAccounts} account{totalAccounts !== 1 ? "s" : ""} connected
                </span>
              </div>
            )}
          </div>

          {/* Tab nav */}
          <div className="border-b border-border mt-5 mb-6">
            <nav className="flex gap-1">
              {(["all", "connected", "disconnected"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px capitalize whitespace-nowrap"
                  style={{
                    borderBottomColor: filter === f ? TEAL : "transparent",
                    color: filter === f ? "var(--foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {f}
                </button>
              ))}
            </nav>
          </div>

          {/* Platform grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
              {filtered.map(platform => (
                <PlatformCard key={platform.id} platform={platform} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-10 h-10 text-muted-foreground/25 mb-3" />
              <p className="text-sm font-medium text-foreground">No platforms found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
