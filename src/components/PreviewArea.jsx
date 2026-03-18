import React, { useState } from 'react';

const PreviewArea = ({ generatedHTML, onCopy, onDownload, showActions }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    setIsLoading(true);
    onCopy();
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <i className="fas fa-code me-2"></i>Generated HTML Preview
      </div>
      <div className="card-body">
        {isLoading ? (
          <div className="loading-spinner text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Copying...</p>
          </div>
        ) : generatedHTML ? (
          <>
            <div className="preview-area">
              <pre>{generatedHTML.substring(0, 5000)}...</pre>
            </div>
            {showActions && (
              <div className="mt-3">
                <button className="btn btn-primary w-100 mb-2" onClick={handleCopy}>
                  <i className="fas fa-copy me-1"></i>Copy HTML to Clipboard
                </button>
                <button className="btn btn-outline-primary w-100" onClick={onDownload}>
                  <i className="fas fa-download me-1"></i>Download as HTML File
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted text-center mt-5">
            <i className="fas fa-code fa-3x mb-3"></i>
            <br />
            Your generated HTML will appear here
          </p>
        )}
      </div>
    </div>
  );
};

export default PreviewArea;