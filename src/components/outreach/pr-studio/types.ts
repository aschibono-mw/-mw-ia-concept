export type PitchFormat = "media-pitch" | "press-release";
export type PitchLength = "short" | "medium" | "long";
export type PitchStatus = "draft" | "generated" | "sent";
export type PitchTone = "professional" | "conversational" | "urgent" | "storytelling";
export type PitchLanguage = "english" | "spanish" | "french" | "german" | "portuguese";

export interface PitchQuote {
  id: string;
  text: string;
  attribution: string;
}

export interface Pitch {
  id: string;
  name: string;
  type: PitchFormat;
  status: PitchStatus;
  createdBy: string;
  lastUpdated: string;
  content?: string;
  generatedOutput?: string;
  language: PitchLanguage;
  tone: PitchTone;
  length: PitchLength;
  quotes: PitchQuote[];
  articleReference?: string;
  starred?: boolean;
}

export const TONE_OPTIONS: { value: PitchTone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "conversational", label: "Conversational" },
  { value: "urgent", label: "Urgent" },
  { value: "storytelling", label: "Storytelling" },
];

export const LANGUAGE_OPTIONS: { value: PitchLanguage; label: string }[] = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "portuguese", label: "Portuguese" },
];

export const mockPitches: Pitch[] = [
  {
    id: "pitch-1",
    name: "Expanding RocketPlay Toys' Reach",
    type: "media-pitch",
    status: "generated",
    createdBy: "Robert Rydefalk",
    lastUpdated: "Nov 7th • 03:12 PM",
    content: "Write about RocketPlay Toys expanding into international markets with a focus on educational play.",
    generatedOutput: "RocketPlay Toys, a leader in innovative children's entertainment, today announced its expansion into European and Asian markets. The company's award-winning line of STEM-focused toys has captured the attention of educators and parents worldwide.\n\nThe expansion, set to begin in Q1 2025, will initially target the United Kingdom, Germany, Japan, and South Korea. RocketPlay CEO Maria Chen stated that the move responds to growing international demand for their unique blend of play and learning.\n\nThe company's flagship product, the RocketBuilder Kit, has sold over 2 million units in North America since its launch in 2023.",
    language: "english",
    tone: "professional",
    length: "medium",
    quotes: [{ id: "q1", text: "We believe every child deserves access to toys that spark curiosity and creativity.", attribution: "Maria Chen, CEO" }],
    starred: true,
  },
  {
    id: "pitch-2",
    name: "Initiate Zelensky-Trump-Putin Peace Talks",
    type: "press-release",
    status: "generated",
    createdBy: "Jason Napolitano",
    lastUpdated: "Aug 8th • 02:43 PM",
    content: "Create a pitch for Zelensky and Donald Trump and Putin to talk about peace negotiations on Ukraine and discuss world peace.",
    generatedOutput: "KYIV, Ukraine -- Ukrainian President Volodymyr Zelensky, U.S. President Donald Trump, and Russian President Vladimir Putin have agreed to meet for peace negotiations aimed at resolving the ongoing conflict in Ukraine.\n\nThe summit is scheduled to take place in Istanbul on August 15, 2025. The decision follows a series of diplomatic efforts and escalating tensions.",
    language: "english",
    tone: "professional",
    length: "short",
    quotes: [],
    starred: false,
  },
  {
    id: "pitch-3",
    name: "Cloud Changemakers: Innovating Excellence",
    type: "press-release",
    status: "generated",
    createdBy: "Tyler Brougham",
    lastUpdated: "Nov 10th • 12:13 PM",
    content: "Highlight the achievements of cloud technology leaders who are driving innovation in enterprise software.",
    generatedOutput: "A new wave of cloud technology leaders is reshaping how enterprises approach digital transformation. These changemakers are pioneering solutions that combine AI, edge computing, and sustainable practices.\n\nFrom startups to Fortune 500 companies, the cloud innovation ecosystem continues to accelerate at unprecedented rates.",
    language: "english",
    tone: "professional",
    length: "medium",
    quotes: [],
    starred: false,
  },
  {
    id: "pitch-4",
    name: "RocketPlay Toys: Expanding Fun!",
    type: "media-pitch",
    status: "generated",
    createdBy: "Eric Hackman",
    lastUpdated: "Mar 5th • 12:10 PM",
    content: "Fun and engaging pitch about RocketPlay Toys' new product line for summer 2025.",
    language: "english",
    tone: "conversational",
    length: "short",
    quotes: [],
    starred: false,
  },
  {
    id: "pitch-5",
    name: "CEO Greg Behar Departs",
    type: "press-release",
    status: "generated",
    createdBy: "Tyler Brougham",
    lastUpdated: "Feb 23rd • 03:55 PM",
    content: "Announce the departure of CEO Greg Behar and the transition plan for new leadership.",
    generatedOutput: "The Board of Directors today announced that CEO Greg Behar will step down effective March 31, 2025. The company has initiated a comprehensive search for his successor.\n\nDuring his tenure, Behar led the company through a period of significant growth, expanding revenue by 340% and entering seven new markets.",
    language: "english",
    tone: "professional",
    length: "medium",
    quotes: [{ id: "q2", text: "I'm proud of what we've accomplished together and confident in the company's future.", attribution: "Greg Behar, outgoing CEO" }],
    starred: true,
  },
  {
    id: "pitch-6",
    name: "Expanding Joyful Learning Experiences",
    type: "media-pitch",
    status: "draft",
    createdBy: "Tyler Brougham",
    lastUpdated: "Oct 30th • 04:36 PM",
    content: "Draft pitch about educational technology partnerships.",
    language: "english",
    tone: "storytelling",
    length: "long",
    quotes: [],
    starred: false,
  },
  {
    id: "pitch-7",
    name: "Q4 Earnings Beat Expectations",
    type: "press-release",
    status: "draft",
    createdBy: "Robert Rydefalk",
    lastUpdated: "Oct 15th • 09:22 AM",
    content: "Draft press release about strong Q4 earnings results.",
    language: "english",
    tone: "professional",
    length: "medium",
    quotes: [],
    starred: false,
  },
  {
    id: "pitch-8",
    name: "Sustainability Initiative Launch",
    type: "press-release",
    status: "sent",
    createdBy: "Jason Napolitano",
    lastUpdated: "Sep 18th • 11:45 AM",
    content: "Announce new corporate sustainability initiative with carbon-neutral goals.",
    generatedOutput: "The company today unveiled its comprehensive sustainability roadmap, committing to achieving carbon neutrality across all operations by 2030.\n\nThe initiative includes transitioning to 100% renewable energy, implementing circular supply chain practices, and establishing a $50M green innovation fund.",
    language: "english",
    tone: "professional",
    length: "long",
    quotes: [{ id: "q3", text: "Sustainability isn't just good for the planet—it's good for business.", attribution: "Dr. Sarah Lin, Chief Sustainability Officer" }],
    starred: true,
  },
];
