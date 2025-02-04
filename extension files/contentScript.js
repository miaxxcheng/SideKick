console.log("Content script loaded on:", window.location.href);

(function () {
    // Check if the Sidekick icon already exists to prevent duplication
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
    chatboxContent.style.height = "calc(100% - 40px)";
    chatboxContent.style.overflowY = "auto";
    chatboxContent.innerText = "Hello! How can I help you today?";

    chatbox.appendChild(chatboxHeader);
    chatbox.appendChild(chatboxContent);

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
  