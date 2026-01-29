import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Trash2, Save, Info, MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ScatterChart, Scatter, ZAxis, Legend } from 'recharts';
import { cn } from '@/lib/utils';

// Mock data for charts
const mentionsOverTimeData = [
  { date: 'Jan 22', brand1: 50, brand2: 30 },
  { date: 'Jan 23', brand1: 80, brand2: 45 },
  { date: 'Jan 24', brand1: 120, brand2: 60 },
  { date: 'Jan 25', brand1: 90, brand2: 55 },
  { date: 'Jan 26', brand1: 140, brand2: 70 },
  { date: 'Jan 27', brand1: 160, brand2: 85 },
  { date: 'Jan 28', brand1: 130, brand2: 75 },
];

const shareOfVoiceData = [
  { name: 'Brand Search', value: 2900, percentage: 98.97 },
  { name: 'Negative Experience', value: 81, percentage: 2.11 },
];

const shareOfVoiceReachData = [
  { name: 'Brand Search', value: 4850, change: 36.1, percentage: 89.8 },
  { name: 'Negative Experience', value: 76400, change: -58.2, percentage: 1.04 },
];

const sourceTypeData = [
  { name: 'Reddit', value: 1680 },
  { name: 'News - Online', value: 1200 },
  { name: 'X', value: 752 },
  { name: 'YouTube', value: 401 },
  { name: 'Bluesky', value: 120 },
  { name: 'Pinterest', value: 80 },
  { name: 'Blogs', value: 50 },
  { name: 'Forums', value: 30 },
];

const bubbleData = [
  { x: 500000, y: 60000, z: 400, name: 'Brand Search' },
  { x: 1500000, y: 50000, z: 150, name: 'Negative Experience' },
];

interface BenchmarkDashboardPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streamName: string;
  templateName: string;
  onCreateDashboard: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export const BenchmarkDashboardPanel = ({
  open,
  onOpenChange,
  streamName,
  templateName,
  onCreateDashboard,
  onSave,
  onDelete,
}: BenchmarkDashboardPanelProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-border bg-background">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-lg font-semibold">{templateName} Dashboard</SheetTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Preview for: {streamName}
                </p>
              </div>
              <div className="flex items-center gap-2 pr-8">
                <Button variant="outline" size="sm" onClick={onDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button variant="outline" size="sm" onClick={onSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save dashboard
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
            <div className="space-y-4">
              {/* Brand Mentions Over Time */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-medium">Brand Mentions Over Time</CardTitle>
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Last 7 days | Mentions</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#00C9A7]" />
                      <span className="text-xs">Brand Search</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
                      <span className="text-xs">Negative Experiences</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mentionsOverTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip />
                        <Line type="monotone" dataKey="brand1" stroke="#00C9A7" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="brand2" stroke="#FFB800" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Relative Performance - Bubble Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-medium">Relative Performance of Brands</CardTitle>
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Last 7 days | Bubble size: Mentions</p>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" dataKey="x" name="Estimated Views" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis type="number" dataKey="y" name="Engagement" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <ZAxis type="number" dataKey="z" range={[100, 500]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter data={bubbleData} fill="#FFB800" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Share of Voice Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Share of Voice by Mentions */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-medium">Share of Voice by Mentions</CardTitle>
                        <Info className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Last 7 days | Mentions</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {shareOfVoiceData.map((item, idx) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2">
                              <span className="text-muted-foreground">{idx + 1}</span>
                              <span className="truncate max-w-[120px]">{item.name}</span>
                            </span>
                            <span className="font-medium">{item.value.toLocaleString()}</span>
                            <span className="text-muted-foreground">{item.percentage}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                idx === 0 ? "bg-[#FFB800]" : "bg-[#00C9A7]"
                              )}
                              style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Share of Voice by Reach */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-medium">Share of Voice by Reach</CardTitle>
                        <Info className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Last 7 days | Reach</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {shareOfVoiceReachData.map((item, idx) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2">
                              <span className="text-muted-foreground">{idx + 1}</span>
                              <span className="truncate max-w-[100px]">{item.name}</span>
                            </span>
                            <span className="font-medium">{item.value.toLocaleString()}</span>
                            <span className={cn(
                              "flex items-center gap-0.5",
                              item.change > 0 ? "text-green-500" : "text-red-500"
                            )}>
                              {item.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {Math.abs(item.change)}%
                            </span>
                            <span className="text-muted-foreground">{item.percentage}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                idx === 0 ? "bg-[#FFB800]" : "bg-[#00C9A7]"
                              )}
                              style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Brand Mentions by Source Type */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-medium">Brand Mentions by Source Type</CardTitle>
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Last 7 days | Mentions</p>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sourceTypeData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#FFB800" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* More widgets available prompt */}
              <Card className="border-dashed border-2 bg-muted/20">
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Additional widgets available: Sentiment Analysis, Top Countries, Engaging Media & more
                  </p>
                  <Button variant="outline" size="sm" onClick={onCreateDashboard}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Full Dashboard to Customize
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
