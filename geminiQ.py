import os
from groq import Groq
from PyPDF2 import PdfReader

client = Groq(api_key="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")
# Parse PDF resume
def parse_resume(pdf_path):
    reader = PdfReader(pdf_path)
    resume_text = ""
    for page in reader.pages:
        resume_text += page.extract_text()
    return resume_text

# Read extracted messages from the file
def read_messages(messages_file):
    with open(messages_file, "r") as file:
        messages = file.read().split("\n---\n")  # Assuming "---" separates messages
    return messages

# Send data to Gemini Pro API and get response
def ask_llm(resume, message, question):
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": f"My Resume: {resume}\nMessage: {message}\nQuestion: {question}"}
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )
    response = ""
    for chunk in completion:
        response += chunk.choices[0].delta.content or ""
    return response

# Main script
def main():
    resume_path = "MB_CV_FINAL (1).pdf" # Replace with the path to your resume
    messages_file = "extracted_messages.txt"  # Replace with the path to your messages file
    output_file = "responses.txt"  # Output file to save responses
   
    
    
    question = "First check if there is mail id in job description if yes then generate a mail only as output and beneath a mail only nothing less, keeping job description in consideration give small detail of my research  research details are - Research Work: - Non-Invasive Anemia Detection Using Deep Learning: Achieved 96percent accuracy in classifying conjunctiva images.  - Integrating Deep Learning and Statistical Models for Stock Market Prediction: Accepted at the 22nd OCIT-2024 conference and give details of my projects including ACTM from resume . everything should be in short mention resume attached with it. } if there is no mail id  then just give link only nothing less as output from job description if both mail and link is their than do above both"

    # Parse resume and messages
    resume = parse_resume(resume_path)
    messages = read_messages(messages_file)

    # Process each message and save responses
    with open(output_file, "w") as outfile:
        for i, message in enumerate(messages, 1):
            print(f"Processing message {i}/{len(messages)}...")
            response = ask_llm(resume, message, question)
            outfile.write(f"Response:\n{response}\n")
            outfile.write("\n" + "="*50 + "\n\n")

    print("All messages processed and responses saved to:", output_file)

if __name__ == "__main__":
    main()
