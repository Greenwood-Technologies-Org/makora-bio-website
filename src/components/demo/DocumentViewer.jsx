import React, { useMemo } from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';
import './DocumentViewer.css';

function DocumentViewer({ document, onClose }) {
  const documents = useMemo(
    () => [
      {
        uri: document.filePath,
        fileType: document.fileType,
        fileName: `${document.name}.${document.fileType}`
      }
    ],
    [document]
  );

  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = document.filePath;
    link.download = `${document.name}.${document.fileType}`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{document.name}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {document.fileType.toUpperCase()} • Last updated: {document.dateUploaded}
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

        {/* Document Content */}
        <div className="flex-1 overflow-hidden bg-gray-50" style={{ minHeight: 0 }}>
          <div className="h-full">
            <DocViewer
              documents={documents}
              pluginRenderers={DocViewerRenderers}
              className="doc-viewer"
              style={{ width: '100%', height: '100%' }}
              config={{
                header: {
                  disableHeader: true,
                  disableFileName: true,
                  retainURLParams: false
                }
              }}
            />
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
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentViewer;
