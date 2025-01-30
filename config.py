import os
from dotenv import load_dotenv
load_dotenv()

CONFIG = {
    "gpt_model": "gpt-4o-2024-08-06",
    "temperature": 0.7,
    "max_retries": 3,
    "prompt_template": (
        "The user is writing a story. Based on this part of the story already written here {story_context}, answer the following message as a helpful writing assistant: {message}. "
        "specify the correct answer in this JSON format:\n\n"
        "{{"
        '  "question_part": "<string>" '
        "}}"
    ),
    "grammar_template": (
        "Here is the paragraph we are trying to check the grammar of {paragraph}."
        "Return the original grammar in this JSON format:\n\n"
        "{{"
        ' "is_error": "<yes|no>", '
        ' "corrected_sentence": "<string>",'
        "}}"
    )
}

API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    raise ValueError(
        "OPENAI_API_KEY is not set. Please set it as an environment variable."
    )
