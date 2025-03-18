# Sidekick: Your AI-Powered Writing Companion

Sidekick is a Chrome extension designed to bring the benefits of a collaborative writer’s room directly to an individual. It empowers writers to brainstorm ideas, refine plot structures, and enhance their stories—all without leaving their word editor.

With Sidekick, users can:
- Get real-time feedback on plot, characters, and themes.
- Receive grammar and spelling suggestions.
- Customize AI responses based on genre.
- Seamlessly switch between ideation and editing modes.

---

## Project Goals
Our goal with Sidekick is to enhance the creative process without interrupting the writer’s flow. The extension allows users to get helpful suggestions while writing, with the ability to activate or deactivate Sidekick at their discretion. 

We built Sidekick as a Chrome extension that:
- Integrates with Google Docs for seamless editing.
- Uses OpenAI and GrammarBot APIs to generate suggestions and corrections.
- Provides a messaging interface to interact with the AI.

---

## Key Features
✅ **Google Docs Integration** – Real-time text extraction and dynamic highlights.  
✅ **AI-Powered Suggestions** – Get structured responses and advice based on user input.  
✅ **Grammar and Spelling Corrections** – Receive potential grammar and spelling corrections.  
✅ **Customizable Responses** – Tailor AI suggestions by specifying genre preferences.  
✅ **Persistent Memory** – Maintain chat history tied to the document ID.  
✅ **Interactive UI** – Drag and move the interface as needed for a smoother experience.  

---

## Setup and Installation

### Prerequisites
- Google Chrome (latest version)
- Google account with Google Docs access
- Node.js and npm (optional for development)

---

### 1. Clone the Repository
```bash
git clone https://github.com/miaxxcheng/SideKick.git
cd SideKick
```

---

### 2. Load the Extension in Chrome
1. Open **Google Chrome**.
2. Go to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click on **Load unpacked**.
5. Select the `SideKick` folder you cloned.

---

### 3. Set Up Google API Credentials
To enable Google Docs integration:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and enable the **Google Docs API**.
3. Generate OAuth 2.0 credentials and download the JSON file.
4. Replace the contents of `credentials.json` in the project root with your credentials.

---

### 4. Set API Keys

Click on extensions in the top right corner of your chrome browser, then click on Sidekick. It will prompt you to input the API key, then click save and a pop up confirmation will appear.

OR 

Add your API keys to the `manifest.json` file:
```json
"permissions": [
  "https://docs.googleapis.com/",
  "activeTab",
  "storage"
],
"oauth2": {
  "client_id": "<YOUR_GOOGLE_CLIENT_ID>",
  "scopes": ["https://www.googleapis.com/auth/documents"]
}
```
Also, add your OpenAI and GrammarBot API keys in `config.js`:
```javascript
const OPENAI_API_KEY = "<YOUR_OPENAI_API_KEY>";
const GRAMMARBOT_API_KEY = "<YOUR_GRAMMARBOT_API_KEY>";
```

---

## How to Use Sidekick

1. Open a **Google Docs** document.
2. Click on the Sidekick icon in the Chrome toolbar.
3. Input API key
4. Click on the logo in the bottom right and use the interactive chat window to ask for:
    - Plot suggestions
    - Character development ideas
    - Grammar and spelling corrections
5. Enable or disable Sidekick as needed using the settings in the UI.
6. Enjoy a seamless, collaborative writing experience!

---

## Contributor Roles
- **Aditi Ram** – Google Docs API integration and real-time text highlighting.  
- **Arianna Montas** – Base Chrome extension setup, GrammarBot integration, and UI cleanup.  
- **Mia Cheng** – UI design and development, chat memory, and OpenAI API integration.  
- **Lucas Saidenberg** – OpenAI prompt engineering and response categorization.

---

## Troubleshooting
- If the extension doesn’t load, double-check that Developer Mode is enabled.
- Ensure that API keys are correctly configured in `config.js` and `manifest.json`.
- If suggestions are not generating, confirm that Google Docs permissions are granted.

---

Happy Writing! ✨
