import { observeJobChanges } from "./domObserver";
import { extractJobSignals } from "./signalExtractor";
import { saveJobData, getJobData } from "./data/jobStore";
import { extractFromNetwork } from "./extractor/networkJobExtractor";

injectInterceptor();

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.source !== "LI_JOB_DATA") return;

  const payload = event.data.payload;
  const jobId = payload?.data?.jobPosting?.entityUrn?.match(/\d+/)?.[0];

  if (jobId) {
  console.log("RAW NETWORK PAYLOAD:", payload);
saveJobData("LAST_PAYLOAD", payload);

}
});

console.log("[Job Reality Checker] Initialized");

function injectInterceptor() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("dist/networkInterceptor.js");
  script.type = "module";
  script.onload = () => {
    script.remove();
  };
  document.documentElement.appendChild(script);
}

observeJobChanges((jobId) => {
  console.log("Job change detected, waiting for DOM stabilization...");

  setTimeout(() => {
    try {
      const raw = getJobData(jobId);
      const signals = raw
        ? extractFromNetwork(raw)
        : {
            title: null,
            company: null,
            location: null,
            postedText: null,
            applicantCount: null,
            reposted: false,
            promoted: false,
          };

      console.log("Signals (network):", signals);

      console.log("New job detected");
      console.log("Job ID:", jobId);
      console.log("Signals:", signals);
    } catch (err) {
      console.error("[Job Reality Checker] Signal extraction failed", err);
    }
  }, 800); // critical delay
});
