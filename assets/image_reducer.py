from PIL import Image
import os

# Set the correct filename
file_name = "Rosee.jpg" 
new_file_name = "optimized_rosee.jpg"

try:
    img = Image.open(file_name)
    
    # 1. (Optional) Resize if needed - check display size on your website first!
    # ... resize code here ...
    
    # 2. Compress (The core optimization for a JPEG)
    # Using quality=80 gives a great balance.
    img.save(new_file_name, "JPEG", quality=80, optimize=True)

    print(f"Rosee.jpg optimized successfully to {new_file_name}")
    
except FileNotFoundError:
    print(f"Error: The file {file_name} was not found.")
