import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { marked } from 'marked';
import dynamic from 'next/dynamic';

// Chargement dynamique de react-pdf pour éviter les erreurs SSR
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), {
  ssr: false,
  loading: () => <p>Chargement du composant PDF...</p>
});

const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), {
  ssr: false
});

// Configuration du worker côté client uniquement
if (typeof window !== 'undefined') {
  import('react-pdf').then(pdf => {
    pdf.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdf.pdfjs.version}/build/pdf.worker.min.js`;
  });
}

const DocumentViewer = () => {
  const [currentFile, setCurrentFile] = useState(null);
  const [viewerContent, setViewerContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [fileType, setFileType] = useState('');
  const [alert, setAlert] = useState(null);
  
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    if (type === 'success') {
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const isValidFile = (file) => {
    const validTypes = ['.md', '.pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(extension)) {
      showAlert('error', `Type de fichier non supporté: ${extension}`);
      return false;
    }
    
    if (file.size > maxSize) {
      showAlert('error', 'Fichier trop volumineux (max 10MB)');
      return false;
    }
    
    return true;
  };

  const handleFiles = (files) => {
    if (files.length === 0) return;
    
    const file = files[0];
    if (!isValidFile(file)) return;
    
    setCurrentFile(file);
    displayFile(file);
  };

  const displayFile = (file) => {
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setFileType(extension);
    
    if (extension === '.md') {
      displayMarkdown(file);
    } else if (extension === '.pdf') {
      displayPDF(file);
    }
  };

  const displayMarkdown = (file) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const markdownText = e.target.result;
      const htmlContent = marked.parse(markdownText);
      
      setViewerContent(
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      );
      showAlert('success', `✅ Fichier Markdown chargé: ${file.name}`);
    };
    
    reader.onerror = function() {
      showAlert('error', 'Erreur lors de la lecture du fichier Markdown');
    };
    
    reader.readAsText(file);
  };

  const displayPDF = (file) => {
    // Version avec iframe si react-pdf pose problème
    const useIframe = false; // Changez à true si react-pdf ne fonctionne pas
    
    if (useIframe) {
      const url = URL.createObjectURL(file);
      setViewerContent(
        <div className="pdf-viewer">
          <iframe 
            src={url} 
            width="100%" 
            height="600px" 
            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
            title="PDF Viewer"
          />
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Si le PDF ne s'affiche pas, 
            <a href={url} download={file.name} style={{ marginLeft: '5px' }}>
              cliquez ici pour télécharger
            </a>
          </p>
        </div>
      );
      showAlert('success', `✅ PDF chargé: ${file.name}`);
    } else {
      // Version avec react-pdf
      setViewerContent(
        <div className="pdf-viewer">
          <div className="pdf-controls">
            <button 
              className="control-btn" 
              onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
              disabled={pageNumber <= 1}
            >
              ← Précédent
            </button>
            <span className="page-info">
              Page <span>{pageNumber}</span> sur <span>{numPages || '...'}</span>
            </span>
            <button 
              className="control-btn" 
              onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
              disabled={pageNumber >= numPages}
            >
              Suivant →
            </button>
            <button className="control-btn" onClick={() => setScale(prev => Math.max(0.5, prev - 0.25))}>
              🔍-
            </button>
            <button className="control-btn" onClick={() => setScale(prev => prev + 0.25)}>
              🔍+
            </button>
          </div>
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              showAlert('success', `✅ PDF chargé: ${file.name} (${numPages} pages)`);
            }}
            onLoadError={(error) => {
              console.error('Erreur PDF:', error);
              showAlert('error', 'Erreur lors du chargement du PDF');
            }}
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale}
              className="pdf-canvas"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      );
    }
  };

  const downloadCurrentFile = () => {
    if (!currentFile) return;
    
    const url = URL.createObjectURL(currentFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const closeViewer = () => {
    setViewerContent(null);
    setCurrentFile(null);
    setFileName('');
    setFileSize('');
    setFileType('');
    setPageNumber(1);
    setNumPages(null);
    setScale(1.2);
    setAlert(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="container">
      <Link href="/">
        ← Retour au Wiki
      </Link>
      
      <div className="header">
        <h1>📄 Visionneuse de Documents</h1>
        <p>Visualisez vos fichiers Markdown et PDF directement dans le navigateur</p>
      </div>

      <div className="content">
        <div className="section">
          <h2>📁 Charger un document</h2>
          
          {alert && (
            <div className={`alert ${alert.type}`}>
              {alert.message}
            </div>
          )}

          <div className="alert info">
            <strong>💡 Formats supportés :</strong> Markdown (.md), PDF (.pdf) | Taille maximum : 10 MB
          </div>

          <div 
            className={`upload-section ${isDragging ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📁</div>
            <h3>Glissez-déposez vos fichiers ici</h3>
            <p>ou cliquez pour sélectionner un fichier</p>
            <button className="upload-btn">
              Choisir un fichier
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              className="file-input" 
              accept=".md,.pdf"
              onChange={(e) => handleFiles(Array.from(e.target.files))}
              style={{ display: 'none' }}
            />
          </div>

          {currentFile && (
            <div className="viewer-container">
              <div className="viewer-header">
                <div className="file-info">
                  <div className="file-name">{fileName}</div>
                  <div className="file-size">{fileSize}</div>
                </div>
                <div className="viewer-controls">
                  <button className="control-btn" onClick={downloadCurrentFile}>
                    💾 Télécharger
                  </button>
                  <button className="control-btn" onClick={closeViewer}>
                    ✖ Fermer
                  </button>
                </div>
              </div>
              <div className="viewer-content">
                {viewerContent}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;