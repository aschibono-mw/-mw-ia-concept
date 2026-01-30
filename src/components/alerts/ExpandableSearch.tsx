import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inactivityTimeout?: number;
}

export const ExpandableSearch = ({
  value,
  onChange,
  placeholder = "Search...",
  inactivityTimeout = 5000,
}: ExpandableSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isExpanded) {
      timeoutRef.current = setTimeout(() => {
        if (!value) {
          setIsExpanded(false);
        }
      }, inactivityTimeout);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
      resetTimer();
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isExpanded]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!value) {
          setIsExpanded(false);
        }
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, value]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    onChange("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    resetTimer();
  };

  const handleKeyDown = () => {
    resetTimer();
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      <div
        className={cn(
          "flex items-center overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "w-64" : "w-10"
        )}
      >
        {isExpanded ? (
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              className="pl-9 pr-9 w-full"
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onMouseMove={resetTimer}
            />
            <button
              onClick={handleClose}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="icon"
            onClick={handleExpand}
            className="flex-shrink-0"
          >
            <Search className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
