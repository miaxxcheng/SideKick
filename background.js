// Authenticate the user and get an OAuth token
function authenticateUser(callback) {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
            console.error("Authentication error:", chrome.runtime.lastError);
            return;
        }
        callback(token);
    });
}

// Fetch a list of Google Docs
// function listGoogleDocs(token) {
//     fetch("https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.document'", {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             console.log("Documents List:", data.files); // Output document list
//             if (data.files && data.files.length > 0) {
//                 // Fetch content of the first document
//                 fetchGoogleDocContent(data.files[0].id, token);
//             } else {
//                 console.log("No Google Docs found.");
//             }
//         })
//         .catch((error) => {
//             console.error("Error fetching documents:", error);
//         });
// }

// Fetch content of a specific Google Doc
function fetchGoogleDocContent(docId, token) {
    fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Google Doc Content:", parseDocumentContent(data));
        })
        .catch((error) => {
            console.error("Error fetching Google Doc:", error);
        });
}

// Parse Google Doc content into plain text
function parseDocumentContent(docData) {
    const content = [];
    const bodyElements = docData.body.content;
    bodyElements.forEach((element) => {
        if (element.paragraph && element.paragraph.elements) {
            element.paragraph.elements.forEach((e) => {
                if (e.textRun) {
                    content.push(e.textRun.content);
                }
            });
        }
    });
    return content.join("");
}

// Main workflow
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed. Starting workflow...");
    authenticateUser((token) => {
        listGoogleDocs(token);
    });
});
