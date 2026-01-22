export async function captureVisibleJobScreenshot(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      if (!response?.imageBase64) {
        reject(new Error("No image received"));
        return;
      }

      if (!response || response.error || !response.imageBase64) {
        reject(new Error(response?.error || "No image received"));
        return;
      }

      resolve(response.imageBase64);
    });
  });
}
