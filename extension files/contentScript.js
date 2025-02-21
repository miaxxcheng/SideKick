console.log("Content script loaded on:", window.location.href);
let docinfo = "";

(function () {
  // Check if the Sidekick icon already exists to prevent duplication
  if (document.getElementById("sidekick-icon")) return;

  // Create the Sidekick icon and chatbox (same as before)
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

  const chatboxHeader = document.createElement("div");
  chatboxHeader.style.backgroundColor = "#6200ea";
  chatboxHeader.style.color = "white";
  chatboxHeader.style.padding = "10px";
  chatboxHeader.style.borderTopLeftRadius = "10px";
  chatboxHeader.style.borderTopRightRadius = "10px";
  chatboxHeader.style.cursor = "move";
  chatboxHeader.innerText = "Sidekick Chat";

  const chatboxContent = document.createElement("div");
  chatboxContent.style.padding = "10px";
  chatboxContent.style.height = "calc(100% - 90px)";
  chatboxContent.style.overflowY = "auto";
  chatboxContent.innerText = "Hello! How can I help you today?";

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

  const clearButton = document.createElement("button");
  clearButton.innerText = "Clear Chat";
  clearButton.style.backgroundColor = "transparent";
  clearButton.style.borderWidth = "1px";
  clearButton.style.borderColor = "white";
  clearButton.style.color = "white";
  clearButton.style.cursor = "pointer";
  clearButton.style.fontSize = "12px";
  clearButton.style.padding = "4px 8px";
  clearButton.style.borderRadius = "4px";
  clearButton.style.position = "absolute"; 
  clearButton.style.right = "45px";
  clearButton.style.top = "5px";

  const settingsButton = document.createElement("button");
  settingsButton.innerText = "⚙️"; 
  settingsButton.style.backgroundColor = "transparent";
  settingsButton.style.border = "none";
  settingsButton.style.color = "white";
  settingsButton.style.cursor = "pointer";
  settingsButton.style.fontSize = "16px";
  settingsButton.style.position = "absolute";
  settingsButton.style.right = "10px"; 
  settingsButton.style.top = "5px";


  const settingsPanel = document.createElement("div");
  settingsPanel.id = "settings-panel";
  settingsPanel.style.position = "absolute";
  settingsPanel.style.top = "35px";
  settingsPanel.style.left = "0";
  settingsPanel.style.width = "calc(100%-20px)";
  settingsPanel.style.height = "calc(100% - 35px)";
  settingsPanel.style.border = "1px solid #ccc";
  settingsPanel.style.borderRadius = "10px";
  settingsPanel.style.backgroundColor = "white";
  settingsPanel.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  settingsPanel.style.zIndex = "1000";
  settingsPanel.style.display = "none";
  settingsPanel.style.padding = "10px";
  // settingsPanel.style.overflowY = "auto"; // Add scroll if content overflows

  // Genre input field
  const genreLabel = document.createElement("label");
  genreLabel.innerText = "Genre:";
  genreLabel.style.display = "block";
  genreLabel.style.marginBottom = "5px";

  const genreInput = document.createElement("input");
  genreInput.type = "text";
  genreInput.style.width = "90%";
  genreInput.style.padding = "8px";
  genreInput.style.borderRadius = "5px";
  genreInput.style.border = "1px solid #ccc";

  // Slider for AI commenting behavior
  const sliderLabel = document.createElement("label");
  sliderLabel.innerText = "AI Commenting Behavior:";
  sliderLabel.style.display = "block";
  sliderLabel.style.marginTop = "10px";
  sliderLabel.style.marginBottom = "5px";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "100";
  slider.value = "50";
  slider.style.width = "90%";

  // Save button for settings
  const saveButton = document.createElement("button");
  saveButton.innerText = "Save";
  saveButton.style.marginTop = "10px";
  saveButton.style.padding = "8px 16px";
  saveButton.style.backgroundColor = "#6200ea";
  saveButton.style.color = "white";
  saveButton.style.border = "none";
  saveButton.style.borderRadius = "5px";
  saveButton.style.cursor = "pointer";
  //Cancel button for settings
  const cancelButton = document.createElement("button");
  cancelButton.innerText = "Cancel";
  cancelButton.style.marginTop = "10px";
  cancelButton.style.padding = "8px 16px";
  cancelButton.style.backgroundColor = "#ccc";
  cancelButton.style.color = "black";
  cancelButton.style.border = "none";
  cancelButton.style.borderRadius = "5px";
  cancelButton.style.cursor = "pointer";
  cancelButton.style.marginLeft = "10px";

  // Append elements to the settings panel
  settingsPanel.appendChild(genreLabel);
  settingsPanel.appendChild(genreInput);
  settingsPanel.appendChild(sliderLabel);
  settingsPanel.appendChild(slider);
  settingsPanel.appendChild(saveButton);
  settingsPanel.appendChild(cancelButton);

  chatboxHeader.appendChild(settingsButton);
  chatboxHeader.appendChild(clearButton);

  inputContainer.appendChild(inputField);
  inputContainer.appendChild(sendButton);

  chatbox.appendChild(chatboxHeader);
  chatbox.appendChild(chatboxContent);
  chatbox.appendChild(inputContainer);
  chatbox.appendChild(settingsPanel);

  document.body.appendChild(sidekickIcon);
  document.body.appendChild(chatbox);
 

  

  // Toggle chatbox visibility
  sidekickIcon.addEventListener("click", () => {
    chatbox.style.display = chatbox.style.display === "none" ? "block" : "none";
  });
  // Toggle settings visibility
  settingsButton.addEventListener("click", () => {
    if (settingsPanel.style.display === "none") {
      chatboxContent.style.display = "none"; // Hide the chatbox content
      settingsPanel.style.display = "block"; // Show the settings panel

      // Reset the settings panel position to ensure it is visible
      settingsPanel.style.left = "0"; // Align to the left edge of the chatbox
      settingsPanel.style.top = "35px"; // Position below the header
      settingsPanel.style.width = "calc(100%-20px)"; // Take up the full width of the chatbox
      settingsPanel.style.height = "calc(100% - 35px)"; // Adjust height to fit the content area
    } else {
      chatboxContent.style.display = "block"; // Show the chatbox content
      settingsPanel.style.display = "none"; // Hide the settings panel
    }
  });

  clearButton.addEventListener("mouseenter", () => {
    clearButton.style.backgroundColor = "rgba(132, 0, 255, 0.2)";
  });
  clearButton.addEventListener("mouseleave", () => {
      clearButton.style.backgroundColor = "transparent";
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
  
    // Sync the settings panel position on initial drag
    const chatboxRect = chatbox.getBoundingClientRect();
    settingsPanel.style.left = `${chatboxRect.left}px`;
    settingsPanel.style.top = `${chatboxRect.top + 40}px`; // Adjust for the header height
  });

  function onMouseMove(e) {
    if (isDragging) {
      const chatboxRect = chatbox.getBoundingClientRect();
      chatbox.style.left = `${e.clientX - offsetX}px`;
      chatbox.style.top = `${e.clientY - offsetY}px`;
      chatbox.style.bottom = "auto";
      chatbox.style.right = "auto";
  
      // Sync the settings panel position
      settingsPanel.style.left = `${chatboxRect.left}px`;
      settingsPanel.style.top = `${chatboxRect.top + 40}px`; 
    }
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  saveButton.addEventListener("click", () => {
    const genre = genreInput.value.trim();
    const commentingBehavior = slider.value;

    chrome.storage.sync.set({ genre, commentingBehavior }, () => {
        console.log("Settings saved");
        settingsPanel.style.display = "none"; // Hide the settings panel after saving
    });
  });

  cancelButton.addEventListener("click", () => {
    settingsPanel.style.display = "none";
    // Optionally, reset any unsaved changes here
  });

  chrome.storage.sync.get(["genre", "commentingBehavior"], (data) => {
    if (data.genre) {
        genreInput.value = data.genre;
    }
    if (data.commentingBehavior) {
        slider.value = data.commentingBehavior;
    }
}); 

  // Handle the "Send" button click
  sendButton.addEventListener("click", async () => {
    const message = inputField.value.trim();
    if (message) {
      const userMessage = document.createElement("div");
      userMessage.style.marginBottom = "10px";
      userMessage.style.padding = "8px";
      userMessage.style.backgroundColor = "#f1f1f1";
      userMessage.style.borderRadius = "5px";
      userMessage.innerText = message;
      chatboxContent.appendChild(userMessage);

      inputField.value = "";

      // Extract the document ID from the URL.
      const documentId = extractDocumentId(window.location.href);
      if (!documentId) {
        console.error("Could not extract document ID from URL.");
        return;
      }

      // Ask the background service worker for an OAuth token.
      chrome.runtime.sendMessage({ action: "getAuthToken" }, async (response) => {
        if (response.error) {
          console.error("Error getting auth token:", response.error);
          return;
        }
        const token = response.token;

        // Read the document.
        const docinfo = await readGoogleDoc(documentId, token);
        console.log("docinfo", docinfo);

        const prompt = `With this background information: ${docinfo}, answer the following question: ${message}`;
        console.log(prompt);

        // Call OpenAI API
        const openAIResponse = await chrome.runtime.sendMessage({
          action: "callOpenAI",
          prompt: prompt
        });

        if (openAIResponse.error) {
          const errorMessage = document.createElement("div");
          errorMessage.style.marginBottom = "10px";
          errorMessage.style.padding = "8px";
          errorMessage.style.backgroundColor = "#ffebee";
          errorMessage.style.borderRadius = "5px";
          errorMessage.innerText = "Error: " + openAIResponse.error;
          chatboxContent.appendChild(errorMessage);
        } else {
          const aiMessage = document.createElement("div");
          aiMessage.style.marginBottom = "10px";
          aiMessage.style.padding = "8px";
          aiMessage.style.backgroundColor = "#e3f2fd";
          aiMessage.style.borderRadius = "5px";
          aiMessage.innerText = openAIResponse.response;
          chatboxContent.appendChild(aiMessage);

          saveConversation(documentId, message, openAIResponse.response, docinfo);

        }
      });
    }
  });

  function saveConversation(documentId, userMessage, aiResponse, docinfo) {
    chrome.storage.local.get([documentId], (result) => {
        const conversations = result[documentId] || [];
        conversations.push({
            userMessage,
            aiResponse,
            docinfo,
            timestamp: new Date().toISOString()
        });

        chrome.storage.local.set({ [documentId]: conversations }, () => {
            console.log("Conversation saved for document ID:", documentId);
        });
    });
  }


  function loadConversations(documentId) {
    chrome.storage.local.get([documentId], (result) => {
        const conversations = result[documentId] || [];
        if (conversations.length > 0) {
            conversations.forEach(convo => {
                const userMessage = document.createElement("div");
                userMessage.style.marginBottom = "10px";
                userMessage.style.padding = "8px";
                userMessage.style.backgroundColor = "#f1f1f1";
                userMessage.style.borderRadius = "5px";
                userMessage.innerText = convo.userMessage;
                chatboxContent.appendChild(userMessage);

                const aiMessage = document.createElement("div");
                aiMessage.style.marginBottom = "10px";
                aiMessage.style.padding = "8px";
                aiMessage.style.backgroundColor = "#e3f2fd";
                aiMessage.style.borderRadius = "5px";
                aiMessage.innerText = convo.aiResponse;
                chatboxContent.appendChild(aiMessage);
            });
        }
    });
  }

  // Call this function when the content script is initialized
  const documentId = extractDocumentId(window.location.href);
  if (documentId) {
      loadConversations(documentId);
  }

  function clearConversations(documentId) {
    chrome.storage.local.remove([documentId], () => {
        console.log("Conversations cleared for document ID:", documentId);
        chatboxContent.innerHTML = "Hello! How can I help you today?";
    });
  }


  clearButton.addEventListener("click", () => {
      const documentId = extractDocumentId(window.location.href);
      if (documentId) {
          clearConversations(documentId);
      }
  });
  chatboxHeader.appendChild(clearButton);

  // Allow Enter key to send message
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendButton.click();
    }
  });

  /**
   * Extracts the Google Doc ID from the URL.
   * Example URL: https://docs.google.com/document/d/XYZ123abcDEF456/edit
   */
  function extractDocumentId(url) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  }

  /**
   * Reads the Google Doc using the Docs API.
   */
  async function readGoogleDoc(documentId, token) {
    const url = `https://docs.googleapis.com/v1/documents/${documentId}`;
    try {
      const response = await fetch(url, {
        headers: new Headers({
          'Authorization': 'Bearer ' + token
        })
      });
      if (!response.ok) {
        throw new Error("Failed to fetch document. Status: " + response.status);
      }
      const data = await response.json();
      console.log("Fetched document data:", data);
      const parsed = extractText(data);
      docinfo = JSON.stringify(parsed, null, 2);
      console.log(docinfo);
      return docinfo;
    } catch (error) {
      console.error("Error reading document:", error);
    }
  }

  /**
   * Extracts text from the Google Doc content.
   */
  function extractText(doc) {
    let extractedText = [];

    if (doc.body && doc.body.content) {
      doc.body.content.forEach(element => {
        if (element.paragraph && element.paragraph.elements) {
          element.paragraph.elements.forEach(el => {
            if (el.textRun && el.textRun.content) {
              extractedText.push(el.textRun.content.trim());
            }
          });
        }
      });
    }

    return { text: extractedText.join("\n") }; // Convert to JSON format
  }
})();

//////////////////////////////////////////////// GOOGLE DOCS API /////////////////////////////////////////////////////

(function() {
    // Make sure we're running on a Google Doc page.
    if (window.location.href.indexOf("docs.google.com/document/d/") === -1) {
      return;
    }
  
    // Ask the background service worker for an OAuth token.
    chrome.runtime.sendMessage({ action: "getAuthToken" }, (response) => {
      if (response.error) {
        console.error("Error getting auth token:", response.error);
        return;
      }
      const token = response.token;
  
      // Extract the document ID from the URL.
      const documentId = extractDocumentId(window.location.href);
      if (!documentId) {
        console.error("Could not extract document ID from URL.");
        return;
      }
  
      // Read the document.
      readGoogleDoc(documentId, token);
  
      // Optionally, if you have a button or UI element to trigger an update,
      // hook it up to the update function. For example:
    //   const updateButton = document.getElementById("updateButton");
    //   if (updateButton) {
    //     updateButton.addEventListener("click", () => {
    //       updateGoogleDoc(documentId, token);
    //     });
    //   }
    });
  
    /**
     * Extracts the Google Doc ID from the URL.
     * Example URL: https://docs.google.com/document/d/XYZ123abcDEF456/edit
     */
    function extractDocumentId(url) {
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      return match ? match[1] : null;
    }
  
    /**
     * Reads the Google Doc using the Docs API.
     */
    
    function readGoogleDoc(documentId, token) {
      const url = `https://docs.googleapis.com/v1/documents/${documentId}`;
      fetch(url, {
        headers: new Headers({
          'Authorization': 'Bearer ' + token
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch document. Status: " + response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log("Fetched document data:", data);
          parsed = extractText(data)
          docinfo = JSON.stringify(parsed, null, 2);
          console.log(docinfo)

          return docinfo
          

          // You can now work with the document data (e.g., display title, content, etc.)
        })
        .catch(error => console.error("Error reading document:", error));
    }
  
    /**
     * Updates the Google Doc using the batchUpdate endpoint.
     */
    function updateGoogleDoc(documentId, token) {
      const url = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;
      const body = {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: "Hello from your Chrome Extension using Manifest V3!\n"
            }
          }
        ]
      };
  
      fetch(url, {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to update document. Status: " + response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log("Document updated successfully:", data);
        })
        .catch(error => console.error("Error updating document:", error));
    }
  })();

function extractText(doc) {
  let extractedText = [];

  if (doc.body && doc.body.content) {
      doc.body.content.forEach(element => {
          if (element.paragraph && element.paragraph.elements) {
              element.paragraph.elements.forEach(el => {
                  if (el.textRun && el.textRun.content) {
                      extractedText.push(el.textRun.content.trim());
                  }
              });
          }
      });
  }

  return { text: extractedText.join("\n") }; // Convert to JSON format
}
  