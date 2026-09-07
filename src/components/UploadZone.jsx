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
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
      style={{
        border: isDragging ? '2px dashed #4caf50' : '2px dashed #ccc',
        padding: '1rem',
        textAlign: 'center'
      }}
    >
      <p>Drag and drop files here or click to select files</p>
      <input type="file" multiple onChange={handleFileSelect} />
    </div>
  );    
}