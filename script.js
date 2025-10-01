const foldingMechanism = document.getElementById('folding-mechanism');
const leftCanvas = document.getElementById('left-side').querySelector('canvas');
const rightCanvas = document.getElementById('right-side').querySelector('canvas');
const pdfUrl = 'document.pdf'; // <-- IMPORTANT: Change this to your PDF file path!

let pdfDoc = null; // Stores the PDF document object once loaded
let currentPageIndex = 1; // Tracks the first page of the current 4-page spread (must be 1, 5, 9, etc.)

// -----------------------------------------------------------------
// A. PDF Rendering Functions
// -----------------------------------------------------------------

// Renders a single PDF page onto a single HTML Canvas
function renderPageToCanvas(pdf, pageNum, canvas) {
    pdf.getPage(pageNum).then(function(page) {
        let viewport = page.getViewport({ scale: 1.5 });
        
        // Ensure the canvas size matches the page aspect ratio
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
        };
        page.render(renderContext);
    }).catch(function(error) {
        console.error('Error rendering page ' + pageNum + ':', error);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    });
}

// Loads the PDF and initializes the first spread
function loadPdf(url) {
    // Set up PDF.js worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
    
    pdfjsLib.getDocument(url).promise.then(function(pdf) {
        pdfDoc = pdf;
        // Start rendering the first spread (Pages 1, 2, 3, 4)
        updateContent(); 
    }).catch(function(error) {
        console.error('Error loading PDF:', error);
        alert('Could not load PDF document.');
    });
}


// -----------------------------------------------------------------
// B. Content Update & Folding Logic
// -----------------------------------------------------------------

// Updates the canvas content for the current spread
function updateContent() {
    if (!pdfDoc) return;

    // This is the core logic for the 4-page spread:
    // Left Canvas (Inner Left): Renders currentPageIndex + 1
    // Right Canvas (Inner Right): Renders currentPageIndex + 2
    
    // We render the Inner Spread (N+1 and N+2) onto the visible side
    renderPageToCanvas(pdfDoc, currentPageIndex + 1, leftCanvas);
    renderPageToCanvas(pdfDoc, currentPageIndex + 2, rightCanvas);
    
    // NOTE: The outer pages (N and N+3) are rendered onto the BACK 
    // faces of the canvases. That complex part is for later. 
}

function nextSpread() {
    if (!pdfDoc || currentPageIndex + 4 > pdfDoc.numPages) {
        console.log("End of document or not loaded.");
        return;
    }
    
    // 1. Start the flip animation
    foldingMechanism.classList.add('folded');
    
    // 2. Increment the page index for the NEXT spread
    currentPageIndex += 4; 
    
    // 3. After the animation completes (1s transition in CSS),
    //    update the content to the new pages (N+4, N+5)
    setTimeout(() => {
        updateContent(); 
        
        // 4. Remove the 'folded' class to prepare for the next flip
        foldingMechanism.classList.remove('folded');
        
        // --- COMPLEX PART: ---
        // You would normally wait for the pages to render, and then 
        // immediately rotate back 180 degrees here to hide the 'new' 
        // back side and show the 'new' front side.
        
    }, 1000); // Wait for the 1-second CSS transition
}

// Start the application by loading the PDF
window.onload = function() {
    loadPdf(pdfUrl);
};
