chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== "CAPTURE_SCREENSHOT") return;

  (async () => {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      if (!tabs.length || tabs[0].windowId === undefined) {
        sendResponse({ error: "No active tab" });
        return;
      }

      const dataUrl = await chrome.tabs.captureVisibleTab(
        tabs[0].windowId,
        { format: "png" }
      );

      if (!dataUrl) {
        sendResponse({ error: "Screenshot failed" });
        return;
      }

      sendResponse({
        imageBase64: dataUrl.split(",")[1],
      });
    } catch (err) {
      sendResponse({ error: String(err) });
    }
  })();

  return true; // 🔥 keeps worker alive
});
