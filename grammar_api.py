import requests

url = "https://grammarbot.p.rapidapi.com/check"

payload = {
    "text": "Susan go to the store everyday",
    "language": "en-US"
}
headers = {
    "x-rapidapi-key": "0cb2930a76msh10059237f198ed3p128558jsn3478cd254751",
    "x-rapidapi-host": "grammarbot.p.rapidapi.com",
    "Content-Type": "application/x-www-form-urlencoded"
}

response = requests.post(url, data=payload, headers=headers)
response_data = response.json()

# Extract original sentence
original_sentence = payload["text"]

# Parse and apply corrections
def apply_corrections(sentence, matches):
    corrected_sentence = sentence
    offset_correction = 0  # To account for text length changes
    for match in matches:
        offset = match["offset"] + offset_correction
        length = match["length"]
        if match["replacements"]:
            # Take the first suggested replacement
            replacement = match["replacements"][0]["value"]
            corrected_sentence = (
                corrected_sentence[:offset] + replacement + corrected_sentence[offset + length:]
            )
            # Update offset_correction to handle length changes
            offset_correction += len(replacement) - length
    return corrected_sentence

if response_data.get("matches"):
    corrected_sentence = apply_corrections(original_sentence, response_data["matches"])
    print(f"Original: {original_sentence}")
    print(f"Corrected: {corrected_sentence}")
else:
    print("No corrections needed.")
