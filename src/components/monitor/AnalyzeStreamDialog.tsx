import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BarChart2, PieChart, TrendingUp, Users, Globe, MessageSquare, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Widget {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const availableWidgets: Widget[] = [
  {
    id: 'sentiment-trend',
    name: 'Sentiment Trend',
    description: 'Track sentiment changes over time',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: 'volume-chart',
    name: 'Volume Chart',
    description: 'Monitor mention volume patterns',
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    id: 'source-breakdown',
    name: 'Source Breakdown',
    description: 'See distribution across sources',
    icon: <PieChart className="w-5 h-5" />,
  },
  {
    id: 'top-influencers',
    name: 'Top Influencers',
    description: 'Identify key voices in the conversation',
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: 'geo-distribution',
    name: 'Geographic Distribution',
    description: 'View mentions by location',
    icon: <Globe className="w-5 h-5" />,
  },
  {
    id: 'key-phrases',
    name: 'Key Phrases',
    description: 'Extract trending topics and phrases',
    icon: <MessageSquare className="w-5 h-5" />,
  },
];

interface AnalyzeStreamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streamName: string;
  onAnalyze: (selectedWidgets: string[]) => void;
}

export const AnalyzeStreamDialog = ({
  open,
  onOpenChange,
  streamName,
  onAnalyze,
}: AnalyzeStreamDialogProps) => {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(['sentiment-trend', 'volume-chart']);

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleAnalyze = () => {
    onAnalyze(selectedWidgets);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Analyze Stream: {streamName}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select the widgets you'd like to use for analyzing this stream. The analysis will open in the Analyze page.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {availableWidgets.map((widget) => {
              const isSelected = selectedWidgets.includes(widget.id);
              return (
                <button
                  key={widget.id}
                  onClick={() => toggleWidget(widget.id)}
                  className={cn(
                    'relative flex flex-col items-start p-3 rounded-lg border text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className={cn(
                    'mb-2',
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  )}>
                    {widget.icon}
                  </div>
                  <div className="font-medium text-sm text-foreground">
                    {widget.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {widget.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAnalyze} disabled={selectedWidgets.length === 0}>
            <BarChart2 className="w-4 h-4 mr-2" />
            Open in Analyze ({selectedWidgets.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
