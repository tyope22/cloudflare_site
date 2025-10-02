// =========================================================
// 1. VARIABLE DECLARATIONS (Using the new 4-canvas structure)
// =========================================================

const foldingMechanism = document.getElementById('folding-mechanism');

// Reference all four canvases by their specific face/page IDs
const page1Canvas = document.getElementById('page-1-canvas'); // Left Back (Cover)
const page2Canvas = document.getElementById('page-2-canvas'); // Left Front (Inner Left)
const page3Canvas = document.getElementById('page-3-canvas'); // Right Front (Inner Right)
const page4Canvas = document.getElementById('page-4-canvas'); // Right Back (Hidden Back)

const pdfUrl = 'Greeting_card.pdf'; // Corrected path/syntax
let pdfDoc = null; 
let currentPageIndex = 1; // Tracks the first page of the current 4-page spread (1, 5, 9, etc.)


// =========================================================
// A. PDF Rendering Functions (Updated to use dynamic scaling)
// =========================================================

// Renders a single PDF page onto a single HTML Canvas
function renderPageToCanvas(pdf, pageNum, canvas) {
    if (pageNum < 1 || pageNum > pdf.numPages) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        return Promise.resolve();
    }
    
    return pdf.getPage(pageNum).then(function(page) {
        
        // --- REVISED SCALING LOGIC ---
        // Get the dimensions of the parent element (the page-face div)
        const parentWidth = canvas.parentElement.clientWidth;
        
        // Use the parent's width to calculate the scale
        let viewport = page.getViewport({ scale: 1 });
        let scale = parentWidth / viewport.width;
        viewport = page.getViewport({ scale: scale });

        // Set canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
        };
        // Render the page and return the promise
        return page.render(renderContext).promise; 
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
        alert('Could not load PDF document. Check console for details.');
    });
}


// =========================================================
// B. Content Update & Folding Logic (The 4-Page Map)
// =========================================================

// Updates the canvas content for the current spread
function updateContent() {
    if (!pdfDoc) return;

    // Renders the 4 sequential pages for the current spread:
    // P1: Left Back (Cover) -> Visible when FLIPPED
    renderPageToCanvas(pdfDoc, currentPageIndex, page1Canvas); 
    
    // P2: Left Front (Inner Left) -> Visible INITIALLY
    renderPageToCanvas(pdfDoc, currentPageIndex + 1, page2Canvas);
    
    // P3: Right Front (Inner Right) -> Visible INITIALLY
    renderPageToCanvas(pdfDoc, currentPageIndex + 2, page3Canvas);
    
    // P4: Right Back (Hidden Back) -> Visible when FLIPPED
    renderPageToCanvas(pdfDoc, currentPageIndex + 3, page4Canvas);
}

function nextSpread() {
    // We need 4 pages for a spread, so check if N+4 pages are available
    if (!pdfDoc || currentPageIndex + 4 > pdfDoc.numPages) {
        console.log("End of document reached.");
        return;
    }
    
    // 1. Start the flip animation
    foldingMechanism.classList.add('folded');
    
    // 2. Increment the page index for the NEXT spread (1 -> 5, 5 -> 9)
    currentPageIndex += 4; 
    
    // 3. After the animation completes (1s transition in CSS),
    //    update the content to the new pages (N+4, N+5, N+6, N+7)
    setTimeout(() => {
        updateContent(); 
        
        // 4. Remove the 'folded' class to snap the view back to 0deg (unflipped) 
        //    This immediately shows the newly rendered content of the NEXT spread
        foldingMechanism.classList.remove('folded');
        
    }, 1000); // Wait for the 1-second CSS transition
}

// Start the application by loading the PDF
window.onload = function() {
    loadPdf(pdfUrl);
};
