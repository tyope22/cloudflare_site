import json
import re
import os

def convert_to_json(input_file_path, output_file_path):
    """
    Reads the raw file, cleans it, and converts the couplets into a
    JSON array of strings, ensuring proper formatting.
    """
    couplets_list = []

    try:
        # 1. Input File Check
        if not os.path.exists(input_file_path):
            print(f"Error: Input file not found at '{input_file_path}'.")
            print("Please make sure your raw text file is named 'raw_shayari.txt' and is in the same folder.")
            return

        with open(input_file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 2. Aggressively clean and normalize the content
        
        # Remove all shayari numbers (e.g., "1. ", "481. ")
        content = re.sub(r'^\s*\d+\.\s*', '', content, flags=re.MULTILINE)
        
        # Remove source tags (e.g., "[source: 162]")
        content = re.sub(r'\s*\[source: \d+\]\s*', '', content)
        
        # Remove residual commas, periods, or other punctuation at the end of lines
        content = re.sub(r'[,\.;\s]+$', '', content, flags=re.MULTILINE)
        
        # Replace multiple newlines with a single newline to ensure consistent line separation
        content = re.sub(r'\n{2,}', '\n', content)

        # 3. Process the cleaned content line-by-line
        
        # Split the entire cleaned content into individual lines, removing blank lines
        lines = [line.strip() for line in content.split('\n') if line.strip()]
        
        # 4. Force Grouping: Assume every two sequential non-empty lines form one couplet
        for i in range(0, len(lines), 2):
            if i + 1 < len(lines):
                line1 = lines[i]
                line2 = lines[i+1]
                
                # Combine the two lines with the JSON-safe escaped newline character ('\n')
                formatted_couplet = f"{line1}\\n{line2}"
                couplets_list.append(formatted_couplet)


        # 5. Write the final list to the JSON file
        with open(output_file_path, 'w', encoding='utf-8') as f:
            # indent=4 is used here to make the JSON readable, but we will remove it later
            json.dump(couplets_list, f, indent=4, ensure_ascii=False)

        print(f"\n✅ SUCCESS: Converted {len(couplets_list)} couplets to '{output_file_path}'")
        print("Now, run 'python3 deduplicator.py' to remove duplicates.")

    except Exception as e:
        print(f"\n❌ An unexpected error occurred: {e}")

# --- Configuration ---
INPUT_FILE = 'raw_shayari.txt'
OUTPUT_FILE = 'shayari_data.json'

# --- Run the script ---
if __name__ == '__main__':
    convert_to_json(INPUT_FILE, OUTPUT_FILE)
