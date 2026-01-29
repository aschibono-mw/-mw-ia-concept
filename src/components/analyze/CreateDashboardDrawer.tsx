import { useState } from "react";
import { X, LayoutGrid, Sparkles, Music2, Users, Zap, TrendingUp, Crown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface CreateDashboardDrawerProps {
  open: boolean;
  onClose: () => void;
}

const templateCategories = [
  {
    id: "pr-comms",
    label: "PR & Comms",
    templates: [
      { icon: LayoutGrid, title: "Custom", description: "Start from scratch with an empty dashboard." },
      { icon: LayoutGrid, title: "Audience", description: "Gain insights into your audience by exploring demographics, trending topics, and key phrases." },
      { icon: LayoutGrid, title: "Benchmark", description: "Compare brands, topics, or competitors to understand their share of voice across mentions." },
      { icon: LayoutGrid, title: "Brand", description: "Understand and report on brand awareness using metrics such as mentions, reach, and sentiment." },
      { icon: LayoutGrid, title: "Campaign", description: "Analyze and report on mentions from your campaign across various media types." },
      { icon: LayoutGrid, title: "Coverage Report", description: "Highlight your coverage from a campaign in an easy-to-create and beautiful report." },
      { icon: LayoutGrid, title: "Crisis Management", description: "Monitor and detect emerging risks by tracking sentiment and influential sources." },
      { icon: LayoutGrid, title: "Earned Media", description: "Measure and understand drivers of earned media metrics using an interactive dashboard." },
    ]
  },
  {
    id: "social",
    label: "Social",
    templates: [
      { icon: LayoutGrid, title: "Facebook Overview", description: "Analyze your Facebook Page activity to measure your impact." },
      { icon: LayoutGrid, title: "Instagram Overview", description: "Track your performance, audience growth, views, and engagement." },
      { icon: LayoutGrid, title: "LinkedIn Overview", description: "Look at your LinkedIn Page data to understand your company's presence." },
      { icon: LayoutGrid, title: "TikTok Overview", description: "Analyze your profile performance to see your impact on TikTok." },
      { icon: LayoutGrid, title: "X Overview", description: "Monitor your X presence and track engagement, reach, and audience growth." },
      { icon: LayoutGrid, title: "YouTube Overview", description: "Track your YouTube channel performance, views, and subscriber engagement." },
    ]
  },
];

const intelligenceProducts = [
  { 
    icon: Sparkles, 
    title: "GenAI Lens", 
    description: "See how your brand is represented across ChatGPT, Claude, Gemini and other AI models.",
    featured: true,
    tag: "New"
  },
  { 
    icon: Music2, 
    title: "TikTok Trends", 
    description: "Discover trending topics and signals shaping conversations on TikTok.",
    featured: false,
    tag: "Popular"
  },
  { 
    icon: Users, 
    title: "Audience Segments", 
    description: "Analyze your audience across demographics, trends, and language.",
    featured: false,
    tag: null
  },
  { 
    icon: Zap, 
    title: "Predictive Trends", 
    description: "Forecast emerging topics before they become mainstream.",
    featured: false,
    tag: null
  },
  { 
    icon: TrendingUp, 
    title: "Competitor Intel", 
    description: "AI-driven competitive intelligence and benchmarking.",
    featured: false,
    tag: null
  },
  { 
    icon: Music2, 
    title: "Podcast Monitor", 
    description: "Track brand mentions across podcast content and audio media.",
    featured: false,
    tag: null
  },
];

export const CreateDashboardDrawer = ({ open, onClose }: CreateDashboardDrawerProps) => {
  const [activeTab, setActiveTab] = useState("templates");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Drawer Content */}
      <div className="fixed right-0 top-0 bottom-0 w-[80%] bg-muted/30 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border bg-white">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Create a Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose a template or explore intelligence add-ons</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors -mt-1 -mr-1"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="px-6 pt-4 bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-auto p-0 bg-transparent border-b border-border rounded-none w-full justify-start gap-6">
              <TabsTrigger 
                value="templates" 
                className="px-0 py-0 pb-2.5 mb-[-1px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium"
              >
                Dashboard Templates
              </TabsTrigger>
              <TabsTrigger 
                value="intelligence" 
                className="px-0 py-0 pb-2.5 mb-[-1px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium flex items-center gap-2"
              >
                Intelligence Add-ons
                <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">PRO</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Templates Tab */}
            <TabsContent value="templates" className="mt-6 space-y-8 pb-6">
              {templateCategories.map((category) => (
                <div key={category.id}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    {category.label}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {category.templates.map((template, index) => (
                      <div 
                        key={index} 
                        className="group border border-border rounded-xl p-5 hover:border-primary hover:shadow-md cursor-pointer transition-all bg-white"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <template.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <span className="font-semibold text-foreground">{template.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{template.description}</p>
                        <Button variant="link" className="p-0 h-auto text-foreground hover:text-primary font-medium">
                          Create →
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Intelligence Tab */}
            <TabsContent value="intelligence" className="mt-6 space-y-6 pb-6">
              {/* Featured Hero - GenAI Lens */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-white border-2 border-primary/30 p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-start justify-between gap-8">
                  <div className="flex-1 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-foreground">GenAI Lens</h3>
                          <span className="text-xs font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">New</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Featured Intelligence Product</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Understand how your brand appears in AI-generated responses across ChatGPT, Claude, Gemini, and Perplexity. 
                      Track your AI visibility, compare against competitors, and optimize for the new era of AI-powered search.
                    </p>
                    <div className="flex items-center gap-4">
                      <Button className="gap-2">
                        <Crown className="w-4 h-4" />
                        Upgrade to Access
                      </Button>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>
                  <div className="w-72 h-44 rounded-xl bg-gradient-to-br from-muted to-muted/50 border border-border flex items-center justify-center flex-shrink-0">
                    <div className="text-center">
                      <Sparkles className="w-10 h-10 mx-auto mb-2 text-primary/40" />
                      <span className="text-xs text-muted-foreground">Interactive Preview</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Intelligence Products */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  More Intelligence Products
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {intelligenceProducts.filter(p => !p.featured).map((product, index) => (
                    <div 
                      key={index} 
                      className="group border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md cursor-pointer transition-all bg-white relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors" />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <product.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">{product.title}</span>
                              {product.tag && (
                                <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                  {product.tag}
                                </span>
                              )}
                            </div>
                          </div>
                          <Crown className="w-4 h-4 text-primary/60" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                        <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 font-medium">
                          Upgrade to Access →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  );
};
