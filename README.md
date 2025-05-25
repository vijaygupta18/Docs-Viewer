# Docs Viewer

This project is a simple web-based document viewer and editor designed to be hosted on GitHub Pages. It allows users to view and perform basic editing on various file types directly in the browser.

## Features

- **PDF Viewing:** View PDF files using PDF.js.
- **Spreadsheet Viewing & Editing:** View and edit CSV and Excel (basic support via SheetJS/PapaParse and Handsontable) files.
- **Google Docs/Sheets Embedding:** View Google Docs and Sheets by embedding their public URLs.
- **File Upload:** Upload local files via drag-and-drop or click.
- **Basic UI:** A simple tabbed interface for different file types.

## Supported File Types

- PDF (.pdf)
- CSV (.csv)
- Excel (.xlsx - basic data viewing/editing via conversion)
- Google Docs (via public embed URL)
- Google Sheets (via public embed URL)

## Setup (for GitHub Pages)

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    ```
2.  **Place your files:** The application is designed to load files that are included in the repository or uploaded locally. For embedded Google files, you will need their public embed URLs.
3.  **Configure GitHub Pages:** Go to your repository settings on GitHub, navigate to the "Pages" section, and configure it to deploy from the `main` branch (or your preferred branch) and the `/ (root)` directory.
4.  **Access the site:** Once deployed, your Docs Viewer will be accessible at `https://your-github-username.github.io/your-repository-name/`.

## Usage

- Use the tabs to switch between different document types.
- For PDF, CSV, and Excel tabs, drag and drop a file onto the dashed area or click the area to open a file selector.
- For Google Docs and Sheets, paste the public embed URL into the input field and click "Load".
- Basic editing is available for CSV and Excel files through the Handsontable interface (note: saving requires additional backend implementation, currently not available in this static version).

## Libraries Used

- **Bootstrap:** For basic styling and layout.
- **Font Awesome:** For icons.
- **PDF.js:** For rendering PDF files.
- **SheetJS:** For reading spreadsheet files.
- **PapaParse:** For parsing CSV files.
- **Handsontable:** For the spreadsheet viewing and editing interface.

## Limitations

- This is a static site, so advanced features like saving edited files back to the repository or handling proprietary online document formats directly are not supported without a backend.
- Embedding Google Docs/Sheets requires the documents to be publicly accessible via their embed URLs.

---

*This project was built with the help of an AI assistant.* 