const DEFAULT_KEY = "**********";
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent";

const toggleModeBtn = document.getElementById("toggleMode");

chrome.storage.local.get("darkMode", (data) => {
  if (data.darkMode) {
    document.documentElement.classList.add("dark");
    toggleModeBtn.querySelector("span").innerHTML = "&#9728;";
  } else {
    toggleModeBtn.querySelector("span").innerHTML = "&#9790;";
  }
});

toggleModeBtn.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  toggleModeBtn.querySelector("span").innerHTML = isDark
    ? "&#9728;"
    : "&#9790;";
  chrome.storage.local.set({ darkMode: isDark });
});

document.getElementById("saveButton").addEventListener("click", () => {
  const gptKey = document.getElementById("gptKey").value;
  const geminiKey = document.getElementById("geminiKey").value;
  const grokKey = document.getElementById("grokKey").value;

  const gptEndpoint = document.getElementById("gptEndpoint").value;
  const geminiEndpoint =
    document.getElementById("geminiEndpoint").value || GEMINI_ENDPOINT;
  const grokEndpoint = document.getElementById("grokEndpoint").value;
  const selectedAI = document.getElementById("toggle").value;

  chrome.storage.local.get("DATA", (result) => {
    const prevData = result.DATA || {};

    const newData = {
      gptKey: gptKey !== DEFAULT_KEY ? gptKey : prevData.gptKey,
      geminiKey: geminiKey !== DEFAULT_KEY ? geminiKey : prevData.geminiKey,
      grokKey: grokKey !== DEFAULT_KEY ? grokKey : prevData.grokKey,
      gptEndpoint,
      geminiEndpoint,
      grokEndpoint,
      selectedAI,
    };

    chrome.storage.local.set({ DATA: newData }, () => {
      alert("Configuration saved successfully.");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("DATA", (result) => {
    const info = result.DATA;
    if (!info) return;

    if (info.gptKey) document.getElementById("gptKey").value = DEFAULT_KEY;
    if (info.geminiKey)
      document.getElementById("geminiKey").value = DEFAULT_KEY;
    if (info.grokKey) document.getElementById("grokKey").value = DEFAULT_KEY;

    document.getElementById("gptEndpoint").value = info.gptEndpoint || "";
    document.getElementById("geminiEndpoint").value =
      info.geminiEndpoint || GEMINI_ENDPOINT;
    document.getElementById("grokEndpoint").value = info.grokEndpoint || "";
    document.getElementById("toggle").value = info.selectedAI || "gemini";
  });
});
