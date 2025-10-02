import json
import os

def correct_newline_escaping(file_path):
    """
    Reads the JSON file and corrects the escaping, replacing the double-escaped 
    '\\n' (which displays as text) with the single, literal '\n' 
    (which breaks the line for front-ends using white-space: pre-wrap).
    """
    try:
        if not os.path.exists(file_path):
            print(f"❌ Error: The file '{file_path}' was not found.")
            print("Please make sure 'shayari_data.json' is in the same folder.")
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            # Load the data (it currently has the visible \\n)
            data = json.load(f)

        # 1. Perform the correction for every couplet
        fixed_couplets = []
        for couplet in data:
            # We explicitly replace the string '\\n' with the string '\n'
            # Python interprets the original '\\n' as a literal backslash followed by 'n'.
            # We tell it to replace that literal string with the actual newline character.
            fixed_couplet = couplet.replace('\\n', '\n')
            fixed_couplets.append(fixed_couplet)

        # 2. Overwrite the file with the new, fixed data
        with open(file_path, 'w', encoding='utf-8') as f:
            # We must use ensure_ascii=False and indent=4 here to match your working file structure
            # Indent 4 makes it easier to confirm the fix manually.
            json.dump(fixed_couplets, f, indent=4, ensure_ascii=False)

        print(f"\n✅ SUCCESS: Corrected newline escaping in {len(fixed_couplets)} couplets.")
        print("Your data file is now in the exact format your website requires!")
        print("Please review 'shayari_data.json' and then upload it to GitHub.")

    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")

# --- Configuration ---
JSON_FILE = 'shayari_data.json'

# --- Run the script ---
if __name__ == '__main__':
    correct_newline_escaping(JSON_FILE)
