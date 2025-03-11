// Function to call GrammarBot API and get suggestions
async function checkGrammarAndMarkCorrections(text) {
    const url = "https://grammarbot.p.rapidapi.com/check";
    const headers = {
        "x-rapidapi-key": "0cb2930a76msh10059237f198ed3p128558jsn3478cd254751",
        "x-rapidapi-host": "grammarbot.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded",
    };
    const payload = new URLSearchParams({
        text: text,
        language: "en-US",
    });
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: payload,
        });
        const responseData = await response.json();
        
        // Convert API response to the format expected by your application
        const suggestions = responseData.matches.map(match => ({
            offset: match.offset,
            length: match.length,
            message: match.message || "Grammar issue detected",
            replacement: match.replacements && match.replacements.length > 0 
                ? match.replacements[0].value 
                : ""
        }));
        
        return suggestions;
    } catch (error) {
        console.error("Error with GrammarBot API:", error);
        return []; // Return empty array if the API fails
    }
}
// Function to check grammar and add comments in the "Edit" tab
async function handleGrammarSuggestions() {
    const textContainer = document.getElementById("edit-text");  // Assuming this is your Edit tab container
    const text = textContainer.innerText; // Grab the text from the "Edit" tab container
    
    const suggestions = await checkGrammarAndMarkCorrections(text);
    
    if (suggestions.length === 0) {
        alert("No grammar issues found!");
        return;
    }

    // Loop through the suggestions and add comments
    suggestions.forEach(suggestion => {
        const commentText = `Suggested Correction: ${suggestion.message}. Consider replacing with: "${suggestion.replacement}"`;

        // Call function to add comment at a specific offset in the "Edit" tab
        addCommentAtOffset(suggestion.offset, suggestion.length, commentText);
    });
}

// Function to add a comment at a specific offset within the text
function addCommentAtOffset(offset, length, commentText) {
    const textContainer = document.getElementById("edit-text");
    const textContent = textContainer.innerText;
    
    // Ensure you correctly split the text and insert the comment.
    const textBefore = textContent.slice(0, offset);
    const textAfter = textContent.slice(offset + length);

    // Update the text container with the comment inserted
    textContainer.innerHTML = `${textBefore}<span class="comment" title="${commentText}">[Comment]</span>${textAfter}`;
    
    // Optionally, add visual styling to highlight the comment
    const commentElement = document.querySelector(".comment");
    commentElement.style.backgroundColor = "yellow";  // Highlight with yellow
}



// Helper function to mark corrections in the text
async function processBatches(sentence, matches, batchSize) {
    let markedSentence = sentence;
    let offsetCorrection = 0; // To account for length changes due to markers

    for (let i = 0; i < matches.length; i += batchSize) {
        const batch = matches.slice(i, i + batchSize);  // Get the current batch of matches

        // Loop through each match in the current batch and apply the corrections
        for (let match of batch) {
            const offset = match.offset + offsetCorrection;
            const length = match.length;
            if (!match.replacements || match.replacements.length === 0) {
                console.warn(`No replacements found for match at offset ${match.offset}`);
                continue; // Skip this match
            }

            console.log(`Processing match at offset ${match.offset}:`, match); // Debugging match info

            if (match.replacements && match.replacements.length > 0) {
                const replacement = match.replacements[0].value; // First suggested replacement
                const incorrectWord = sentence.slice(match.offset, match.offset + length);

                // Debugging information
                console.log(`Incorrect Word: "${incorrectWord}", Replacement: "${replacement}"`);

                // Mark the incorrect word with `~~` and add the replacement in parentheses
                const marked = `~${incorrectWord}~ (${replacement})`;
                markedSentence =
                    markedSentence.slice(0, offset) +
                    marked +
                    markedSentence.slice(offset + length);

                // Update offsetCorrection for the added markers and replacement
                offsetCorrection += marked.length - length;
            } else {
                console.warn(`No replacements found for match at offset ${match.offset}`);
            }
        }

        // Wait for a minute before processing the next batch to avoid hitting the rate limit
        console.log(`Waiting for 1 minute before processing the next batch...`);
        await new Promise(resolve => setTimeout(resolve, 60000));  // 1 minute delay
    }

    return markedSentence;
}

// // Example usage
// (async () => {
//     const text = "Susan go to the store everyday. Eva ~getted~ (netted) of the train.";
//     const markedText = await checkGrammarAndMarkCorrections(text);

//     console.log("Original:", text);
//     console.log("Marked:", markedText);
// })();
