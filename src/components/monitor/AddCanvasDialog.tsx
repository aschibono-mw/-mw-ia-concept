import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface AddCanvasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCanvas: (name: string) => void;
}

export const AddCanvasDialog = ({
  open,
  onOpenChange,
  onAddCanvas,
}: AddCanvasDialogProps) => {
  const [canvasName, setCanvasName] = useState('');

  const handleSubmit = () => {
    if (canvasName.trim()) {
      onAddCanvas(canvasName.trim());
      setCanvasName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Canvas</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="canvas-name">Canvas Name</Label>
            <Input
              id="canvas-name"
              placeholder="e.g., Brand Monitoring, Crisis Watch"
              value={canvasName}
              onChange={(e) => setCanvasName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            A canvas is a workspace where you can add multiple streams to monitor different topics.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canvasName.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Create Canvas
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
