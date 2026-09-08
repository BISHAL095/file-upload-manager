import { useState } from 'react';

export default function UploadZone({ onFilesSelected }) {

  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e) => {
    onFilesSelected(Array.from(e.target.files));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    onFilesSelected(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };


  return (
    <label
      className={`dropzone${isDragging ? ' dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
    >
      <div className="dropzone-content">
      <span className="dropzone-icon">+</span>
      <span className="dropzone-label">Drop files here or click to select</span>
      </div>
      <input type="file" multiple onChange={handleFileSelect} />
    </label>
  );    
}