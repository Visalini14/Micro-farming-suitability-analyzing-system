import React, { useState, useRef } from 'react';

const EnhancedImageUpload = ({ onImageSelect, selectedImage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      onImageSelect(file);
    } else {
      alert('Please select an image file (JPG, PNG, etc.)');
    }
  };

  const openFile = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImagePreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="enhanced-image-upload">
      <h3>Upload Image of Your Growing Space</h3>
      <p>Take a photo of the area where you want to grow plants. This helps us analyze sunlight and space conditions.</p>
      
      {!imagePreview ? (
        <div
          className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFile}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <div className="upload-content">
            <div className="upload-icon">📸</div>
            <h4>Drag & Drop Image Here</h4>
            <p>or click to browse files</p>
            <div className="supported-formats">
              <small>Supports: JPG, PNG, WebP</small>
            </div>
          </div>
        </div>
      ) : (
        <div className="image-preview">
          <img src={imagePreview} alt="Growing space preview" />
          <div className="image-actions">
            <button className="btn-secondary" onClick={openFile}>
              📸 Change Image
            </button>
            <button className="btn-danger" onClick={removeImage}>
              🗑️ Remove
            </button>
          </div>
        </div>
      )}

      <div className="upload-tips">
        <h4>📋 Photo Tips:</h4>
        <ul>
          <li>• Take the photo during daytime for better sunlight analysis</li>
          <li>• Include the entire growing area in the frame</li>
          <li>• Show any shadows or obstacles that might block sunlight</li>
          <li>• For balconies/terraces, include surrounding buildings</li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedImageUpload;