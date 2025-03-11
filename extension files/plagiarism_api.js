// plagiarism_api.js
// Function to check plagiarism using PrePostSEO API

async function checkPlagiarism(text) {
    const url = "https://www.prepostseo.com/apis/checkPlag";
    
    // Replace with your actual PrePostSEO API key
    const key = "52350533a17336b15b3194444c8a3c3278ef3438"; 
    
    // Create the form data according to PrePostSEO docs
    const formData = new URLSearchParams();
    formData.append("key", key);
    formData.append("data", text);
    
    try {
      console.log("Making plagiarism check request to PrePostSEO...");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Plagiarism API Response:", data);
      return data;
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      return { error: error.message };
    }
  }
  
  // Function to format the plagiarism report as a human-readable string
  function formatPlagiarismReport(data) {
    if (!data || data.error) {
      return `Error: ${data.error || "Unknown error occurred"}`;
    }
    
    // Handle error responses from the API
    if (data.status && data.status !== 200) {
      return `API Error: ${data.message || "Unknown API error"}`;
    }
  
    // Format according to PrePostSEO API response structure
    const plagPercent = data.plagPercent || 0;
    const uniquePercent = 100 - plagPercent;
    const sources = data.sources || [];
    
    let report = `📊 Plagiarism Check Results:\n\n`;
    report += `Overall originality score: ${uniquePercent}% (${plagPercent}% similar to existing content)\n\n`;
    
    if (sources.length === 0) {
      report += "No matching sources found. The content appears to be original.";
    } else {
      report += `${sources.length} matching sources found:\n\n`;
      sources.slice(0, 5).forEach((source, index) => {
        report += `${index + 1}. ${source.url}\n`;
        report += ` Similarity: ${source.percent}%\n`;
        if (source.matchedSentences && source.matchedSentences.length > 0) {
          report += ` Sample match: "${source.matchedSentences[0].substring(0, 50)}..."\n\n`;
        }
      });
      
      if (sources.length > 5) {
        report += `\n...and ${sources.length - 5} more sources.`;
      }
    }
    
    return report;
  }
  
  // Function to run the plagiarism check on the provided text
  async function runPlagiarismCheck(text) {
    try {
      // Call the plagiarism API
      const plagiarismResult = await checkPlagiarism(text);
      
      if (plagiarismResult.error) {
        return { error: plagiarismResult.error };
      }
      
      // Format the plagiarism report
      const report = formatPlagiarismReport(plagiarismResult);
      return { success: true, report: report };
    } catch (error) {
      console.error("Error during plagiarism check:", error);
      return { error: error.message };
    }
  }
  
  // No module.exports - instead make the functions globally available
  // The browser will use these functions directly