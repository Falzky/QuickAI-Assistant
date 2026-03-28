importScripts("menus.js");
importScripts("contextMenuManager.js");

const menuManager = new ContextMenuManager(MENUS);

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ MENUS: MENUS });
  menuManager.initializeMenus();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callGeminiApi") {
    chrome.storage.local.get("DATA", (result) => {
      const apiKey = result.DATA?.geminiKey;

      if (!apiKey || apiKey === "**********") {
        sendResponse({ success: false, error: "API key missing or invalid." });
        return;
      }

      generateContent(request.payload, apiKey)
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message }),
        );
    });
    return true;
  }
});

async function generateContent(prompt, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message ||
        `Request failed with status ${response.status}`,
    );
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

chrome.contextMenus.onClicked.addListener((info) => {
  menuManager.handleMenuClick(info);
});
