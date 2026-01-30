import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { MonitorStream } from '@/components/monitor/MonitorStream';
import { AddStreamDialog } from '@/components/monitor/AddStreamDialog';
import { AddCanvasDialog } from '@/components/monitor/AddCanvasDialog';
import { AddStreamHover } from '@/components/monitor/AddStreamHover';
import { AnalyzeStreamDialog } from '@/components/monitor/AnalyzeStreamDialog';
import { BenchmarkDashboardPanel } from '@/components/monitor/BenchmarkDashboardPanel';
import { MonitorCanvas, MonitorStream as MonitorStreamType, ExploreSearch } from '@/components/monitor/types';
import { initialCanvases, existingSearches, generateFeedItems } from '@/components/monitor/mockData';
import { Plus, MoreVertical, X, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Monitor = () => {
  const navigate = useNavigate();
  const [canvases, setCanvases] = useState<MonitorCanvas[]>(initialCanvases);
  const [activeCanvasId, setActiveCanvasId] = useState(canvases[0]?.id || '');
  const [isAddStreamOpen, setIsAddStreamOpen] = useState(false);
  const [isAddCanvasOpen, setIsAddCanvasOpen] = useState(false);
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);
  const [isDashboardPanelOpen, setIsDashboardPanelOpen] = useState(false);
  const [selectedStreamForAnalysis, setSelectedStreamForAnalysis] = useState<MonitorStreamType | null>(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>('Benchmark');

  const activeCanvas = canvases.find((c) => c.id === activeCanvasId);

  const handleAddCanvas = (name: string) => {
    const newCanvas: MonitorCanvas = {
      id: `canvas-${Date.now()}`,
      name,
      streams: [],
    };
    setCanvases((prev) => [...prev, newCanvas]);
    setActiveCanvasId(newCanvas.id);
    toast.success(`Canvas "${name}" created`);
  };

  const handleRemoveCanvas = (canvasId: string) => {
    const canvas = canvases.find((c) => c.id === canvasId);
    if (canvases.length <= 1) {
      toast.error("You must have at least one canvas");
      return;
    }
    setCanvases((prev) => prev.filter((c) => c.id !== canvasId));
    if (activeCanvasId === canvasId) {
      const remaining = canvases.filter((c) => c.id !== canvasId);
      setActiveCanvasId(remaining[0]?.id || '');
    }
    toast.success(`Canvas "${canvas?.name}" removed`);
  };

  const handleAddStream = (streamName: string, search: ExploreSearch) => {
    const newStream: MonitorStreamType = {
      id: `stream-${Date.now()}`,
      name: streamName,
      searchId: search.id,
      searchName: search.name,
      items: generateFeedItems(search.name),
    };

    setCanvases((prev) =>
      prev.map((canvas) =>
        canvas.id === activeCanvasId
          ? { ...canvas, streams: [...canvas.streams, newStream] }
          : canvas
      )
    );
    toast.success(`Stream "${streamName}" added`);
  };

  // Quick add from hover - uses search name as stream name
  const handleQuickAddStream = (search: ExploreSearch) => {
    handleAddStream(search.name, search);
  };

  const handleRemoveStream = (streamId: string) => {
    setCanvases((prev) =>
      prev.map((canvas) =>
        canvas.id === activeCanvasId
          ? { ...canvas, streams: canvas.streams.filter((s) => s.id !== streamId) }
          : canvas
      )
    );
    toast.success('Stream removed');
  };

  const handleAnalyzeStream = (streamId: string) => {
    const stream = activeCanvas?.streams.find((s) => s.id === streamId);
    if (stream) {
      setSelectedStreamForAnalysis(stream);
      setIsAnalyzeOpen(true);
    }
  };

  const handleOpenAnalyze = (selectedTemplates: string[]) => {
    // Close the template selection dialog and open the dashboard panel
    setIsAnalyzeOpen(false);
    // Use the first selected template name (capitalize it)
    const templateNames: Record<string, string> = {
      'audience': 'Audience',
      'benchmark': 'Benchmark',
      'brand': 'Brand',
      'campaign': 'Campaign',
      'coverage-report': 'Coverage Report',
      'crisis-management': 'Crisis Management',
      'earned-media': 'Earned Media',
    };
    setSelectedTemplateName(templateNames[selectedTemplates[0]] || 'Benchmark');
    setIsDashboardPanelOpen(true);
  };

  const handleCreateDashboard = () => {
    setIsDashboardPanelOpen(false);
    toast.success('Opening dashboard in Analyze for editing...');
    navigate('/analyze');
  };

  const handleSaveDashboard = () => {
    toast.success('Dashboard saved successfully');
    setIsDashboardPanelOpen(false);
    navigate('/analyze');
  };

  const handleDeleteDashboard = () => {
    toast.success('Dashboard discarded');
    setIsDashboardPanelOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="monitor" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Track real-time media mentions
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor your searches in customizable streams, or set up alerts to stay informed.
            </p>
          </div>

          {/* Canvas Tabs */}
          <div className="border-b border-border mb-6">
            <ScrollArea className="flex-1">
              <div className="flex items-center gap-6">
                {canvases.map((canvas) => (
                  <div
                    key={canvas.id}
                    className="group flex items-center"
                  >
                    <button
                      className={cn(
                        'py-3 text-sm font-medium border-b-2 transition-colors',
                        activeCanvasId === canvas.id
                          ? 'border-primary text-foreground'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      )}
                      onClick={() => setActiveCanvasId(canvas.id)}
                    >
                      {canvas.name}
                      <span className="ml-2 text-muted-foreground">
                        ({canvas.streams.length})
                      </span>
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="opacity-0 group-hover:opacity-100 p-1 ml-1 hover:bg-muted rounded"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 bg-card">
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive"
                          onClick={() => handleRemoveCanvas(canvas.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
                <button
                  onClick={() => setIsAddCanvasOpen(true)}
                  className="flex items-center gap-1 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Canvas
                </button>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Streams Container */}
          <div className="min-h-[calc(100vh-240px)]">
            {activeCanvas && activeCanvas.streams.length > 0 ? (
              <ScrollArea className="w-full">
                <div className="flex gap-4 p-4">
                  {activeCanvas.streams.map((stream) => (
                    <MonitorStream
                      key={stream.id}
                      stream={stream}
                      onAnalyze={handleAnalyzeStream}
                      onRemove={handleRemoveStream}
                    />
                  ))}
                  {/* Add Stream Hover Card */}
                  <AddStreamHover
                    existingSearches={existingSearches}
                    onSelectSearch={handleQuickAddStream}
                    onCreateNew={() => setIsAddStreamOpen(true)}
                  />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-280px)] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No streams yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Add streams to this canvas to monitor real-time mentions from your explore searches.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <AddStreamDialog
        open={isAddStreamOpen}
        onOpenChange={setIsAddStreamOpen}
        existingSearches={existingSearches}
        onAddStream={handleAddStream}
      />

      <AddCanvasDialog
        open={isAddCanvasOpen}
        onOpenChange={setIsAddCanvasOpen}
        onAddCanvas={handleAddCanvas}
      />

      {selectedStreamForAnalysis && (
        <>
          <AnalyzeStreamDialog
            open={isAnalyzeOpen}
            onOpenChange={setIsAnalyzeOpen}
            streamName={selectedStreamForAnalysis.name}
            onAnalyze={handleOpenAnalyze}
          />
          <BenchmarkDashboardPanel
            open={isDashboardPanelOpen}
            onOpenChange={setIsDashboardPanelOpen}
            streamName={selectedStreamForAnalysis.name}
            templateName={selectedTemplateName}
            onCreateDashboard={handleCreateDashboard}
            onSave={handleSaveDashboard}
            onDelete={handleDeleteDashboard}
          />
        </>
      )}
    </div>
  );
};

export default Monitor;
