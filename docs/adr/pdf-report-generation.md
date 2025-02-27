# PDF Report Generation Architecture

## Context
Residents need the ability to generate PDF reports from their recorded activities. The system should allow filtering activities by date range and type, selecting specific entries, and exporting them as PDF files.

## Decision
We will implement PDF report generation using the following architecture:

### Frontend Components
1. **Activity Selection**
   - Enhance ActivityList component with multi-select capability
   - Add a "Generate Report" button in the toolbar
   - Implement a report preview modal

2. **PDF Generation**
   - Use `@react-pdf/renderer` library for PDF generation
   - Create reusable PDF components for:
     - Cover page with resident information
     - Table of contents
     - Report header with resident info
     - Activity summary section
     - Detailed activity list with full report content
     - Statistics/charts section

3. **Report Templates**
   - Create different report templates:
     - Summary Report (high-level overview)
     - Detailed Report (complete activity details)
     - Custom Report (user-selected fields)

### Report Structure
1. **Cover Page (Page 1)**
   - Resident name and information
   - Report generation date
   - Institution logo/header
   - Report period

2. **Table of Contents (Page 2)**
   - Dynamic generation based on activities
   - Page numbers for each activity
   - Section headers for different activity types

3. **Activity Details (Page 3+)**
   - Full activity information including:
     - Title and type
     - Date and timestamps
     - Complete report content from TinyMCE
     - Any additional metadata
   - Proper page breaks between activities
   - Consistent formatting of rich text content

### Backend Services
1. **Report Generation API**
   - New endpoint: `POST /api/activities/report`
   - Accept parameters:
     - activityIds: string[] (selected activities)
     - templateType: string
     - dateRange: { start: Date, end: Date }
     - filters: { type?: string }

2. **PDF Processing Service**
   - Handle PDF generation server-side
   - Support batch processing for large reports
   - Implement caching for frequently generated reports

### Data Flow
1. User selects activities and report template in UI
2. Frontend sends report generation request to API
3. Backend processes request and generates PDF
4. PDF is streamed back to client for download

### Libraries & Dependencies
- Frontend:
  - `@react-pdf/renderer`: PDF generation
  - `@mui/lab`: Enhanced selection components
  - `recharts`: For charts/statistics in reports
  - `html-to-pdfmake`: Convert HTML content to PDF format

- Backend:
  - `pdfkit`: PDF generation
  - `node-cache`: Report caching

## Implementation Phases
1. Phase 1:
   - Cover page implementation
   - Table of contents generation
   - Full activity detail display
   - Rich text content formatting

2. Phase 2:
   - Multiple report templates
   - Charts and statistics
   - Report preview

3. Phase 3:
   - Custom report builder
   - Report caching
   - Batch processing

## Technical Considerations
1. **Performance**
   - Generate PDFs server-side for large reports
   - Implement pagination for report preview
   - Cache frequently generated reports
   - Handle large rich text content efficiently

2. **Security**
   - Validate user permissions for selected activities
   - Sanitize data before PDF generation
   - Implement rate limiting for report generation

3. **Scalability**
   - Support batch processing for large reports
   - Implement report queue for heavy loads
   - Consider PDF storage strategy

## Alternatives Considered
1. **Client-side only generation**
   - Pros: Faster, less server load
   - Cons: Limited to smaller reports, security concerns

2. **Third-party PDF services**
   - Pros: Managed service, less maintenance
   - Cons: Cost, data privacy concerns

## Consequences
### Positive
- Professional-looking reports
- Flexible report customization
- Efficient activity selection
- Reusable PDF components
- Complete activity documentation
- Better organization with table of contents

### Negative
- Additional server load
- More complex UI state management
- Increased testing requirements
- More complex content formatting

## References
- [React-PDF Documentation](https://react-pdf.org/)
- [Material-UI Data Grid](https://mui.com/components/data-grid/)
- [PDFKit Documentation](https://pdfkit.org/)