// Get the main element that will handle the rotation
const foldingMechanism = document.getElementById('folding-mechanism');

// Variable to track the current state of the card
let isFlipped = false;

function nextSpread() {
    // 1. Toggle the visual flip state
    isFlipped = !isFlipped;
    
    if (isFlipped) {
        // If it's time to flip (e.g., viewing pages 3 & 4), 
        // add the 'folded' class to trigger the CSS rotation
        foldingMechanism.classList.add('folded');
        
        // --- ANIMATION TIMING ---
        // This is where the magic happens:
        // After the 1s CSS transition (defined in style.css) finishes,
        // we update the content to the next spread (Page N+3 & N+4).
        setTimeout(updateContent, 1000); 
        
    } else {
        // If it's time to flip back (e.g., returning to pages 1 & 2)
        foldingMechanism.classList.remove('folded');
        
        // No need to delay content update on the way back, but you 
        // might need to adjust this depending on your final PDF logic.
    }
}

// Placeholder function for the final PDF content update
// This will become the most complex function later.
function updateContent() {
    console.log("Content should be updated now. Pages N and N+3 would become visible.");
    // In the future, this is where PDF.js will change the canvas content.
    // For now, let's just log a message or change text.
    document.getElementById('left-side').innerHTML = isFlipped ? "NEW INNER LEFT" : "INNER LEFT";
    document.getElementById('right-side').innerHTML = isFlipped ? "NEW INNER RIGHT" : "INNER RIGHT";
}
