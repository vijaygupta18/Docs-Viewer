// PDF.js initialization
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
let currentPDF = null;

async function loadPDF(url) {
    // This function is primarily for loading from URL if needed later, not used for uploads now
     console.log("Loading PDF from URL is not currently supported for uploaded files.");
}

async function loadPDFFromFile(file) {
    const viewerContainer = document.getElementById('pdfViewerContainer');
    const viewer = document.getElementById('pdfViewer');
    const placeholder = viewerContainer.querySelector('.viewer-placeholder');

    // Show loading state
    viewer.style.display = 'none';
    placeholder.innerText = 'Loading PDF...';
    placeholder.style.display = 'block';
    viewer.innerHTML = ''; // Clear previous PDF content

    try {
        const arrayBuffer = await file.arrayBuffer();
        if (currentPDF) {
            // Clean up previous PDF object to free memory
            // currentPDF.destroy(); // This method is deprecated/not always available in newer versions
            currentPDF = null; // Just nullify the reference
        }
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        currentPDF = await loadingTask.promise;

        // Render all pages
        for (let pageNum = 1; pageNum <= currentPDF.numPages; pageNum++) {
            const page = await currentPDF.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 }); // Increased scale for better viewing
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Calculate canvas size based on viewport and device pixel ratio
            const outputScale = window.devicePixelRatio || 1;
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.style.width = Math.floor(viewport.width) + 'px';
            canvas.style.height = Math.floor(viewport.height) + 'px';

            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

            await page.render({
                canvasContext: context,
                viewport: viewport,
                 transform: transform
            }).promise;

            viewer.appendChild(canvas);

             // Clean up page resources
             page.cleanup();
        }

        // Hide loading state, show viewer
        placeholder.style.display = 'none';
        viewer.style.display = 'block';

    } catch (error) {
        console.error("Error loading PDF:", error);
        placeholder.innerText = 'Error loading PDF. Please try another file.';
        viewer.style.display = 'none';
    }
}

// Google Docs & Sheets
function loadGoogleDoc(url) {
    const embedContainer = document.getElementById('gdocEmbedContainer');
    const iframe = document.getElementById('gdocEmbed');
     const placeholder = embedContainer.querySelector('.viewer-placeholder');

    if (url) {
        // Show loading state
        iframe.style.display = 'none';
        placeholder.innerText = 'Loading Google Doc...';
         placeholder.style.display = 'block';

        iframe.src = url;
         const fileItem = document.createElement('li'); // Use li for file list
        fileItem.className = 'file-item';
        // Attempt to extract a meaningful title or use a truncated URL
        let title = url; // Start with full URL
        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            title = params.get('title') || urlObj.pathname.split('/').pop() || url;
             // Truncate if necessary
            if (title.length > 50) {
                title = title.substring(0, 50) + '...';
            }
         } catch (e) {
             console.error("Error parsing URL:", e);
             title = url.substring(0, 50) + '...'; // Fallback to truncated URL
         }

        fileItem.innerHTML = `<i class="fa-solid fa-file-word me-2 text-primary"></i> ${title}`; // Display extracted title or truncated URL
         fileItem.onclick = () => loadGoogleDoc(url); // Add click to reload functionality
        document.getElementById('gdocFileList').appendChild(fileItem);

         // Hide placeholder and show iframe when loaded (using load event)
         iframe.onload = () => {
             placeholder.style.display = 'none';
             iframe.style.display = 'block';
             iframe.onload = null; // Remove handler after load
         };

         iframe.onerror = () => {
              console.error("Error loading Google Doc iframe.");
              placeholder.innerText = "Error loading Google Doc. Ensure the URL is correct and publicly accessible.";
              iframe.style.display = 'none';
               iframe.onload = null; // Remove handler
         };

    } else {
         // Show initial placeholder if URL is empty
         placeholder.innerText = 'Paste a public Google Doc embed URL to view/edit';
         placeholder.style.display = 'block';
         iframe.style.display = 'none';
    }
}

function loadGoogleSheet(url) {
     const embedContainer = document.getElementById('gsheetEmbedContainer');
     const iframe = document.getElementById('gsheetEmbed');
     const placeholder = embedContainer.querySelector('.viewer-placeholder');

     if (url) {
         // Show loading state
         iframe.style.display = 'none';
         placeholder.innerText = 'Loading Google Sheet...';
         placeholder.style.display = 'block';

        iframe.src = url;
         const fileItem = document.createElement('li'); // Use li for file list
        fileItem.className = 'file-item';
         // Attempt to extract a meaningful title or use a truncated URL
        let title = url; // Start with full URL
         try {
            const urlObj = new URL(url);
             const params = new URLSearchParams(urlObj.search);
            title = params.get('title') || urlObj.pathname.split('/').pop() || url;
            // Truncate if necessary
            if (title.length > 50) {
                title = title.substring(0, 50) + '...';
            }
         } catch (e) {
             console.error("Error parsing URL:", e);
             title = url.substring(0, 50) + '...'; // Fallback to truncated URL
         }

        fileItem.innerHTML = `<i class="fa-solid fa-file-excel me-2 text-success"></i> ${title}`; // Display extracted title or truncated URL
         fileItem.onclick = () => loadGoogleSheet(url); // Add click to reload functionality
        document.getElementById('gsheetFileList').appendChild(fileItem);

         // Hide placeholder and show iframe when loaded (using load event)
         iframe.onload = () => {
             placeholder.style.display = 'none';
             iframe.style.display = 'block';
             iframe.onload = null; // Remove handler after load
         };
         iframe.onerror = () => {
              console.error("Error loading Google Sheet iframe.");
              placeholder.innerText = "Error loading Google Sheet. Ensure the URL is correct and publicly accessible.";
              iframe.style.display = 'none';
               iframe.onload = null; // Remove handler
         };

    } else {
         // Show initial placeholder if URL is empty
         placeholder.innerText = 'Paste a public Google Sheet embed URL to view/edit';
         placeholder.style.display = 'block';
         iframe.style.display = 'none';
    }
}

// CSV Handling with Handsontable
let csvTable = null;
let currentCSVData = null;
let currentCSVFileName = ''; // Store filename instead of URL

function loadCSV(url) {
     // This function is primarily for loading from URL if needed later, not used for uploads now
     console.log("Loading CSV from URL is not currently supported for uploaded files.");
}

function loadCSVFromFile(file) {
    currentCSVFileName = file.name;
    const editorContainer = document.getElementById('csvEditorContainer');
    const editor = document.getElementById('csvEditor');
    const placeholder = editorContainer.querySelector('.viewer-placeholder');

    // Show loading state
    editor.style.display = 'none';
    placeholder.innerText = 'Loading CSV data...';
    placeholder.style.display = 'block';

    Papa.parse(file, {
        header: true,
        complete: function(results) {
            currentCSVData = results.data;
            const container = document.getElementById('csvEditor');
            if (csvTable) {
                csvTable.destroy();
            }
            csvTable = new Handsontable(container, {
                data: currentCSVData,
                rowHeaders: true,
                colHeaders: true,
                licenseKey: 'non-commercial-and-evaluation',
                height: '100%', // Occupy full container height
                width: '100%'
            });

            // Hide loading state, show editor
            placeholder.style.display = 'none';
            editor.style.display = 'block';

        },
         error: function(err, file, inputElem, reason) {
            console.error("Error parsing CSV:", err, reason);
            placeholder.innerText = 'Error loading CSV file. Please check the console for details.';
            editor.style.display = 'none';
        }
    });
}

function saveCSV() {
    if (!csvTable || !currentCSVData) {
        alert("No CSV data to save.");
        return;
    }
    const data = csvTable.getData();
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', currentCSVFileName || 'edited.csv'); // Use filename if available
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Excel Handling with Handsontable
let excelTable = null;
let currentExcelData = null;
let currentExcelFileName = ''; // Store filename instead of URL

function loadExcel(url) {
     // This function is primarily for loading from URL if needed later, not used for uploads now
     console.log("Loading Excel from URL is not currently supported for uploaded files.");
}

function loadExcelFromFile(file) {
    currentExcelFileName = file.name;
    const editorContainer = document.getElementById('excelEditorContainer');
    const editor = document.getElementById('excelEditor');
    const placeholder = editorContainer.querySelector('.viewer-placeholder');

    // Show loading state
    editor.style.display = 'none';
    placeholder.innerText = 'Loading Excel data...';
    placeholder.style.display = 'block';

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        try {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            currentExcelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const container = document.getElementById('excelEditor');
            if (excelTable) {
                excelTable.destroy();
            }
            excelTable = new Handsontable(container, {
                data: currentExcelData,
                rowHeaders: true,
                colHeaders: true,
                licenseKey: 'non-commercial-and-evaluation',
                height: '100%', // Occupy full container height
                width: '100%'
            });

            // Hide loading state, show editor
             placeholder.style.display = 'none';
            editor.style.display = 'block';

        } catch (error) {
            console.error("Error processing Excel file:", error);
             placeholder.innerText = 'Error loading Excel file. Please check the console for details. Ensure it\'s a valid .xlsx or .xls file.';
             editor.style.display = 'none';
        }
    };
     reader.onerror = function(error) {
        console.error("Error reading Excel file:", error);
         placeholder.innerText = 'Error reading Excel file. Please check the console for details.';
         editor.style.display = 'none';
    };
    reader.readAsArrayBuffer(file);
}

function saveExcel() {
    if (!excelTable || !currentExcelData) {
         alert("No Excel data to save.");
        return;
    }
    const data = excelTable.getData();
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, currentExcelFileName || 'edited.xlsx'); // Use filename if available
}

// Initialize empty states and setup upload
document.addEventListener('DOMContentLoaded', () => {
    // Initialize upload areas
    setupUpload('pdfUploadArea', 'pdfUpload', 'pdfFileList', loadPDFFromFile);
    setupUpload('csvUploadArea', 'csvUpload', 'csvFileList', loadCSVFromFile);
    setupUpload('excelUploadArea', 'excelUpload', 'excelFileList', loadExcelFromFile);

    // Add event listeners for tab changes to reset/update viewer states
    const tabs = document.querySelectorAll('#fileTypeTabs button[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', (event) => {
            const activeTabPaneId = event.target.getAttribute('data-bs-target');
            const previousTabPaneId = event.relatedTarget ? event.relatedTarget.getAttribute('data-bs-target') : null;
            resetViewers(activeTabPaneId, previousTabPaneId);
        });
    });

    // Initial reset for the default active tab
     resetViewers('#pdf', null); // No previous tab on initial load
});

function resetViewers(currentTabPaneId, previousTabPaneId) {
    // Define all viewer/editor containers and their content elements/placeholders
    const viewers = {
        '#pdf': { containerId: 'pdfViewerContainer', viewerId: 'pdfViewer', placeholderSelector: '#pdfViewerContainer .viewer-placeholder', fileListId: 'pdfFileList', defaultText: 'Upload or select a PDF to view' },
        '#gdocs': { containerId: 'gdocEmbedContainer', viewerId: 'gdocEmbed', placeholderSelector: '#gdocEmbedContainer .viewer-placeholder', fileListId: 'gdocFileList', defaultText: 'Paste a public Google Doc embed URL to view/edit' },
        '#gsheets': { containerId: 'gsheetEmbedContainer', viewerId: 'gsheetEmbed', placeholderSelector: '#gsheetEmbedContainer .viewer-placeholder', fileListId: 'gsheetFileList', defaultText: 'Paste a public Google Sheet embed URL to view/edit' },
        '#csv': { containerId: 'csvEditorContainer', viewerId: 'csvEditor', placeholderSelector: '#csvEditorContainer .viewer-placeholder', fileListId: 'csvFileList', defaultText: 'Upload or select a CSV file to edit' },
        '#excel': { containerId: 'excelEditorContainer', viewerId: 'excelEditor', placeholderSelector: '#excelEditorContainer .viewer-placeholder', fileListId: 'excelFileList', defaultText: 'Upload or select an Excel file to edit' }
    };

    // Reset the viewer/editor and show placeholder for the *previous* tab
    if (previousTabPaneId && viewers[previousTabPaneId]) {
        const prev = viewers[previousTabPaneId];
        const prevViewerElement = document.getElementById(prev.viewerId);
        const prevPlaceholderElement = document.querySelector(prev.placeholderSelector);

        if (prevViewerElement) prevViewerElement.style.display = 'none';
        if (prevPlaceholderElement) {
            prevPlaceholderElement.innerText = prev.defaultText;
            prevPlaceholderElement.style.display = 'block';
        }

         // Clear the file list for upload-based tabs when switching away
         if (previousTabPaneId !== '#gdocs' && previousTabPaneId !== '#gsheets' && prev.fileListId) {
             const prevFileListElement = document.getElementById(prev.fileListId);
             if (prevFileListElement) prevFileListElement.innerHTML = '';
         }

         // Clear Google Embed src when switching away from those tabs
         if (previousTabPaneId === '#gdocs' || previousTabPaneId === '#gsheets') {
             const iframeElement = document.getElementById(viewers[previousTabPaneId].viewerId);
             if (iframeElement) iframeElement.src = '';
         }
    }

    // Ensure the current tab's viewer/editor is hidden and placeholder is shown initially
    // This is also handled in the individual load functions, but good to reset on tab switch too.
    if (currentTabPaneId && viewers[currentTabPaneId]) {
         const curr = viewers[currentTabPaneId];
         const currViewerElement = document.getElementById(curr.viewerId);
         const currPlaceholderElement = document.querySelector(curr.placeholderSelector);

         if (currViewerElement) currViewerElement.style.display = 'none';
         if (currPlaceholderElement) {
             currPlaceholderElement.innerText = curr.defaultText;
             currPlaceholderElement.style.display = 'block'; // Added missing semicolon
         }
     }
}

// Upload functionality
function setupUpload(uploadAreaId, uploadInputId, fileListId, loadFunction) {
    const uploadArea = document.getElementById(uploadAreaId);
    const uploadInput = document.getElementById(uploadInputId);
    const fileList = document.getElementById(fileListId);

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false); // Prevent dropping outside
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files, fileList, loadFunction);
    }, false);

    uploadArea.addEventListener('click', () => {
        uploadInput.click();
    });

    uploadInput.addEventListener('change', (e) => {
        const files = e.target.files;
        handleFiles(files, fileList, loadFunction);
        uploadInput.value = ''; // Clear the input so the same file can be uploaded again
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
}

function handleFiles(files, fileListElement, loadFunction) {
    // Clear existing list items and viewer/editor content
    fileListElement.innerHTML = '';

    // Determine viewer/editor container and elements based on file list ID
    let viewerContainerId, viewerId, placeholderSelector;
    if (fileListElement.id === 'pdfFileList') {
        viewerContainerId = 'pdfViewerContainer';
        viewerId = 'pdfViewer';
        placeholderSelector = '#pdfViewerContainer .viewer-placeholder';
    } else if (fileListElement.id === 'csvFileList') {
        viewerContainerId = 'csvEditorContainer';
        viewerId = 'csvEditor';
        placeholderSelector = '#csvEditorContainer .viewer-placeholder';
    } else if (fileListElement.id === 'excelFileList') {
        viewerContainerId = 'excelEditorContainer';
        viewerId = 'excelEditor';
        placeholderSelector = '#excelEditorContainer .viewer-placeholder';
    }

    const viewerContainer = document.getElementById(viewerContainerId);
    const viewer = document.getElementById(viewerId);
    const placeholder = document.querySelector(placeholderSelector);

     // Show loading state in viewer/editor area
     if(viewer) viewer.style.display = 'none';
     if(placeholder) {
         placeholder.innerText = 'Processing file...';
         placeholder.style.display = 'block';
     }

    if (files.length > 0) {
         // Load and list only the first selected file for simplicity
        const file = files[0];

        const fileItem = document.createElement('li'); // Use li for file list
        fileItem.className = 'file-item';
        fileItem.innerHTML = `<i class="fa-solid ${getFileIcon(file.name)} me-2 ${getFileColor(file.name)}"></i> ${file.name}`;

        // Make the list item clickable to reload the same uploaded file
        fileItem.onclick = (event) => {
             // Remove active class from all siblings
            Array.from(fileListElement.children).forEach(item => item.classList.remove('active'));
            // Add active class to the clicked item
            fileItem.classList.add('active');
            loadFunction(file);
        };

        fileListElement.appendChild(fileItem);

         // Automatically load the first file and mark it as active
        fileItem.classList.add('active');
        loadFunction(file);
    } else {
         console.log("No file selected.");
          if(placeholder) {
             // Determine default text based on the file type
             let defaultText = 'Upload or select a file to view/edit';
             if (fileListElement.id === 'pdfFileList') defaultText = 'Upload or select a PDF to view';
             else if (fileListElement.id === 'csvFileList') defaultText = 'Upload or select a CSV file to edit';
             else if (fileListElement.id === 'excelFileList') defaultText = 'Upload or select an Excel file to edit';

             placeholder.innerText = defaultText; // Reset placeholder text
             placeholder.style.display = 'block';
          }
    }
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch(ext) {
        case 'pdf': return 'fa-file-pdf';
        case 'csv': return 'fa-file-csv';
        case 'xlsx':
        case 'xls': return 'fa-file-excel';
        default: return 'fa-file';
    }
}

function getFileColor(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch(ext) {
        case 'pdf': return 'text-danger';
        case 'csv': return 'text-info';
        case 'xlsx':
        case 'xls': return 'text-success';
        default: return 'text-muted';
    }
}
