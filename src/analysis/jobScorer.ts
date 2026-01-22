import type { JobAIResult } from "../types/JobAIResult";

export interface JobVerdict {
  score: number; // 0–100
  verdict: "Good" | "Caution" | "Avoid";
  reasons: string[];
}

export function scoreJob(job: JobAIResult): JobVerdict {
  let score = 100;
  const reasons: string[] = [];

  // 1️⃣ Missing core info
  if (!job.company) {
    score -= 20;
    reasons.push("Company information missing");
  }

  if (!job.postedText) {
    score -= 15;
    reasons.push("Posting date unclear");
  }

  // 2️⃣ Repost penalty
  if (job.isReposted) {
    score -= 20;
    reasons.push("Job has been reposted multiple times");
  }

  // 3️⃣ Easy Apply spam signal
  if (job.isEasyApply && job.isReposted) {
    score -= 15;
    reasons.push("Easy Apply + repost suggests low hiring intent");
  }

  // 4️⃣ Promotion signal
  if (job.isPromoted) {
    score -= 10;
    reasons.push("Promoted job may be marketing-driven");
  }

  // 5️⃣ Old job penalty
  if (job.postedText?.toLowerCase().includes("month")) {
    score -= 15;
    reasons.push("Job posting is relatively old");
  }

  // 6️⃣ Low AI confidence safeguard
  if (job.extractionConfidence < 0.6) {
    score -= 10;
    reasons.push("Low confidence in extracted data");
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Verdict buckets
  let verdict: JobVerdict["verdict"] = "Good";
  if (score < 70) verdict = "Caution";
  if (score < 40) verdict = "Avoid";

  return {
    score,
    verdict,
    reasons,
  };
}
