import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const insights = [
  { text: "Your brand spiked today in Finance conversations (+43%)", link: "Learn more >>" },
  { text: "Competitor mentions down 12% this week across social media", link: "View report >>" },
  { text: "New trending topic detected: ESG investing discussions", link: "Explore >>" },
  { text: "Media coverage reached 2.4M impressions yesterday", link: "See details >>" },
  { text: "Sentiment improved by 8% in European markets", link: "Analyze >>" },
];

export const WelcomeBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % insights.length);
        setIsAnimating(false);
      }, 300);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const currentInsight = insights[currentIndex];

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-foreground mb-2">Good morning, John</h1>
      <div className="h-6 overflow-hidden">
        <div
          className={`flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 ${
            isAnimating ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>
            {currentInsight.text}
            <a href="#" className="ml-1 font-semibold text-foreground underline hover:text-primary">
              {currentInsight.link}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};
