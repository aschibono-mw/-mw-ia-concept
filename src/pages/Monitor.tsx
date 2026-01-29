import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { MonitorStream } from '@/components/monitor/MonitorStream';
import { AddStreamDialog } from '@/components/monitor/AddStreamDialog';
import { AddCanvasDialog } from '@/components/monitor/AddCanvasDialog';
import { AnalyzeStreamDialog } from '@/components/monitor/AnalyzeStreamDialog';
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
  const [selectedStreamForAnalysis, setSelectedStreamForAnalysis] = useState<MonitorStreamType | null>(null);

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

  const handleOpenAnalyze = (selectedWidgets: string[]) => {
    // In a real app, this would pass the stream data and widgets to the Analyze page
    toast.success(`Opening analysis with ${selectedWidgets.length} widgets`);
    navigate('/analyze');
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="monitor" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">
                Monitor
              </h1>
              <p className="text-sm text-muted-foreground">
                Track real-time mentions across your explore searches in customizable streams.
              </p>
            </div>
            <Button onClick={() => setIsAddStreamOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Stream
            </Button>
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
          <div className="bg-muted/20 rounded-lg border border-border min-h-[calc(100vh-240px)]">
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
                  {/* Add Stream Button */}
                  <button
                    onClick={() => setIsAddStreamOpen(true)}
                    className="flex flex-col items-center justify-center min-w-[280px] h-[calc(100vh-280px)] border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  >
                    <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Add Stream
                    </span>
                  </button>
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
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Add streams to this canvas to monitor real-time mentions from your explore searches.
                </p>
                <Button onClick={() => setIsAddStreamOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Stream
                </Button>
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
        <AnalyzeStreamDialog
          open={isAnalyzeOpen}
          onOpenChange={setIsAnalyzeOpen}
          streamName={selectedStreamForAnalysis.name}
          onAnalyze={handleOpenAnalyze}
        />
      )}
    </div>
  );
};

export default Monitor;
