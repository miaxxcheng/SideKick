const API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with actual OpenAI API key
const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function sendMessageToOpenAI(userMessage) {
    const requestBody = {
        model: "gpt-3.5-turbo",  
        messages: [{ role: "user", content: userMessage }],
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
}