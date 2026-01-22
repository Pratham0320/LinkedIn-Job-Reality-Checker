import type { JobVerdict } from "../analysis/jobScorer";

const OVERLAY_ID = "job-risk-overlay";

export function showJobVerdictOverlay(verdict: JobVerdict) {
  // Remove existing overlay
  document.getElementById(OVERLAY_ID)?.remove();

  const container = document.createElement("div");
  container.id = OVERLAY_ID;

  container.style.position = "fixed";
  container.style.top = "100px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  container.style.width = "260px";
  container.style.padding = "12px";
  container.style.background = "#0f172a"; // slate-900
  container.style.color = "#f8fafc"; // slate-50
  container.style.fontFamily = "system-ui, sans-serif";
  container.style.borderRadius = "10px";
  container.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
  container.style.fontSize = "13px";

  const title = document.createElement("div");
  title.style.fontWeight = "600";
  title.style.marginBottom = "6px";
  title.textContent = `Job Risk: ${verdict.verdict.toUpperCase()}`;

  const score = document.createElement("div");
  score.style.marginBottom = "8px";
  score.textContent = `Score: ${verdict.score} / 100`;

  const list = document.createElement("ul");
  list.style.paddingLeft = "18px";

  verdict.reasons.forEach((reason) => {
    const li = document.createElement("li");
    li.textContent = reason;
    li.style.marginBottom = "4px";
    list.appendChild(li);
  });

  container.appendChild(title);
  container.appendChild(score);
  container.appendChild(list);

  document.body.appendChild(container);
}
