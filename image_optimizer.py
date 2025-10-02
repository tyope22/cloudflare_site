from PIL import Image
import os
import shutil

# --- Configuration ---
# Target size based on your performance audit for the displayed dimensions
TARGET_SIZE = (256, 274) 

# IMPORTANT: The script will load this file, resize it, and then OVERWRITE it 
# with the new, optimized version.
INPUT_OUTPUT_FILENAME = "assets/optimized_rose.jpg" 

def optimize_image_in_place(file_path, size):
    """
    Loads an image, resizes it to the target size, and overwrites the original file.
    """
    temp_path = file_path + ".temp_resized"
    
    try:
        # 1. Ensure the assets directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # 2. Open the image
        print(f"Loading image from: {file_path}")
        img = Image.open(file_path)
        original_size = img.size
        
        # 3. Resize the image
        img_resized = img.resize(size, Image.Resampling.LANCZOS)
        
        # 4. Save the resized image to a temporary file
        img_resized.save(temp_path, format="JPEG", quality=85)
        
        # 5. Overwrite the original file
        shutil.move(temp_path, file_path)
        
        # 6. Report success
        print("-" * 40)
        print("✅ SUCCESS: Image optimization complete.")
        print(f"Original size: {original_size[0]}x{original_size[1]}")
        print(f"New size: {img_resized.size[0]}x{img_resized.size[1]}")
        print(f"File '{file_path}' has been OVERWRITTEN.")
        print("-" * 40)
        
    except FileNotFoundError:
        print(f"❌ ERROR: Input file not found at '{file_path}'.")
        print("Please ensure your original image is located at this path.")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")
        
    finally:
        # Clean up the temporary file if it still exists
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == "__main__":
    optimize_image_in_place(INPUT_OUTPUT_FILENAME, TARGET_SIZE)

# --------------------------------------------------------------------------------------
# INSTRUCTIONS:
# 1. Install required libraries: pip install Pillow
# 2. Ensure your original image is located at 'assets/optimized_rose.jpg'.
# 3. Run the script: python image_optimizer.py
# 4. The original file will be permanently replaced with the resized version. 
#    A backup of the original file is recommended before running!
# --------------------------------------------------------------------------------------

