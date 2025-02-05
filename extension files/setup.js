document.getElementById("saveKey").addEventListener("click", () => {
    const apiKey = document.getElementById("apiKey").value.trim();
    if (apiKey) {
      chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
        alert("API key saved successfully!");
      });
    } else {
      alert("Please enter a valid API key.");
    }
  });