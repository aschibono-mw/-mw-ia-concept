export interface MediaList {
  id: string;
  name: string;
  description?: string;
  journalistIds: number[];
  outletIds: number[];
  createdAt: string;
  updatedAt: string;
  owner: string;
  color: string;
}

export const LIST_COLORS = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
];

export const mockMediaLists: MediaList[] = [
  {
    id: "list-1",
    name: "AI & Tech Reporters",
    description: "Key journalists covering artificial intelligence and technology",
    journalistIds: [1, 4, 7],
    outletIds: [1, 4],
    createdAt: "2024-01-15",
    updatedAt: "2024-02-01",
    owner: "Rachel Wu",
    color: "#3B82F6",
  },
  {
    id: "list-2",
    name: "Tier 1 Business Media",
    description: "Top-tier business and finance outlets for executive comms",
    journalistIds: [2, 5],
    outletIds: [2, 5, 6],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-28",
    owner: "Sophia Patel",
    color: "#10B981",
  },
  {
    id: "list-3",
    name: "Product Launch 2024",
    description: "Media contacts for upcoming product launch",
    journalistIds: [1, 3, 6, 8],
    outletIds: [1, 3],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05",
    owner: "Tom Nguyen",
    color: "#8B5CF6",
  },
];
