// Greyscale template illustrations for dashboard cards

interface IllustrationProps {
  className?: string;
}

// Custom - Line chart illustration
export const CustomIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Grid lines */}
    <line x1="30" y1="20" x2="30" y2="100" stroke="#e0e0e0" strokeWidth="1" />
    <line x1="30" y1="100" x2="180" y2="100" stroke="#e0e0e0" strokeWidth="1" />
    <line x1="30" y1="60" x2="180" y2="60" stroke="#e8e8e8" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="30" y1="40" x2="180" y2="40" stroke="#e8e8e8" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="30" y1="80" x2="180" y2="80" stroke="#e8e8e8" strokeWidth="1" strokeDasharray="4 4" />
    {/* Line chart */}
    <polyline
      points="30,85 60,70 90,75 120,45 150,55 180,35"
      stroke="#9ca3af"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Data points */}
    <circle cx="30" cy="85" r="4" fill="#6b7280" />
    <circle cx="60" cy="70" r="4" fill="#6b7280" />
    <circle cx="90" cy="75" r="4" fill="#6b7280" />
    <circle cx="120" cy="45" r="4" fill="#6b7280" />
    <circle cx="150" cy="55" r="4" fill="#6b7280" />
    <circle cx="180" cy="35" r="4" fill="#6b7280" />
  </svg>
);

// Audience - Score with bar chart
export const AudienceIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Large score number */}
    <text x="100" y="55" textAnchor="middle" fill="#374151" fontSize="32" fontWeight="bold" fontFamily="system-ui">52.4</text>
    {/* Progress bar */}
    <rect x="40" y="70" width="120" height="8" rx="4" fill="#e5e7eb" />
    <rect x="40" y="70" width="75" height="8" rx="4" fill="#9ca3af" />
    {/* Small bars underneath */}
    <rect x="40" y="90" width="25" height="12" rx="2" fill="#d1d5db" />
    <rect x="70" y="90" width="35" height="12" rx="2" fill="#9ca3af" />
    <rect x="110" y="90" width="20" height="12" rx="2" fill="#d1d5db" />
    <rect x="135" y="90" width="25" height="12" rx="2" fill="#6b7280" />
  </svg>
);

// Benchmark - Pie chart with bars
export const BenchmarkIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Pie chart */}
    <circle cx="70" cy="60" r="40" fill="#e5e7eb" />
    <path d="M70 60 L70 20 A40 40 0 0 1 102.28 80 Z" fill="#9ca3af" />
    <path d="M70 60 L102.28 80 A40 40 0 0 1 37.72 80 Z" fill="#6b7280" />
    <circle cx="70" cy="60" r="18" fill="#f5f5f5" />
    {/* Side bars */}
    <rect x="130" y="30" width="50" height="10" rx="2" fill="#9ca3af" />
    <rect x="130" y="50" width="35" height="10" rx="2" fill="#d1d5db" />
    <rect x="130" y="70" width="45" height="10" rx="2" fill="#6b7280" />
    <rect x="130" y="90" width="25" height="10" rx="2" fill="#e5e7eb" />
  </svg>
);

// Brand - Bar chart with score
export const BrandIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Score in corner */}
    <text x="165" y="35" textAnchor="middle" fill="#374151" fontSize="22" fontWeight="bold" fontFamily="system-ui">52.4</text>
    {/* Horizontal bars */}
    <rect x="20" y="50" width="90" height="14" rx="2" fill="#9ca3af" />
    <rect x="20" y="70" width="70" height="14" rx="2" fill="#d1d5db" />
    <rect x="20" y="90" width="50" height="14" rx="2" fill="#6b7280" />
    {/* Trend line */}
    <polyline
      points="120,100 140,85 155,90 170,70 185,65"
      stroke="#6b7280"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// Campaign - Metrics with numbers
export const CampaignIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Three metric boxes */}
    <rect x="15" y="25" width="50" height="70" rx="4" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
    <text x="40" y="55" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold" fontFamily="system-ui">52.4</text>
    <rect x="30" y="65" width="20" height="4" rx="1" fill="#9ca3af" />
    
    <rect x="75" y="25" width="50" height="70" rx="4" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
    <text x="100" y="55" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold" fontFamily="system-ui">32</text>
    <rect x="85" y="65" width="30" height="4" rx="1" fill="#d1d5db" />
    
    <rect x="135" y="25" width="50" height="70" rx="4" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
    <text x="160" y="55" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold" fontFamily="system-ui">614</text>
    <rect x="145" y="65" width="25" height="4" rx="1" fill="#6b7280" />
  </svg>
);

// Coverage Report - Multiple donut charts
export const CoverageReportIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Three donut charts */}
    <circle cx="45" cy="60" r="28" fill="none" stroke="#e5e7eb" strokeWidth="10" />
    <circle cx="45" cy="60" r="28" fill="none" stroke="#9ca3af" strokeWidth="10" strokeDasharray="120 176" strokeLinecap="round" transform="rotate(-90 45 60)" />
    
    <circle cx="100" cy="60" r="28" fill="none" stroke="#e5e7eb" strokeWidth="10" />
    <circle cx="100" cy="60" r="28" fill="none" stroke="#6b7280" strokeWidth="10" strokeDasharray="90 176" strokeLinecap="round" transform="rotate(-90 100 60)" />
    
    <circle cx="155" cy="60" r="28" fill="none" stroke="#e5e7eb" strokeWidth="10" />
    <circle cx="155" cy="60" r="28" fill="none" stroke="#d1d5db" strokeWidth="10" strokeDasharray="140 176" strokeLinecap="round" transform="rotate(-90 155 60)" />
  </svg>
);

// Crisis Management - Bar chart with indicator
export const CrisisManagementIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Vertical bars */}
    <rect x="25" y="50" width="18" height="50" rx="2" fill="#d1d5db" />
    <rect x="50" y="35" width="18" height="65" rx="2" fill="#9ca3af" />
    <rect x="75" y="55" width="18" height="45" rx="2" fill="#d1d5db" />
    <rect x="100" y="25" width="18" height="75" rx="2" fill="#6b7280" />
    <rect x="125" y="45" width="18" height="55" rx="2" fill="#9ca3af" />
    <rect x="150" y="60" width="18" height="40" rx="2" fill="#d1d5db" />
    {/* Alert indicator */}
    <circle cx="175" cy="35" r="12" fill="#9ca3af" />
    <text x="175" y="40" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="system-ui">!</text>
  </svg>
);

// Earned Media - Dashboard with metrics
export const EarnedMediaIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Large metric */}
    <text x="60" y="50" textAnchor="middle" fill="#374151" fontSize="28" fontWeight="bold" fontFamily="system-ui">52.4</text>
    {/* Trend arrow */}
    <polyline points="40,60 55,72 75,65" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Mini bars */}
    <rect x="110" y="30" width="70" height="8" rx="2" fill="#9ca3af" />
    <rect x="110" y="45" width="55" height="8" rx="2" fill="#d1d5db" />
    <rect x="110" y="60" width="65" height="8" rx="2" fill="#6b7280" />
    {/* Bottom chart */}
    <rect x="20" y="85" width="160" height="20" rx="2" fill="#e5e7eb" />
    <rect x="20" y="85" width="60" height="20" rx="2" fill="#9ca3af" />
    <rect x="80" y="85" width="40" height="20" fill="#6b7280" />
    <rect x="120" y="85" width="30" height="20" fill="#d1d5db" />
  </svg>
);

// Social overview illustrations
export const FacebookIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    <rect x="20" y="30" width="70" height="60" rx="4" fill="#ffffff" stroke="#e5e7eb" />
    <circle cx="55" cy="55" r="15" fill="#9ca3af" />
    <rect x="35" y="75" width="40" height="6" rx="2" fill="#d1d5db" />
    <rect x="110" y="35" width="70" height="8" rx="2" fill="#9ca3af" />
    <rect x="110" y="50" width="55" height="8" rx="2" fill="#d1d5db" />
    <rect x="110" y="65" width="65" height="8" rx="2" fill="#6b7280" />
    <rect x="110" y="80" width="45" height="8" rx="2" fill="#e5e7eb" />
  </svg>
);

export const InstagramIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Grid of squares like photos */}
    <rect x="20" y="20" width="35" height="35" rx="2" fill="#9ca3af" />
    <rect x="60" y="20" width="35" height="35" rx="2" fill="#d1d5db" />
    <rect x="100" y="20" width="35" height="35" rx="2" fill="#6b7280" />
    <rect x="20" y="60" width="35" height="35" rx="2" fill="#d1d5db" />
    <rect x="60" y="60" width="35" height="35" rx="2" fill="#6b7280" />
    <rect x="100" y="60" width="35" height="35" rx="2" fill="#9ca3af" />
    {/* Side metrics */}
    <rect x="150" y="25" width="35" height="25" rx="4" fill="#ffffff" stroke="#e5e7eb" />
    <rect x="150" y="60" width="35" height="25" rx="4" fill="#ffffff" stroke="#e5e7eb" />
  </svg>
);

export const LinkedInIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Profile card style */}
    <rect x="20" y="20" width="70" height="80" rx="4" fill="#ffffff" stroke="#e5e7eb" />
    <circle cx="55" cy="45" r="15" fill="#9ca3af" />
    <rect x="35" y="65" width="40" height="4" rx="1" fill="#6b7280" />
    <rect x="30" y="75" width="50" height="4" rx="1" fill="#d1d5db" />
    <rect x="40" y="85" width="30" height="4" rx="1" fill="#e5e7eb" />
    {/* Stats */}
    <rect x="110" y="25" width="70" height="20" rx="2" fill="#9ca3af" />
    <rect x="110" y="55" width="70" height="20" rx="2" fill="#d1d5db" />
    <rect x="110" y="85" width="70" height="12" rx="2" fill="#6b7280" />
  </svg>
);

export const TikTokIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Phone frame with content */}
    <rect x="70" y="10" width="60" height="100" rx="8" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" />
    <rect x="75" y="20" width="50" height="60" rx="2" fill="#9ca3af" />
    <rect x="75" y="85" width="25" height="4" rx="1" fill="#6b7280" />
    <rect x="75" y="92" width="35" height="4" rx="1" fill="#d1d5db" />
    {/* Side icons */}
    <circle cx="145" cy="40" r="8" fill="#d1d5db" />
    <circle cx="145" cy="60" r="8" fill="#d1d5db" />
    <circle cx="145" cy="80" r="8" fill="#d1d5db" />
  </svg>
);

export const XOverviewIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Tweet-like cards */}
    <rect x="20" y="15" width="160" height="35" rx="4" fill="#ffffff" stroke="#e5e7eb" />
    <circle cx="38" cy="32" r="10" fill="#9ca3af" />
    <rect x="55" y="25" width="80" height="4" rx="1" fill="#6b7280" />
    <rect x="55" y="33" width="60" height="4" rx="1" fill="#d1d5db" />
    
    <rect x="20" y="55" width="160" height="35" rx="4" fill="#ffffff" stroke="#e5e7eb" />
    <circle cx="38" cy="72" r="10" fill="#d1d5db" />
    <rect x="55" y="65" width="100" height="4" rx="1" fill="#6b7280" />
    <rect x="55" y="73" width="70" height="4" rx="1" fill="#d1d5db" />
    
    <rect x="20" y="95" width="80" height="12" rx="2" fill="#9ca3af" />
    <rect x="110" y="95" width="70" height="12" rx="2" fill="#6b7280" />
  </svg>
);

export const YouTubeIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Video thumbnail */}
    <rect x="20" y="20" width="100" height="60" rx="4" fill="#9ca3af" />
    <polygon points="60,50 80,40 80,60" fill="#ffffff" />
    <rect x="20" y="85" width="60" height="4" rx="1" fill="#6b7280" />
    <rect x="20" y="93" width="80" height="4" rx="1" fill="#d1d5db" />
    {/* Side stats */}
    <rect x="135" y="25" width="45" height="20" rx="4" fill="#ffffff" stroke="#e5e7eb" />
    <rect x="135" y="55" width="45" height="20" rx="4" fill="#ffffff" stroke="#e5e7eb" />
    <rect x="135" y="85" width="45" height="12" rx="2" fill="#d1d5db" />
  </svg>
);

// Intelligence Product Illustrations

// TikTok Trends - Trending chart with music notes
export const TikTokTrendsIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Trending line */}
    <polyline
      points="20,90 50,75 80,80 110,50 140,55 170,30"
      stroke="#9ca3af"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    {/* Music notes */}
    <circle cx="170" cy="30" r="6" fill="#6b7280" />
    <rect x="175" y="15" width="2" height="20" fill="#6b7280" />
    <circle cx="50" cy="75" r="4" fill="#d1d5db" />
    <rect x="53" y="62" width="2" height="16" fill="#d1d5db" />
    {/* Hashtags */}
    <rect x="25" y="100" width="30" height="10" rx="5" fill="#d1d5db" />
    <rect x="60" y="100" width="40" height="10" rx="5" fill="#9ca3af" />
    <rect x="105" y="100" width="35" height="10" rx="5" fill="#d1d5db" />
  </svg>
);

// Audience Segments - Pie with demographics
export const AudienceSegmentsIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Pie chart */}
    <circle cx="70" cy="60" r="40" fill="#e5e7eb" />
    <path d="M70 60 L70 20 A40 40 0 0 1 110 60 Z" fill="#9ca3af" />
    <path d="M70 60 L110 60 A40 40 0 0 1 70 100 Z" fill="#6b7280" />
    <path d="M70 60 L70 100 A40 40 0 0 1 30 60 Z" fill="#d1d5db" />
    {/* User icons */}
    <circle cx="145" cy="35" r="8" fill="#9ca3af" />
    <rect x="138" y="45" width="14" height="10" rx="3" fill="#9ca3af" />
    <circle cx="170" cy="60" r="8" fill="#6b7280" />
    <rect x="163" y="70" width="14" height="10" rx="3" fill="#6b7280" />
    <circle cx="145" cy="90" r="8" fill="#d1d5db" />
    <rect x="138" y="100" width="14" height="10" rx="3" fill="#d1d5db" />
  </svg>
);

// Predictive Trends - Crystal ball / forecast chart
export const PredictiveTrendsIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Solid line */}
    <polyline
      points="20,80 50,70 80,75 100,60"
      stroke="#6b7280"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* Dashed prediction line */}
    <polyline
      points="100,60 130,40 160,35 180,25"
      stroke="#9ca3af"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeDasharray="6 4"
    />
    {/* Prediction cone */}
    <path d="M100,60 L180,15 L180,50 Z" fill="#e5e7eb" opacity="0.5" />
    {/* Lightning bolt */}
    <polygon points="170,70 155,85 165,85 150,105 165,90 155,90" fill="#9ca3af" />
  </svg>
);

// Competitor Intel - Comparison bars
export const CompetitorIntelIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Comparison bars */}
    <rect x="30" y="20" width="60" height="16" rx="2" fill="#6b7280" />
    <rect x="30" y="20" width="45" height="16" rx="2" fill="#9ca3af" />
    
    <rect x="30" y="45" width="80" height="16" rx="2" fill="#6b7280" />
    <rect x="30" y="45" width="55" height="16" rx="2" fill="#9ca3af" />
    
    <rect x="30" y="70" width="50" height="16" rx="2" fill="#6b7280" />
    <rect x="30" y="70" width="70" height="16" rx="2" fill="#9ca3af" />
    
    <rect x="30" y="95" width="90" height="16" rx="2" fill="#6b7280" />
    <rect x="30" y="95" width="60" height="16" rx="2" fill="#9ca3af" />
    
    {/* Legend */}
    <rect x="140" y="40" width="10" height="10" rx="2" fill="#9ca3af" />
    <rect x="155" y="42" width="25" height="6" rx="1" fill="#d1d5db" />
    <rect x="140" y="55" width="10" height="10" rx="2" fill="#6b7280" />
    <rect x="155" y="57" width="30" height="6" rx="1" fill="#d1d5db" />
  </svg>
);

// Podcast Monitor - Audio waveform
export const PodcastMonitorIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Waveform */}
    <rect x="25" y="45" width="6" height="30" rx="3" fill="#d1d5db" />
    <rect x="37" y="35" width="6" height="50" rx="3" fill="#9ca3af" />
    <rect x="49" y="50" width="6" height="20" rx="3" fill="#d1d5db" />
    <rect x="61" y="30" width="6" height="60" rx="3" fill="#6b7280" />
    <rect x="73" y="40" width="6" height="40" rx="3" fill="#9ca3af" />
    <rect x="85" y="45" width="6" height="30" rx="3" fill="#d1d5db" />
    <rect x="97" y="35" width="6" height="50" rx="3" fill="#9ca3af" />
    <rect x="109" y="50" width="6" height="20" rx="3" fill="#d1d5db" />
    <rect x="121" y="38" width="6" height="44" rx="3" fill="#6b7280" />
    <rect x="133" y="45" width="6" height="30" rx="3" fill="#9ca3af" />
    <rect x="145" y="40" width="6" height="40" rx="3" fill="#d1d5db" />
    <rect x="157" y="48" width="6" height="24" rx="3" fill="#9ca3af" />
    <rect x="169" y="42" width="6" height="36" rx="3" fill="#6b7280" />
    {/* Microphone icon */}
    <circle cx="100" cy="105" r="8" fill="#9ca3af" />
    <rect x="97" y="95" width="6" height="10" rx="3" fill="#9ca3af" />
  </svg>
);

// GenAI Lens - AI brain visualization
export const GenAILensIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 120" className={className} fill="none">
    <rect width="200" height="120" fill="#f5f5f5" rx="4" />
    {/* Neural network */}
    <circle cx="40" cy="40" r="8" fill="#9ca3af" />
    <circle cx="40" cy="80" r="8" fill="#9ca3af" />
    <circle cx="100" cy="30" r="8" fill="#6b7280" />
    <circle cx="100" cy="60" r="8" fill="#6b7280" />
    <circle cx="100" cy="90" r="8" fill="#6b7280" />
    <circle cx="160" cy="50" r="8" fill="#9ca3af" />
    <circle cx="160" cy="80" r="8" fill="#9ca3af" />
    {/* Connections */}
    <line x1="48" y1="40" x2="92" y2="30" stroke="#d1d5db" strokeWidth="1.5" />
    <line x1="48" y1="40" x2="92" y2="60" stroke="#d1d5db" strokeWidth="1.5" />
    <line x1="48" y1="80" x2="92" y2="60" stroke="#d1d5db" strokeWidth="1.5" />
    <line x1="48" y1="80" x2="92" y2="90" stroke="#d1d5db" strokeWidth="1.5" />
    <line x1="108" y1="30" x2="152" y2="50" stroke="#d1d5db" strokeWidth="1.5" />
    <line x1="108" y1="60" x2="152" y2="50" stroke="#d1d5db" strokeWidth="1.5" />
    <line x1="108" y1="60" x2="152" y2="80" stroke="#d1d5db" strokeWidth="1.5" />
    <line x1="108" y1="90" x2="152" y2="80" stroke="#d1d5db" strokeWidth="1.5" />
    {/* Sparkle */}
    <polygon points="160,20 163,27 170,27 165,32 167,40 160,35 153,40 155,32 150,27 157,27" fill="#9ca3af" />
  </svg>
);

// Map template titles to illustrations
export const getTemplateIllustration = (title: string) => {
  const illustrations: Record<string, React.FC<IllustrationProps>> = {
    "Custom": CustomIllustration,
    "Audience": AudienceIllustration,
    "Benchmark": BenchmarkIllustration,
    "Brand": BrandIllustration,
    "Campaign": CampaignIllustration,
    "Coverage Report": CoverageReportIllustration,
    "Crisis Management": CrisisManagementIllustration,
    "Earned Media": EarnedMediaIllustration,
    "Facebook Overview": FacebookIllustration,
    "Instagram Overview": InstagramIllustration,
    "LinkedIn Overview": LinkedInIllustration,
    "TikTok Overview": TikTokIllustration,
    "X Overview": XOverviewIllustration,
    "YouTube Overview": YouTubeIllustration,
  };
  
  return illustrations[title] || CustomIllustration;
};

// Map intelligence product titles to illustrations
export const getIntelligenceIllustration = (title: string) => {
  const illustrations: Record<string, React.FC<IllustrationProps>> = {
    "GenAI Lens": GenAILensIllustration,
    "Trends Center": TikTokTrendsIllustration,
    "Audience Segments": AudienceSegmentsIllustration,
    "Predictive Trends": PredictiveTrendsIllustration,
    "Competitor Intel": CompetitorIntelIllustration,
    "Podcast Monitor": PodcastMonitorIllustration,
  };
  
  return illustrations[title] || GenAILensIllustration;
};
