import { FeedItem, MonitorCanvas, ExploreSearch } from './types';

export const existingSearches: ExploreSearch[] = [
  { id: '1', name: 'Brand + Earnings Risk', category: 'Brand' },
  { id: '2', name: 'Regulatory & Policy Mentions', category: 'Policy' },
  { id: '3', name: 'Executive Leadership Coverage', category: 'Leadership' },
  { id: '4', name: 'Industry Layoffs & Restructuring', category: 'Leadership' },
  { id: '5', name: 'Brand Sentiment Watch', category: 'Brand' },
  { id: '6', name: 'M&A and Acquisition Activity', category: 'Competition' },
  { id: '7', name: 'Social Backlash Monitoring', category: 'Social' },
  { id: '8', name: 'Competitor Product Launches', category: 'Competition' },
];

const generateFeedItems = (searchName: string): FeedItem[] => {
  const feedTemplates: Record<string, FeedItem[]> = {
    'Brand + Earnings Risk': [
      {
        id: '1-1',
        source: 'Financial Times',
        author: 'Sarah Johnson',
        timestamp: '15m ago',
        title: 'Q4 Earnings Preview: Tech Giants Face Headwinds',
        content: 'Analysts are closely watching upcoming earnings reports as market volatility continues. Key metrics to watch include revenue guidance and cost management initiatives.',
        reach: 125000,
        sentiment: 'neutral',
      },
      {
        id: '1-2',
        source: 'Bloomberg',
        author: 'Michael Chen',
        timestamp: '32m ago',
        title: 'Brand Value Rankings Show Surprising Shifts',
        content: 'The latest brand value index reveals significant movement among top companies, with tech firms seeing both gains and losses in consumer perception.',
        reach: 89000,
        sentiment: 'positive',
      },
      {
        id: '1-3',
        source: 'Reuters',
        author: 'Emma Williams',
        timestamp: '1h ago',
        title: 'Market Reacts to Earnings Guidance',
        content: 'Stock prices fluctuated after several major companies revised their earnings outlook for the upcoming quarter.',
        reach: 67000,
        sentiment: 'negative',
      },
    ],
    'Executive Leadership Coverage': [
      {
        id: '2-1',
        source: 'Wall Street Journal',
        author: 'David Park',
        timestamp: '45m ago',
        title: 'CEO Spotlight: Leadership Transitions in Tech',
        content: 'A wave of leadership changes is reshaping the technology sector, with several high-profile CEO appointments announced this week.',
        reach: 98000,
        sentiment: 'neutral',
      },
      {
        id: '2-2',
        source: 'CNBC',
        author: 'Lisa Thompson',
        timestamp: '2h ago',
        title: 'Executive Pay Debates Continue',
        content: 'Shareholder activism is putting pressure on compensation committees as discussions around executive pay intensify.',
        reach: 54000,
        sentiment: 'negative',
      },
      {
        id: '2-3',
        source: 'Forbes',
        author: 'James Miller',
        timestamp: '3h ago',
        title: 'Top Leaders Share Vision for 2026',
        content: 'Industry executives outline their strategic priorities, focusing on AI integration and sustainable growth.',
        reach: 72000,
        sentiment: 'positive',
      },
    ],
    'Competitor Product Launches': [
      {
        id: '3-1',
        source: 'TechCrunch',
        author: 'Alex Rivera',
        timestamp: '20m ago',
        title: 'New Product Announcement Shakes Up Market',
        content: 'A surprise product launch from a major competitor is drawing attention and could impact market share in the coming months.',
        reach: 112000,
        sentiment: 'neutral',
      },
      {
        id: '3-2',
        source: 'The Verge',
        author: 'Chris Martinez',
        timestamp: '1h ago',
        title: 'Hands-on: First Look at Latest Innovation',
        content: 'Our first impressions of the newly announced device suggest it could be a game-changer for the industry.',
        reach: 87000,
        sentiment: 'positive',
      },
      {
        id: '3-3',
        source: 'Wired',
        author: 'Nina Patel',
        timestamp: '4h ago',
        title: 'Product Comparison: How New Entries Stack Up',
        content: 'We compare the latest product releases across key metrics to help you understand the competitive landscape.',
        reach: 45000,
        sentiment: 'neutral',
      },
    ],
    'Social Backlash Monitoring': [
      {
        id: '4-1',
        source: 'X (Twitter)',
        handle: '@techwatch',
        timestamp: '5m ago',
        content: 'Growing concerns about the latest policy changes. Users are expressing frustration with the new terms of service. #TechNews',
        reach: 23000,
        sentiment: 'negative',
      },
      {
        id: '4-2',
        source: 'Reddit',
        author: 'u/industryinsider',
        timestamp: '25m ago',
        content: 'The community response to the announcement has been mixed. Many are calling for more transparency from leadership.',
        reach: 15000,
        sentiment: 'negative',
      },
      {
        id: '4-3',
        source: 'X (Twitter)',
        handle: '@brandcritic',
        timestamp: '1h ago',
        content: 'Another day, another PR crisis brewing. Companies need to do better at listening to customer feedback.',
        reach: 8500,
        sentiment: 'negative',
      },
    ],
  };

  // Default feed items for searches not in templates
  const defaultItems: FeedItem[] = [
    {
      id: 'default-1',
      source: 'Industry News',
      author: 'Staff Reporter',
      timestamp: '30m ago',
      title: `Latest Updates on ${searchName}`,
      content: 'Stay informed with the latest developments and analysis from our expert team covering this topic.',
      reach: 45000,
      sentiment: 'neutral',
    },
    {
      id: 'default-2',
      source: 'Market Watch',
      author: 'Analysis Team',
      timestamp: '2h ago',
      title: 'Trends and Insights',
      content: 'Our comprehensive analysis reveals key patterns and emerging trends that could impact your strategy.',
      reach: 32000,
      sentiment: 'positive',
    },
    {
      id: 'default-3',
      source: 'Daily Report',
      author: 'Editorial',
      timestamp: '5h ago',
      title: 'Weekly Roundup',
      content: 'A summary of the most important stories and developments from the past week.',
      reach: 28000,
      sentiment: 'neutral',
    },
  ];

  return feedTemplates[searchName] || defaultItems;
};

export const initialCanvases: MonitorCanvas[] = [
  {
    id: 'canvas-1',
    name: 'Brand Monitoring',
    streams: [
      {
        id: 'stream-1',
        name: 'Brand Mentions',
        searchId: '1',
        searchName: 'Brand + Earnings Risk',
        items: generateFeedItems('Brand + Earnings Risk'),
      },
      {
        id: 'stream-2',
        name: 'Leadership News',
        searchId: '3',
        searchName: 'Executive Leadership Coverage',
        items: generateFeedItems('Executive Leadership Coverage'),
      },
    ],
  },
  {
    id: 'canvas-2',
    name: 'Competitive Intel',
    streams: [
      {
        id: 'stream-3',
        name: 'Product Launches',
        searchId: '8',
        searchName: 'Competitor Product Launches',
        items: generateFeedItems('Competitor Product Launches'),
      },
      {
        id: 'stream-4',
        name: 'Social Sentiment',
        searchId: '7',
        searchName: 'Social Backlash Monitoring',
        items: generateFeedItems('Social Backlash Monitoring'),
      },
    ],
  },
];

export { generateFeedItems };
