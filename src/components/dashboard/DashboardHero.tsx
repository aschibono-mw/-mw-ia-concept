import { TrendingUp, TrendingDown, Users, Globe, MessageSquare, Eye, ArrowUpRight, Sparkles } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

// Mock data for charts
const mentionsData = [
  { day: "Mon", value: 420 },
  { day: "Tue", value: 380 },
  { day: "Wed", value: 510 },
  { day: "Thu", value: 890 },
  { day: "Fri", value: 1240 },
  { day: "Sat", value: 980 },
  { day: "Sun", value: 1120 },
];

const sentimentData = [
  { name: "Positive", value: 62, color: "hsl(var(--primary))" },
  { name: "Neutral", value: 28, color: "hsl(var(--muted))" },
  { name: "Negative", value: 10, color: "hsl(var(--destructive))" },
];

const regionData = [
  { region: "US", value: 45 },
  { region: "EU", value: 28 },
  { region: "APAC", value: 18 },
  { region: "LATAM", value: 9 },
];

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, change, isPositive, icon }: MetricCardProps) => (
  <div className="bg-card rounded-lg border border-border p-4 flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className="text-muted-foreground">{icon}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-semibold text-card-foreground">{value}</span>
      <span className={`text-xs font-medium flex items-center gap-0.5 ${isPositive ? 'text-primary' : 'text-destructive'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </span>
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const ChartCard = ({ title, subtitle, children, action }: ChartCardProps) => (
  <div className="bg-card rounded-lg border border-border p-4 flex flex-col">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="font-semibold text-card-foreground text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

export const DashboardHero = () => {
  return (
    <div className="mb-6 space-y-4">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Total Mentions"
          value="5.4K"
          change="+43%"
          isPositive={true}
          icon={<MessageSquare className="w-4 h-4" />}
        />
        <MetricCard
          title="Reach"
          value="2.4M"
          change="+18%"
          isPositive={true}
          icon={<Eye className="w-4 h-4" />}
        />
        <MetricCard
          title="Share of Voice"
          value="34%"
          change="+5%"
          isPositive={true}
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          title="Sentiment Score"
          value="72"
          change="-3%"
          isPositive={false}
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Mentions Trend Chart */}
        <ChartCard 
          title="Mentions Trend" 
          subtitle="Last 7 days"
          action={
            <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              View details <ArrowUpRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mentionsData}>
                <defs>
                  <linearGradient id="mentionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#mentionsGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Sentiment Breakdown */}
        <ChartCard 
          title="Sentiment Breakdown" 
          subtitle="Current period"
        >
          <div className="flex items-center gap-4">
            <div className="h-28 w-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex-1">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-card-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Coverage by Region */}
        <ChartCard 
          title="Coverage by Region" 
          subtitle="Share of mentions"
          action={
            <Globe className="w-4 h-4 text-muted-foreground" />
          }
        >
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <XAxis 
                  type="number" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  domain={[0, 50]}
                />
                <YAxis 
                  type="category" 
                  dataKey="region" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-card-foreground">
            <span className="font-medium">AI Insight:</span> Your brand saw a significant spike in Finance conversations today (+43%), 
            driven primarily by earnings discussion on social media. 
            <a href="#" className="ml-1 underline hover:no-underline text-foreground font-medium">
              Explore the coverage →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};