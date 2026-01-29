import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Users, GitCompare, Award, Megaphone, FileText, AlertTriangle, TrendingUp, Check, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const availableTemplates: Template[] = [
  {
    id: 'audience',
    name: 'Audience',
    description: 'Gain insights into your audience by exploring demographics...',
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: 'benchmark',
    name: 'Benchmark',
    description: 'Compare brands, topics, or competitors to understand thei...',
    icon: <GitCompare className="w-5 h-5" />,
  },
  {
    id: 'brand',
    name: 'Brand',
    description: 'Understand and report on brand awareness using metrics such...',
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: 'campaign',
    name: 'Campaign',
    description: 'Analyze and report on mentions from your campaign across...',
    icon: <Megaphone className="w-5 h-5" />,
  },
  {
    id: 'coverage-report',
    name: 'Coverage Report',
    description: 'Highlight your coverage from a campaign in an easy-to-create...',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: 'crisis-management',
    name: 'Crisis Management',
    description: 'Monitor and detect emerging risks by tracking sentiment an...',
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  {
    id: 'earned-media',
    name: 'Earned Media',
    description: 'Measure and understand drivers of earned media metrics using...',
    icon: <TrendingUp className="w-5 h-5" />,
  },
];

interface AnalyzeStreamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streamName: string;
  onAnalyze: (selectedTemplates: string[]) => void;
}

export const AnalyzeStreamDialog = ({
  open,
  onOpenChange,
  streamName,
  onAnalyze,
}: AnalyzeStreamDialogProps) => {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const toggleTemplate = (templateId: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleAnalyze = () => {
    onAnalyze(selectedTemplates);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Analyze Stream: {streamName}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select the dashboard templates you'd like to use for analyzing this stream. The analysis will open in the Analyze page.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {availableTemplates.map((template) => {
              const isSelected = selectedTemplates.includes(template.id);
              return (
                <button
                  key={template.id}
                  onClick={() => toggleTemplate(template.id)}
                  className={cn(
                    'relative flex flex-col items-start p-4 rounded-lg border text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                    isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-foreground'
                  )}>
                    {template.icon}
                  </div>
                  <div className="font-semibold text-sm text-foreground">
                    {template.name}
                  </div>
                  <div className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">
                    {template.description}
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
          <Button onClick={handleAnalyze} disabled={selectedTemplates.length === 0}>
            <BarChart2 className="w-4 h-4 mr-2" />
            Analyze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
