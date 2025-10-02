import json
import os

def remove_duplicates(file_path):
    """Loads the JSON, converts it to a set to remove duplicates, and saves it back."""
    
    try:
        # 1. Load the data
        if not os.path.exists(file_path):
            print(f"❌ Error: The file '{file_path}' was not found.")
            print("Please run 'python3 formatter.py' first to create this file.")
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 2. Use a set to automatically remove all duplicates
        original_count = len(data)
        unique_couplets = sorted(list(set(data))) 
        
        # 3. Overwrite the file with only unique entries
        with open(file_path, 'w', encoding='utf-8') as f:
            # We remove the indent here to make the final file compact for web use
            json.dump(unique_couplets, f, indent=None, ensure_ascii=False)

        print(f"\n✅ SUCCESS: Duplicate removal complete for '{file_path}'")
        print(f"Original Count (before): {original_count} couplets")
        print(f"New Unique Count (after): {len(unique_couplets)} couplets")
        print("\nYour file is now perfectly clean and ready to upload to GitHub!")

    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")

# --- Configuration ---
JSON_FILE = 'shayari_data.json'

# --- Run the script ---
if __name__ == '__main__':
    remove_duplicates(JSON_FILE)
