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

# Parse and mark corrections
def mark_corrections(sentence, matches):
    marked_sentence = sentence
    offset_correction = 0  # To account for text length changes when adding markers
    for match in matches:
        offset = match["offset"] + offset_correction
        length = match["length"]
        if match["replacements"]:
            # Take the first suggested replacement
            replacement = match["replacements"][0]["value"]
            incorrect_word = sentence[match["offset"]:match["offset"] + length]
            
            # Mark the incorrect word with `~~` and add the replacement in parentheses
            marked = f"(~{incorrect_word}~) {replacement}"
            marked_sentence = (
                marked_sentence[:offset] + marked + marked_sentence[offset + length:]
            )
            # Update offset_correction to handle added markers and replacement length
            offset_correction += len(marked) - length
    return marked_sentence

if response_data.get("matches"):
    marked_sentence = mark_corrections(original_sentence, response_data["matches"])
    print(f"Original: {original_sentence}")
    print(f"Marked: {marked_sentence}")
else:
    print("No corrections needed.")
