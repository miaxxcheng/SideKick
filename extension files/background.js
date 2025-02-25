chrome.action.onClicked.addListener((tab) => {
    // Inject content script to show the Sidekick icon and chatbox
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: showSidekickIconAndChatbox
    });
});


chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showSidekickIconAndChatbox
    });
  });
  
    // Retrieve the OpenAI API key from Chrome storage
    async function getOpenAIKey() {
        return new Promise((resolve) => {
        chrome.storage.sync.get("openaiApiKey", (data) => {
            resolve(data.openaiApiKey);
        });
        });
    }

  // Function to call OpenAI API
  async function callOpenAI(prompt) {

    const openaiApiKey = await getOpenAIKey();
        if (!openaiApiKey) {
            console.error("OpenAI API key not found. Please set it up in the extension settings.");
            return;
        }
        
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "callOpenAI") {
      callOpenAI(request.prompt).then((response) => {
        sendResponse({ response: response });
      });
      return true; // Indicates async response
    } else if (request.action === "getAuthToken") {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          console.error("Error getting auth token:", chrome.runtime.lastError);
          sendResponse({ error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ token: token });
        }
      });
      return true;
    }
  });


function showSidekickIconAndChatbox() {
    // Prevent duplication of Sidekick icon and chatbox
    if (document.getElementById("sidekick-icon")) return;

    // Create the Sidekick icon
    const sidekickIcon = document.createElement("div");
    sidekickIcon.id = "sidekick-icon";
    sidekickIcon.style.position = "fixed";
    sidekickIcon.style.bottom = "20px";
    sidekickIcon.style.right = "20px";
    sidekickIcon.style.width = "50px";
    sidekickIcon.style.height = "50px";
    sidekickIcon.style.borderRadius = "50%";
    sidekickIcon.style.backgroundColor = "#6200ea";
    sidekickIcon.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    sidekickIcon.style.cursor = "pointer";
    sidekickIcon.style.zIndex = "1000";
    sidekickIcon.style.display = "flex";
    sidekickIcon.style.alignItems = "center";
    sidekickIcon.style.justifyContent = "center";
    sidekickIcon.style.color = "white";
    sidekickIcon.style.fontWeight = "bold";
    sidekickIcon.innerText = "SK";

    // Create the chatbox
    const chatbox = document.createElement("div");
    chatbox.id = "sidekick-chatbox";
    chatbox.style.position = "fixed";
    chatbox.style.bottom = "80px";
    chatbox.style.right = "20px";
    chatbox.style.width = "300px";
    chatbox.style.height = "400px";
    chatbox.style.border = "1px solid #ccc";
    chatbox.style.borderRadius = "10px";
    chatbox.style.backgroundColor = "white";
    chatbox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    chatbox.style.zIndex = "1000";
    chatbox.style.display = "none";
    chatbox.style.overflow = "hidden";

    // Add a simple header to the chatbox
    const chatboxHeader = document.createElement("div");
    chatboxHeader.style.backgroundColor = "#6200ea";
    chatboxHeader.style.color = "white";
    chatboxHeader.style.padding = "10px";
    chatboxHeader.style.borderTopLeftRadius = "10px";
    chatboxHeader.style.borderTopRightRadius = "10px";
    chatboxHeader.style.cursor = "move"; // Allow dragging
    chatboxHeader.innerText = "Sidekick Chat";

    const chatboxContent = document.createElement("div");
    chatboxContent.style.padding = "10px";
    chatboxContent.style.height = "calc(100% - 90px)";
    chatboxContent.style.overflowY = "auto";
    chatboxContent.innerText = "Hello! How can I help you today?";

    // Create a text input field and send button
    const inputContainer = document.createElement("div");
    inputContainer.style.position = "absolute";
    inputContainer.style.bottom = "10px";
    inputContainer.style.left = "10px";
    inputContainer.style.width = "calc(100% - 20px)";
    inputContainer.style.display = "flex";

    const inputField = document.createElement("input");
    inputField.style.flex = "1";
    inputField.style.padding = "8px";
    inputField.style.borderRadius = "5px";
    inputField.style.border = "1px solid #ccc";
    inputField.style.marginRight = "10px";
    inputField.placeholder = "Type your message...";

    const sendButton = document.createElement("button");
    sendButton.style.padding = "8px 16px";
    sendButton.style.backgroundColor = "#6200ea";
    sendButton.style.color = "white";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "5px";
    sendButton.innerText = "Send";

    // Append input field and send button
    inputContainer.appendChild(inputField);
    inputContainer.appendChild(sendButton);

    // Add input container to the chatbox
    chatbox.appendChild(chatboxHeader);
    chatbox.appendChild(chatboxContent);
    chatbox.appendChild(inputContainer);

    // Append the Sidekick icon and chatbox to the document body
    document.body.appendChild(sidekickIcon);
    document.body.appendChild(chatbox);

    // Toggle chatbox visibility when the icon is clicked
    sidekickIcon.addEventListener("click", () => {
        chatbox.style.display = chatbox.style.display === "none" ? "block" : "none";
    });

    // Make the chatbox draggable
    let isDragging = false;
    let offsetX, offsetY;

    chatboxHeader.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - chatbox.getBoundingClientRect().left;
        offsetY = e.clientY - chatbox.getBoundingClientRect().top;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            chatbox.style.left = `${e.clientX - offsetX}px`;
            chatbox.style.top = `${e.clientY - offsetY}px`;
            chatbox.style.bottom = "auto";
            chatbox.style.right = "auto";
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    // Handle the "Send" button click
    sendButton.addEventListener("click", () => {
        const message = inputField.value.trim();
        if (message) {
            // Add the message to the chatbox
            const userMessage = document.createElement("div");
            userMessage.style.marginBottom = "10px";
            userMessage.style.padding = "8px";
            userMessage.style.backgroundColor = "#f1f1f1";
            userMessage.style.borderRadius = "5px";
            userMessage.innerText = message;
            chatboxContent.appendChild(userMessage);

            // Clear the input field
            inputField.value = "";
        }
    });

    // Allow the user to press Enter to send the message
    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendButton.click();
        }
    });
}


//////////////////////////////////////////////// GOOGLE DOCS API /////////////////////////////////////////////////////
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getAuthToken") {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          console.error("Error getting auth token:", chrome.runtime.lastError);
          sendResponse({ error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ token: token });
        }
      });
      // Return true to indicate that we wish to send a response asynchronously.
      return true;
    }
  });
