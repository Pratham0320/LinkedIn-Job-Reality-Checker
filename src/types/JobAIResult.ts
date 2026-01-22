export interface JobAIResult {
  // Core visible information
  title: string | null;
  company: string | null;
  location: string | null;

  // Posting metadata
  postedText: string | null;       // e.g. "Reposted 3 days ago", "Posted 6 months ago"

  // Platform signals
  isEasyApply: boolean;
  isPromoted: boolean;
  isReposted: boolean;

  // Optional confidence helpers (AI inferred)
  companyVerified: boolean | null; // null if unclear
  seniorityLevel: "Intern" | "Junior" | "Mid" | "Senior" | "Unknown";

  // Meta
  extractionConfidence: number;    // 0–1 confidence from AI
}
