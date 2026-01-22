import { captureVisibleJobScreenshot } from "./screenshot";
import { analyzeJobScreenshot } from "ai/geminiVisionClient";
import { scoreJob } from "../analysis/jobScorer";
import { showJobVerdictOverlay } from "./uiOverlay";
import type { JobAIResult } from "../types/JobAIResult";

console.log("[Job Reality Checker] Content script loaded");

let lastUrl = "";

/**
 * Main pipeline:
 * 1. Capture job screenshot
 * 2. Send to Gemini Vision
 * 3. Score job using heuristics
 * 4. Show explainable overlay
 */
async function analyzeCurrentJob() {
  try {
    console.log("📸 Capturing job screenshot...");
    const screenshotBase64 = await captureVisibleJobScreenshot();

    console.log("🤖 Sending screenshot to Gemini Vision...");
    const aiResult: JobAIResult = await analyzeJobScreenshot(
      screenshotBase64,
      "AIzaSyAqvT1HmXcI3DAMdy4nEWUtRSSl0lqyxnE"
    );

    console.log("🧠 AI Extracted Job Data:", aiResult);

    console.log("📊 Scoring job...");
    const verdict = scoreJob(aiResult);

    console.log("✅ Final Verdict:", verdict);

    showJobVerdictOverlay(verdict);
  } catch (error) {
    console.error("❌ Job analysis failed:", error);
  }
}

/**
 * Detect job changes in SPA navigation
 * LinkedIn does not reload pages, so we observe URL changes
 */
function watchJobChanges() {
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;

      // Only run on job pages
      if (lastUrl.includes("/jobs/")) {
        console.log("🔄 Job page changed, re-analyzing...");
        setTimeout(analyzeCurrentJob, 2000);
      }
    }
  }, 1000);
}

// Initial run
setTimeout(() => {
  lastUrl = window.location.href;
  if (lastUrl.includes("/jobs/")) {
    analyzeCurrentJob();
  }
}, 2000);

// Watch for SPA navigation
watchJobChanges();
