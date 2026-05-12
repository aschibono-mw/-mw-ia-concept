import { useState, useRef } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  ArrowUp,
  History,
  BookOpen,
  ChevronDown,
  FolderOpen,
  Briefcase,
  BarChart2,
  Newspaper,
  Globe,
  Radio,
  TrendingUp,
  Info,
  Calendar,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import meltwaterIcon from "@/assets/meltwater-icon.svg";

const agents = [
  {
    icon: Briefcase,
    title: "Media Brief Agent",
    description: "Prepare executives for media interviews with comprehensive briefings on journalists and topics",
  },
  {
    icon: BarChart2,
    title: "Release Impact Agent",
    description: "Track where your press releases appear across news and social media channels",
  },
  {
    icon: BarChart2,
    title: "Coverage Agent",
    description: "Get a comprehensive report on your media coverage, including reach, sentiment, and key themes",
  },
  {
    icon: Globe,
    title: "Industry Roundup Agent",
    description: "Generate a summary of the latest news and trends in your industry to stay informed and ahead of the curve",
  },
  {
    icon: Newspaper,
    title: "News Briefing Agent",
    description: "Create a concise briefing on the latest news about your brand for internal stakeholders",
  },
  {
    icon: TrendingUp,
    title: "Competitor Intel Agent",
    description: "Monitor and summarize competitor activity, coverage, and share of voice in your market",
  },
];

const favoritePrompts = [
  { title: "Summarize this week's brand coverage", category: "Analysis" },
  { title: "Who are the top journalists covering my industry?", category: "Outreach" },
  { title: "Detect any emerging reputation risks", category: "Monitoring" },
  { title: "Compare my sentiment to competitors", category: "Competitive" },
  { title: "Draft an executive media briefing", category: "Reporting" },
  { title: "What topics are trending in my sector?", category: "Intelligence" },
];

const MiraStudio = () => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="mira" />
      <Header />

      <main className="ml-52 pt-16 flex flex-col h-[calc(100vh-64px)] bg-background">
        {/* Sub-header toolbar */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                <FolderOpen className="w-4 h-4" />
                Connect Project
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-card">
              <DropdownMenuItem className="cursor-pointer">Brand Monitoring</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Competitor Intel</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Crisis Watch</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen className="w-4 h-4" />
              Prompts
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <History className="w-4 h-4" />
              View History
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 pt-12 pb-10">

            {/* Logo + greeting */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-primary flex items-center justify-center mb-5 shadow-lg">
                <img src={meltwaterIcon} alt="Mira" className="w-9 h-9 brightness-0 invert" />
              </div>
              <h1 className="text-2xl font-bold text-foreground text-center">
                Hello Antonio, I'm Mira. How can I help you today?
              </h1>
            </div>

            {/* Input */}
            <div className="rounded-xl border-2 border-primary/40 bg-card shadow-sm focus-within:border-primary transition-colors mb-6">
              <div className="px-4 pt-4 pb-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  placeholder="Ask me about your media coverage, insights, trends, and more!"
                  rows={2}
                  className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed"
                  style={{ maxHeight: "160px", overflow: "auto" }}
                />
              </div>
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors">
                    <BarChart2 className="w-3.5 h-3.5" />
                    Searches
                  </button>
                  <button className="p-1.5 rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">
                    <Calendar className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mira Projects promo banner */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5 px-5 py-4 flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary">Introducing Mira Projects</p>
                <p className="text-xs text-muted-foreground mt-0.5">Tell us more about who you are and leverage your existing searches and filters to improve results</p>
              </div>
              <Button size="sm" variant="outline" className="shrink-0 border-primary/30 text-primary hover:bg-primary/10">
                Try Now
              </Button>
            </div>

            {/* Agents / Favorite Prompts tabs */}
            <Tabs defaultValue="agents">
              <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none p-0 h-auto mb-5">
                <TabsTrigger
                  value="agents"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground pb-2 px-1 mr-6 text-sm font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    Agents
                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="prompts"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground pb-2 px-1 text-sm font-medium"
                >
                  Favorite Prompts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="agents" className="mt-0">
                <div className="grid grid-cols-2 gap-3">
                  {agents.map((agent) => {
                    const Icon = agent.icon;
                    return (
                      <button
                        key={agent.title}
                        className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-muted/40 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
                            <Icon className="w-4.5 h-4.5 text-primary/70" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground mb-1">{agent.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="prompts" className="mt-0">
                <div className="grid grid-cols-2 gap-3">
                  {favoritePrompts.map((prompt) => (
                    <button
                      key={prompt.title}
                      className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-muted/40 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <Star className="w-4 h-4 text-primary/60 shrink-0 mt-0.5 fill-primary/20" />
                        <div>
                          <p className="text-sm font-medium text-foreground leading-snug">{prompt.title}</p>
                          <span className="text-[10px] font-semibold text-muted-foreground mt-1 inline-block">{prompt.category}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </main>
    </div>
  );
};

export default MiraStudio;
