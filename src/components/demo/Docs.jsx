import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker from node_modules
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Import PDF files
import studyProtocolPdf from '../../docs/[NCT05262023] Study Protocol.pdf';
import informedConsentPdf from '../../docs/[NCT05262023] Informed Consent.pdf';
import dataManagementPdf from '../../docs/[NCT05262023] Data Management Plan Summary.pdf';
import eproManualPdf from '../../docs/[NCT05262023] ePRO System Site Manual.pdf';
import raciMatrixPdf from '../../docs/[NCT05262023] Clinical Operations RACI Matrix.pdf';

const mockDocuments = [
  { 
    id: 1, 
    name: '[NCT05262023] Study Protocol', 
    type: 'Protocol',
    dateUploaded: '2025-10-15', 
    size: '2.4 MB',
    filePath: studyProtocolPdf
  },
  { 
    id: 2, 
    name: '[NCT05262023] Informed Consent', 
    type: 'Consent',
    dateUploaded: '2025-10-01', 
    size: '856 KB',
    filePath: informedConsentPdf
  },
  { 
    id: 3, 
    name: '[NCT05262023] Data Management Plan Summary', 
    type: 'Reference',
    dateUploaded: '2025-10-18', 
    size: '1.2 MB',
    filePath: dataManagementPdf
  },
  { 
    id: 4, 
    name: '[NCT05262023] ePRO System Site Manual', 
    type: 'Reference',
    dateUploaded: '2025-10-10', 
    size: '3.1 MB',
    filePath: eproManualPdf
  },
  { 
    id: 5, 
    name: '[NCT05262023] Clinical Operations RACI Matrix', 
    type: 'Reference',
    dateUploaded: '2025-10-05', 
    size: '890 KB',
    filePath: raciMatrixPdf
  }
];

// PDF Viewer Component
function PDFViewer({ document, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{document.name}</h2>
            <p className="text-sm text-gray-600 mt-1">
              PDF • Last modified: {document.dateUploaded}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pageNumber} of {numPages || '...'}
            </span>
            <button
              onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || prev))}
              disabled={pageNumber >= (numPages || 1)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              Zoom Out
            </button>
            <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(prev => Math.min(prev + 0.2, 2.0))}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              Zoom In
            </button>
          </div>
        </div>

        {/* PDF Display */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4" style={{ minHeight: 0 }}>
          <div className="flex justify-center">
            <Document
              file={document.filePath}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center p-8">
                  <div className="text-gray-600">Loading PDF...</div>
                </div>
              }
              error={
                <div className="flex items-center justify-center p-8">
                  <div className="text-red-600">Failed to load PDF. Please try again.</div>
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
          <a
            href={document.filePath}
            download={`${document.name}.pdf`}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

function Docs() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedDocs, setSelectedDocs] = useState(new Set());
  const [viewingDoc, setViewingDoc] = useState(null);

  const getFileIcon = (type) => {
    // All files are PDFs now
    return '�';
  };

  const getFileColor = (type) => {
    const colors = {
      Protocol: 'bg-blue-100 text-blue-700 border-blue-200',
      Consent: 'bg-green-100 text-green-700 border-green-200',
      Reference: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const handleSelectDoc = (id) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocs(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedDocs.size === 0) return;
    if (window.confirm(`Delete ${selectedDocs.size} selected document(s)?`)) {
      setDocuments(documents.filter(doc => !selectedDocs.has(doc.id)));
      setSelectedDocs(new Set());
    }
  };

  const handleUpload = () => {
    alert('File upload dialog would open here');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Documents</h2>
            <p className="text-sm text-gray-600 mt-1">
              {documents.length} total documents
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteSelected}
              disabled={selectedDocs.size === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDocs.size > 0
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Delete Selected ({selectedDocs.size})
            </button>
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload New Doc
            </button>
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="relative border-2 border-gray-200 rounded-lg transition-all hover:shadow-lg group"
            >
              {/* Checkbox */}
              <div 
                className="absolute top-3 right-3 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectDoc(doc.id);
                }}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                  selectedDocs.has(doc.id)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-gray-300 bg-white hover:border-primary-400'
                }`}>
                  {selectedDocs.has(doc.id) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>

              {/* File Icon */}
              <div 
                className="flex items-center justify-center mb-4 pt-4 cursor-pointer"
                onClick={() => setViewingDoc(doc)}
              >
                <div className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center text-4xl transition-transform group-hover:scale-110 ${getFileColor(doc.type)}`}>
                  {getFileIcon(doc.type)}
                </div>
              </div>

              {/* File Info */}
              <div 
                className="text-center pb-4 cursor-pointer"
                onClick={() => setViewingDoc(doc)}
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-2 px-2" title={doc.name}>
                  {doc.name}
                </h3>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
                  <span className={`px-2 py-1 rounded-full font-medium ${getFileColor(doc.type)}`}>
                    {doc.type}
                  </span>
                  <span>•</span>
                  <span>{doc.size}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Uploaded {doc.dateUploaded}
                </p>
              </div>

              {/* View Button */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => setViewingDoc(doc)}
                  className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Document
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {documents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">No documents uploaded</p>
            <p className="text-sm mt-1">Upload your first document to get started</p>
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {viewingDoc && (
        <PDFViewer 
          document={viewingDoc} 
          onClose={() => setViewingDoc(null)} 
        />
      )}
    </>
  );
}

export default Docs;
