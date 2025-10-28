import React, { useState, useEffect } from 'react';
import DocumentViewer from './DocumentViewer.jsx';

// You can use Google Drive links OR local file imports
// To use Google Drive:
// 1. Upload file to Google Drive
// 2. Right-click file > Share > Change to "Anyone with the link"
// 3. Copy the sharing link (looks like: https://drive.google.com/file/d/FILE_ID/view)
// 4. Paste it in filePath below

const realDocuments = [
  { 
    id: 1, 
    name: '[NCT05262023] Study Protocol', 
    type: 'Protocol',
    fileType: 'docx',
    dateUploaded: '2025-10-15', 
    size: '2.4 MB',
    // Replace with your Google Drive link:
    filePath: 'https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view'
    // Or keep local import: filePath: studyProtocolDocx
  },
  { 
    id: 2, 
    name: '[NCT05262023] Informed Consent', 
    type: 'Consent',
    fileType: 'docx', 
    dateUploaded: '2025-10-01', 
    size: '856 KB',
    // Replace with your Google Drive link:
    filePath: 'https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view'
  },
  { 
    id: 3, 
    name: '[NCT05262023] Data Management Plan Summary', 
    type: 'Reference',
    fileType: 'pdf', 
    dateUploaded: '2025-10-18', 
    size: '1.2 MB',
    // Replace with your Google Drive link:
    filePath: 'https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view'
  },
  { 
    id: 4, 
    name: '[NCT05262023] ePRO System Site Manual', 
    type: 'Reference',
    fileType: 'pdf', 
    dateUploaded: '2025-10-10', 
    size: '3.1 MB',
    // Replace with your Google Drive link:
    filePath: 'https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view'
  },
  { 
    id: 5, 
    name: '[NCT05262023] Clinical Operations RACI Matrix', 
    type: 'Reference',
    fileType: 'pptx', 
    dateUploaded: '2025-10-05', 
    size: '890 KB',
    // Replace with your Google Drive link:
    filePath: 'https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view'
  }
];

function Docs() {
  const [documents, setDocuments] = useState(realDocuments);
  const [selectedDocs, setSelectedDocs] = useState(new Set());
  const [viewingDoc, setViewingDoc] = useState(null);

  const getFileIcon = (fileType) => {
    const icons = {
      docx: '📝',
      pdf: '📄',
      pptx: '�',
      xlsx: '📈'
    };
    return icons[fileType] || '📁';
  };

  const getFileColor = (fileType) => {
    const colors = {
      docx: 'bg-blue-100 text-blue-700 border-blue-200',
      pdf: 'bg-red-100 text-red-700 border-red-200',
      pptx: 'bg-orange-100 text-orange-700 border-orange-200',
      xlsx: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[fileType] || 'bg-gray-100 text-gray-700 border-gray-200';
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
                <div className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center text-4xl transition-transform group-hover:scale-110 ${getFileColor(doc.fileType)}`}>
                  {getFileIcon(doc.fileType)}
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
                  <span className={`px-2 py-1 rounded-full font-medium uppercase ${getFileColor(doc.fileType)}`}>
                    {doc.fileType}
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

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <DocumentViewer 
          document={viewingDoc} 
          onClose={() => setViewingDoc(null)} 
        />
      )}
    </>
  );
}

export default Docs;
