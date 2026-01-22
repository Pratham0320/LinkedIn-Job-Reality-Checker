chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "CAPTURE_SCREENSHOT") {
    chrome.tabs.captureVisibleTab(
      sender.tab?.windowId,
      { format: "png" },
      (image) => {
        sendResponse({ image });
      }
    );
    return true; // async
  }
});
