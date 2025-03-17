console.log("Content script loaded on:", window.location.href);
let docinfo = "";

(function () {
  // Check if the Sidekick icon already exists to prevent duplication
  if (document.getElementById("sidekick-icon")) return;

  const styleTag = document.createElement("style");
  styleTag.textContent = `
    #sidekick-text { font-family: 'Georgia', sans-serif; }
    #tab-text { font-family: 'Georgia', monospace; }

    #sidekick-chatbox {
      resize: both;
      overflow: auto;
      min-width: 300px;
      min-height: 400px;
      max-width: 600px;
      max-height: 800px;
    }
  `;
  document.head.appendChild(styleTag);

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
  chatboxHeader.id = "sidekick-text";
  chatboxHeader.style.backgroundColor = "#6200ea";
  chatboxHeader.style.color = "white";
  chatboxHeader.style.padding = "10px";
  chatboxHeader.style.borderTopLeftRadius = "10px";
  chatboxHeader.style.borderTopRightRadius = "10px";
  chatboxHeader.style.cursor = "move";
  chatboxHeader.innerText = "SIDEKICK";

  const chatboxContent = document.createElement("div");
  chatboxContent.style.padding = "20px";
  chatboxContent.style.height = "calc(100% - 140px)";
  chatboxContent.style.overflowY = "auto";
  chatboxContent.style.alignItems = "center"; 
  chatboxContent.style.justifyContent = "center"; 

  const firstMessage = document.createElement("div");
  firstMessage.innerText = "Hello, I'm Sidekick! How can I help you today?";
  firstMessage.style.textAlign = "center"; // Center this specific message
  firstMessage.style.marginTop = "5px"; // Add space below the tabs for cleaner layout
  firstMessage.style.padding = "10px 0"; // Add padding for better spacing



  // Input container and its elements
  const inputContainer = document.createElement("div");
  inputContainer.id = "input-container"; // Added ID for toggling
  inputContainer.style.position = "absolute";
  inputContainer.style.bottom = "10px";
  inputContainer.style.left = "10px";
  inputContainer.style.width = "calc(100% - 20px)";
  inputContainer.style.display = "flex";

  const inputField = document.createElement("input");
  inputField.id = "input-field"; // Added ID for toggling
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
  clearButton.innerText = "Clear Chat and History";
  clearButton.style.border = "none";
  clearButton.style.color = "white";
  clearButton.style.backgroundColor = "#6200ea";
  clearButton.style.cursor = "pointer";
  clearButton.style.fontSize = "12px";
  clearButton.style.position = "static";
  clearButton.style.margin = "10px 0 20px 0";
  clearButton.style.padding = "8px 16px";
  clearButton.style.borderRadius = "5px";

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

  // Settings panel contents
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

  const saveButton = document.createElement("button");
  saveButton.innerText = "Save";
  saveButton.style.marginTop = "10px";
  saveButton.style.padding = "8px 16px";
  saveButton.style.backgroundColor = "#6200ea";
  saveButton.style.color = "white";
  saveButton.style.border = "none";
  saveButton.style.borderRadius = "5px";
  saveButton.style.cursor = "pointer";

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
  settingsPanel.appendChild(clearButton);
  settingsPanel.appendChild(genreLabel);
  settingsPanel.appendChild(genreInput);
  settingsPanel.appendChild(sliderLabel);
  settingsPanel.appendChild(slider);
  settingsPanel.appendChild(saveButton);
  settingsPanel.appendChild(cancelButton);

  chatboxHeader.appendChild(settingsButton);

  inputContainer.appendChild(inputField);
  inputContainer.appendChild(sendButton);


  chatbox.appendChild(chatboxHeader);
  chatbox.appendChild(chatboxContent);
  chatbox.appendChild(inputContainer);
  chatbox.appendChild(settingsPanel);
  chatboxContent.appendChild(firstMessage);

  document.body.appendChild(sidekickIcon);
  document.body.appendChild(chatbox);
 
  // Create tab navigation bar
  const tabNav = document.createElement("div");
  tabNav.id = "tab-text";
  tabNav.style.display = "flex";
  tabNav.style.justifyContent = "space-around";
  tabNav.style.backgroundColor = "#320093";
  tabNav.style.color = "white";
  tabNav.style.padding = "5px 0";
  tabNav.style.cursor = "pointer";

  // Utility function for tab design
  function createTab(name, isActive) {
      const tab = document.createElement("div");
      tab.innerText = name;
      tab.style.flex = "1";
      tab.style.textAlign = "center";
      tab.style.padding = "10px";
      tab.style.borderRadius = "20px";
      tab.style.margin = "0 5px";
      tab.style.backgroundColor = isActive ? "#320093" : "#4b00c8";
      tab.style.borderBottom = isActive ? "3px solid white" : "3px solid transparent";
      return tab;
  }
  

  // Create tabs for "Ideate" (chat) and "Edit" (comments)
  const chatTab = createTab("IDEATE", true);
  const commentsTab = createTab("EDIT", false);

  // Default active tab styling on page load
  chatTab.style.backgroundColor = "#7a33ff"; 
  chatTab.style.borderBottom = "none"; 

  // Tab Switching Logic
  chatTab.addEventListener("click", () => {
      chatboxContent.style.display = "block";
      commentsPanel.style.display = "none";
      chatTab.style.backgroundColor = "#7a33ff";
      chatTab.style.borderBottom = "none";
      commentsTab.style.backgroundColor = "#320093";
      // Show the input container when in Ideate (chat) tab
      inputContainer.style.display = "flex";
  });

  commentsTab.addEventListener("click", () => {
      chatboxContent.style.display = "none";
      commentsPanel.style.display = "block";
      commentsTab.style.backgroundColor = "#7a33ff";
      commentsTab.style.borderBottom = "none";
      chatTab.style.backgroundColor = "#320093";
      // Hide the input container in Edit (comments) tab
      inputContainer.style.display = "none";
  });

  // Ensure no borders or gaps on content panels
  chatboxContent.style.margin = "0";
  chatboxContent.style.padding = "0";
  chatboxContent.style.border = "none";

  const commentsPanel = document.createElement("div");
  commentsPanel.id = "comments-panel";
  commentsPanel.style.padding = "10px";
  commentsPanel.style.height = "calc(100% - 90px)";
  commentsPanel.style.overflowY = "auto";
  commentsPanel.style.display = "none";

  // Append tabs and panels
  chatbox.appendChild(tabNav);
  tabNav.appendChild(chatTab);
  tabNav.appendChild(commentsTab);
  chatbox.appendChild(chatboxContent);
  chatbox.appendChild(commentsPanel);


commentsTab.addEventListener("click", async () => {
  chatboxContent.style.display = "none";
  commentsPanel.style.display = "block";
  commentsTab.style.backgroundColor = "#7a33ff";
  commentsTab.style.borderBottom = "none";
  chatTab.style.backgroundColor = "#320093";
  // Hide the input container in Edit (comments) tab
  inputContainer.style.display = "none";
  
  // Clear existing comments and run a new grammar check
  commentsPanel.innerHTML = '';
  await runGrammarCheck();
  // await performPlagiarismCheck();
});

// Function to run the grammar check on the current document text
async function runGrammarCheck() {
  const documentId = extractDocumentId(window.location.href);
  if (!documentId) {
    console.error("Could not extract document ID from URL.");
    return;
  }
  
  chrome.runtime.sendMessage({ action: "getAuthToken" }, async (response) => {
    if (response.error) {
      console.error("Error getting auth token:", response.error);
      return;
    }
    
    const token = response.token;
    
    try {
      // Get the document text
      const docData = await readGoogleDoc(documentId, token);
      const docObj = JSON.parse(docData);
      const text = docObj.text;
      
      // Call your grammar API to check the text
      const suggestions = await checkGrammarAndMarkCorrections(text);
      
      if (suggestions.length === 0) {
        injectCommentBox("No grammar issues found!");
        return;
      }
      
      // Add each suggestion as a comment
      suggestions.forEach(suggestion => {
        const commentText = `Grammar issue at "${text.substr(suggestion.offset, suggestion.length)}": ${suggestion.message}. Suggested replacement: "${suggestion.replacement}"`;
        injectCommentBox(commentText);
      });
      
    } catch (error) {
      console.error("Error during grammar check:", error);
      injectCommentBox("Error checking grammar: " + error.message);
    }
  });
}

  // // Make sure to call this function after creating your tabs
  // addGrammarCheckButton();


  // // Call this function when your UI loads or after creating the Edit tab
  // // For example, add it to your commentsTab click event
//   // commentsTab.addEventListener("click", async () => {
//   //   chatboxContent.style.display = "none";
//   //   commentsPanel.style.display = "block";
//   //   commentsTab.style.backgroundColor = "#7a33ff";
//   //   commentsTab.style.borderBottom = "none";
//   //   chatTab.style.backgroundColor = "#320093";
//   //   // Hide the input container in Edit (comments) tab
//   //   inputContainer.style.display = "none";
    
//   //   // Clear existing comments
//   //   commentsPanel.innerHTML = '';
    
//   //   // Add the grammar and plagiarism check buttons
//   //   addGrammarCheckButton(); // Your existing function
//   //   addPlagiarismCheckButton(); // The new function
//   // });

//   // In contentScript.js, modify the runPlagiarismCheck function:

// async function performPlagiarismCheck() {
//   const documentId = extractDocumentId(window.location.href);
//   if (!documentId) {
//       console.error("Could not extract document ID from URL.");
//       return;
//   }
  
//   chrome.runtime.sendMessage({ action: "getAuthToken" }, async (response) => {
//       if (response.error) {
//           console.error("Error getting auth token:", response.error);
//           return;
//       }
      
//       const token = response.token;
      
//       try {
//           // Get the document text
//           const docData = await readGoogleDoc(documentId, token);
//           const docObj = JSON.parse(docData);
//           const text = docObj.text;
          
//           // Show a loading message
//           const loadingMessage = injectCommentBox("Checking for plagiarism... This may take a moment.");
          
//           // Use the function from plagiarism_api.js
//           const result = await runPlagiarismCheck(text);
          
//           // Remove the loading message
//           if (loadingMessage && loadingMessage.parentNode) {
//               loadingMessage.remove();
//           }
          
//           if (result.error) {
//               injectCommentBox(`Error checking plagiarism: ${result.error}`);
//               return;
//           }
          
//           // Display the plagiarism report
//           injectCommentBox(result.report);
          
//       } catch (error) {
//           console.error("Error during plagiarism check:", error);
//           injectCommentBox("Error checking plagiarism: " + error.message);
//       }
//   });
// }

// You can remove your original checkPlagiarism and formatPlagiarismReport functions
// from contentScript.js as they're now in plagiarism_api.js











  // Toggle chatbox visibility on sidekick icon click
  sidekickIcon.addEventListener("click", () => {
    chatbox.style.display = chatbox.style.display === "none" ? "block" : "none";
  });

  // Toggle settings visibility
  settingsButton.addEventListener("click", () => {
    if (settingsPanel.style.display === "none") {
      chatboxContent.style.display = "none";
      settingsPanel.style.display = "block";
      settingsPanel.style.left = "0";
      settingsPanel.style.top = "35px";
      settingsPanel.style.width = "calc(100%-20px)";
      settingsPanel.style.height = "calc(100% - 35px)";
    } else {
      chatboxContent.style.display = "block";
      settingsPanel.style.display = "none";
    }
  });

  


// Create a function to inject the comment box into the comments tab
function injectCommentBox(commentText) {
  const commentBox = document.createElement('div');
  commentBox.style.position = 'relative';
  commentBox.style.width = '90%'; // Narrower width to prevent horizontal scroll
  commentBox.style.backgroundColor = '#e0e0e0'; // Same gray as chatbot comments
  commentBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
  commentBox.style.padding = '10px';
  commentBox.style.borderRadius = '5px';
  commentBox.style.marginBottom = '10px';
  commentBox.style.wordWrap = 'break-word'; // Ensure text doesn't overflow
  commentBox.style.display = 'inline-block'; // Shrinks to text size

  // Create a div to display the comment
  const commentTextElement = document.createElement('div');
  commentTextElement.style.fontSize = '14px';
  commentTextElement.innerText = commentText;

  // Add the comment to the comment box
  commentBox.appendChild(commentTextElement);

  // Create a small 'X' delete button
  const deleteButton = document.createElement('button');
  deleteButton.innerText = '✖';
  deleteButton.style.position = 'absolute';
  deleteButton.style.top = '5px';
  deleteButton.style.right = '5px';
  deleteButton.style.backgroundColor = 'transparent';
  deleteButton.style.border = 'none';
  deleteButton.style.color = '#ff4c4c'; // Red for visibility
  deleteButton.style.cursor = 'pointer';
  deleteButton.style.fontSize = '16px'; // Slightly larger 'X'

  deleteButton.addEventListener('click', () => {
      commentBox.remove(); // Remove the comment box when deleted
  });

  // Add delete button to the comment box
  commentBox.appendChild(deleteButton);

  // Append the comment box to the comments tab panel (assuming commentsPanel is the panel)
  const commentsPanel = document.getElementById('comments-panel'); // The container for comments
  if (commentsPanel) {
      commentsPanel.appendChild(commentBox);
  }
}




  clearButton.addEventListener("mouseenter", () => {
    clearButton.style.backgroundColor = "rgba(132, 0, 255, 0.2)";
  });
  clearButton.addEventListener("mouseleave", () => {
    clearButton.style.backgroundColor = "#6200ea";
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
  
    const chatboxRect = chatbox.getBoundingClientRect();
    settingsPanel.style.left = `${chatboxRect.left}px`;
    settingsPanel.style.top = `${chatboxRect.top + 40}px`;
  });

  function onMouseMove(e) {
    if (isDragging) {
      const chatboxRect = chatbox.getBoundingClientRect();
      chatbox.style.left = `${e.clientX - offsetX}px`;
      chatbox.style.top = `${e.clientY - offsetY}px`;
      chatbox.style.bottom = "auto";
      chatbox.style.right = "auto";
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
      settingsPanel.style.display = "none";
      chatboxContent.style.display = "block";
    });
  });

  cancelButton.addEventListener("click", () => {
    settingsPanel.style.display = "none";
  });

  chrome.storage.sync.get(["genre", "commentingBehavior"], (data) => {
    if (data.genre) {
      genreInput.value = data.genre;
    }
    if (data.commentingBehavior) {
      slider.value = data.commentingBehavior;
    }
  }); 

  // Handle the "Send" button click with a check to disable sending in Edit mode
  sendButton.addEventListener("click", async () => {
    // Prevent sending if inputContainer is hidden (i.e. in Edit mode)
    if (inputContainer.style.display === "none") return;

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

      const documentId = extractDocumentId(window.location.href);
      if (!documentId) {
        console.error("Could not extract document ID from URL.");
        return;
      }

      chrome.runtime.sendMessage({ action: "getAuthToken" }, async (response) => {
        if (response.error) {
          console.error("Error getting auth token:", response.error);
          return;
        }
        const token = response.token;
        const genre = genreInput.value.trim();

        const docinfo = await readGoogleDoc(documentId, token);
        console.log("docinfo", docinfo);
        const prompt = `This is the story so far: ${docinfo}. It is a ${genre} novel. Use this context to answer the following: ${message}.`;
        console.log(prompt);

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

  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendButton.click();
    }
  });

  function extractDocumentId(url) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  }

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
    return { text: extractedText.join("\n") };
  }
})();

//////////////////////////////////////////////// GOOGLE DOCS API /////////////////////////////////////////////////////

(function() {
  if (window.location.href.indexOf("docs.google.com/document/d/") === -1) {
    return;
  }
  
  chrome.runtime.sendMessage({ action: "getAuthToken" }, (response) => {
    if (response.error) {
      console.error("Error getting auth token:", response.error);
      return;
    }
    const token = response.token;
  
    const documentId = extractDocumentId(window.location.href);
    if (!documentId) {
      console.error("Could not extract document ID from URL.");
      return;
    }
  
    readGoogleDoc(documentId, token);
  });
  
  function extractDocumentId(url) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  }
  
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
        const parsed = extractText(data);
        docinfo = JSON.stringify(parsed, null, 2);
        console.log(docinfo);
        return docinfo;
      })
      .catch(error => console.error("Error reading document:", error));
  }
  
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
    return { text: extractedText.join("\n") };
  }

  

  

  
}



)();



