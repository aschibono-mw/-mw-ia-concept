import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle2, Circle } from "lucide-react";

const integrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Send alerts, digests, and real-time mentions directly to Slack channels.",
    logo: "S",
    logoColor: "bg-[#4A154B] text-white",
    category: "Collaboration",
    connected: true,
    connectedAs: "#brand-alerts",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Sync media contacts and coverage data with your Salesforce CRM.",
    logo: "SF",
    logoColor: "bg-[#00A1E0] text-white",
    category: "CRM",
    connected: false,
    connectedAs: null,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Link media coverage and influencer data to HubSpot contacts and campaigns.",
    logo: "H",
    logoColor: "bg-[#FF7A59] text-white",
    category: "CRM",
    connected: true,
    connectedAs: "marketing@meltwater.com",
  },
  {
    id: "ms-teams",
    name: "Microsoft Teams",
    description: "Receive Meltwater notifications and share reports in Teams channels.",
    logo: "T",
    logoColor: "bg-[#464EB8] text-white",
    category: "Collaboration",
    connected: false,
    connectedAs: null,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate workflows between Meltwater and 5,000+ apps via Zapier.",
    logo: "Z",
    logoColor: "bg-[#FF4A00] text-white",
    category: "Automation",
    connected: false,
    connectedAs: null,
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Correlate media coverage with website traffic data from GA4.",
    logo: "GA",
    logoColor: "bg-[#E37400] text-white",
    category: "Analytics",
    connected: true,
    connectedAs: "UA-384920-1",
  },
  {
    id: "tableau",
    name: "Tableau",
    description: "Export Meltwater data to Tableau for advanced BI visualisations.",
    logo: "T",
    logoColor: "bg-[#E97627] text-white",
    category: "Analytics",
    connected: false,
    connectedAs: null,
  },
  {
    id: "adobe",
    name: "Adobe Experience Cloud",
    description: "Connect media and social data into your Adobe marketing stack.",
    logo: "AE",
    logoColor: "bg-[#FF0000] text-white",
    category: "Marketing",
    connected: false,
    connectedAs: null,
  },
];

const CATEGORIES = ["All", "Collaboration", "CRM", "Automation", "Analytics", "Marketing"];

export const ThirdPartyTab = () => {
  const [connections, setConnections] = useState<Record<string, boolean>>(
    Object.fromEntries(integrations.map((i) => [i.id, i.connected]))
  );
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = integrations.filter(
    (i) => activeCategory === "All" || i.category === activeCategory
  );

  const toggle = (id: string) =>
    setConnections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h2 className="text-base font-semibold text-foreground mb-1">Third party integrations</h2>
        <p className="text-sm text-muted-foreground">
          Connect Meltwater with your existing tools to streamline workflows and share insights across your stack.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integration grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((integration) => {
          const isConnected = connections[integration.id];
          return (
            <div key={integration.id} className="bg-card rounded-lg border border-border p-5 flex gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${integration.logoColor}`}>
                {integration.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{integration.name}</span>
                    <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                      {integration.category}
                    </span>
                  </div>
                  {isConnected ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{integration.description}</p>
                {isConnected && integration.connectedAs && (
                  <p className="text-xs text-green-600 mb-3">Connected as: {integration.connectedAs}</p>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isConnected ? "outline" : "default"}
                    className="h-7 text-xs px-3"
                    onClick={() => toggle(integration.id)}
                  >
                    {isConnected ? "Disconnect" : "Connect"}
                  </Button>
                  <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    Learn more <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
