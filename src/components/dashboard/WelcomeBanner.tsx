import { Sparkles } from "lucide-react";

export const WelcomeBanner = () => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-foreground mb-2">Good morning, John</h1>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4" />
        <span>
          Your brand spiked today in Finance conversations (+43%)  
          <a href="#" className="ml-1 font-semibold text-foreground underline hover:text-primary">
            Learn more &gt;&gt;
          </a>
        </span>
      </div>
    </div>
  );
};
