import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpaceAnalyzer.css';

const SpaceAnalyzer = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [measurements, setMeasurements] = useState([]);
  const [currentMeasurement, setCurrentMeasurement] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [spaceType, setSpaceType] = useState('');
  const [referenceObject, setReferenceObject] = useState('');
  const [referenceSize, setReferenceSize] = useState('');
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Enhanced validation for space analysis
  const validateSpaceImage = useCallback((file) => {
    const filename = file.name.toLowerCase();
    const fileSize = file.size;
    const fileType = file.type;

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }

    // Check file size (max 15MB for detailed space analysis)
    if (fileSize > 15 * 1024 * 1024) {
      return 'Image size should be less than 15MB for accurate space analysis';
    }

    // Reject human photos
    const humanKeywords = [
      'person', 'people', 'human', 'face', 'selfie', 'portrait', 'man', 'woman',
      'avatar', 'character', 'cartoon', 'profile', 'headshot'
    ];

    for (const keyword of humanKeywords) {
      if (filename.includes(keyword)) {
        return 'Human photos not allowed. Please upload space/area images only.';
      }
    }

    // Look for space-related content
    const spaceKeywords = [
      'field', 'rooftop', 'patio', 'balcony', 'garden', 'terrace', 'yard',
      'backyard', 'courtyard', 'deck', 'outdoor', 'space', 'area', 'plot',
      'land', 'ground', 'lawn', 'empty', 'available', 'farming', 'agriculture'
    ];

    const hasSpaceKeyword = spaceKeywords.some(keyword => filename.includes(keyword));
    
    // More permissive for generic names but warn user
    if (!hasSpaceKeyword) {
      const genericPatterns = [
        /^img_\d+/i, /^image_\d+/i, /^photo_\d+/i, /^pic_\d+/i,
        /^\d{8}_\d{6}/i, /^dsc_\d+/i
      ];
      
      const isGeneric = genericPatterns.some(pattern => pattern.test(filename));
      if (!isGeneric) {
        return 'Please ensure image shows a measurable outdoor space (field, rooftop, patio, garden, etc.)';
      }
    }

    return null; // Valid
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    const error = validateSpaceImage(file);
    
    if (error) {
      setValidationError(error);
      setSelectedFile(null);
      setImagePreview(null);
      setShowMeasurement(false);
      return;
    }

    setValidationError('');
    setSelectedFile(file);
    setShowMeasurement(false);
    setMeasurements([]);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }, [validateSpaceImage]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Measurement tool functions
  const startMeasurement = () => {
    if (!selectedFile) {
      setValidationError('Please upload an image first');
      return;
    }
    setShowMeasurement(true);
    setValidationError('');
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e) => {
    if (!showMeasurement) return;
    
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setCurrentMeasurement({
      startX: coords.x,
      startY: coords.y,
      endX: coords.x,
      endY: coords.y,
      id: Date.now()
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !showMeasurement) return;
    
    const coords = getCanvasCoordinates(e);
    setCurrentMeasurement(prev => ({
      ...prev,
      endX: coords.x,
      endY: coords.y
    }));
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentMeasurement) return;
    
    setIsDrawing(false);
    
    // Calculate line length in pixels
    const length = Math.sqrt(
      Math.pow(currentMeasurement.endX - currentMeasurement.startX, 2) +
      Math.pow(currentMeasurement.endY - currentMeasurement.startY, 2)
    );
    
    if (length > 10) { // Only add if line is long enough
      setMeasurements(prev => [...prev, { 
        ...currentMeasurement, 
        pixelLength: length.toFixed(0)
      }]);
    }
    setCurrentMeasurement(null);
  };

  // Draw measurements on canvas
  const drawMeasurements = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all completed measurements
    measurements.forEach((measurement, index) => {
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(measurement.startX, measurement.startY);
      ctx.lineTo(measurement.endX, measurement.endY);
      ctx.stroke();
      
      // Draw measurement number
      ctx.fillStyle = '#ff6b6b';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(
        `${index + 1}`,
        (measurement.startX + measurement.endX) / 2,
        (measurement.startY + measurement.endY) / 2
      );
      
      // Draw endpoints
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.arc(measurement.startX, measurement.startY, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(measurement.endX, measurement.endY, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw current measurement being drawn
    if (currentMeasurement) {
      ctx.strokeStyle = '#4ecdc4';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(currentMeasurement.startX, currentMeasurement.startY);
      ctx.lineTo(currentMeasurement.endX, currentMeasurement.endY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  React.useEffect(() => {
    if (showMeasurement) {
      drawMeasurements();
    }
  }, [measurements, currentMeasurement, showMeasurement]);

  const clearMeasurements = () => {
    setMeasurements([]);
    setCurrentMeasurement(null);
  };

  const removeMeasurement = (index) => {
    setMeasurements(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate real-world measurements
  const calculateRealMeasurements = () => {
    if (!referenceSize || measurements.length === 0) return [];
    
    const refSize = parseFloat(referenceSize);
    if (isNaN(refSize)) return [];
    
    // Use first measurement as reference
    const referenceMeasurement = measurements[0];
    const referencePixels = parseFloat(referenceMeasurement.pixelLength);
    const pixelsPerUnit = referencePixels / refSize;
    
    return measurements.map((measurement, index) => {
      const realLength = (parseFloat(measurement.pixelLength) / pixelsPerUnit).toFixed(2);
      return {
        ...measurement,
        realLength: realLength,
        index: index + 1
      };
    });
  };

  // Analyze space and provide recommendations
  const analyzeSpace = async () => {
    if (!selectedFile) {
      setValidationError('Please select an image first');
      return;
    }

    if (measurements.length === 0) {
      setValidationError('Please add at least one measurement to analyze the space');
      return;
    }

    if (!referenceSize) {
      setValidationError('Please specify the size of your reference measurement');
      return;
    }

    setAnalyzing(true);
    setValidationError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const realMeasurements = calculateRealMeasurements();
      const totalArea = calculateTotalArea(realMeasurements);
      const spaceAnalysis = generateSpaceAnalysis(totalArea, realMeasurements);

      const analysisResult = {
        imageFile: selectedFile,
        imageUrl: imagePreview,
        spaceType: spaceType || 'outdoor_space',
        measurements: realMeasurements,
        referenceObject,
        referenceSize: parseFloat(referenceSize),
        totalArea,
        spaceAnalysis,
        recommendations: spaceAnalysis.recommendations,
        gardeningType: spaceAnalysis.gardeningType,
        timestamp: new Date().toISOString()
      };

      // Save to localStorage
      const history = JSON.parse(localStorage.getItem('spaceAnalysisHistory') || '[]');
      history.push(analysisResult);
      localStorage.setItem('spaceAnalysisHistory', JSON.stringify(history));

      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }

      navigate('/space-results', { state: analysisResult });

    } catch (error) {
      console.error('Analysis failed:', error);
      setValidationError('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Calculate approximate area
  const calculateTotalArea = (realMeasurements) => {
    if (realMeasurements.length < 2) return 0;
    
    // Simple approximation: if we have length and width measurements
    if (realMeasurements.length >= 2) {
      const length = parseFloat(realMeasurements[0].realLength);
      const width = parseFloat(realMeasurements[1].realLength);
      return (length * width).toFixed(2);
    }
    
    return 0;
  };

  // Generate space analysis
  const generateSpaceAnalysis = (totalArea, realMeasurements) => {
    const area = parseFloat(totalArea);
    let gardeningType, recommendations, plantCapacity, layout;

    if (area === 0) {
      gardeningType = 'measurement_needed';
      recommendations = ['Please add width and length measurements for accurate analysis'];
      plantCapacity = 'Unknown';
      layout = 'Cannot determine without measurements';
    } else if (area < 2) { // Less than 2 square meters
      gardeningType = 'container_gardening';
      recommendations = [
        'Perfect for container gardening with pots and planters',
        'Use vertical space with hanging planters and wall-mounted systems',
        'Focus on herbs, small vegetables, and compact plants',
        'Consider tiered plant stands to maximize space',
        'Recommended: Cherry tomatoes, lettuce, herbs, peppers in containers'
      ];
      plantCapacity = '5-10 containers';
      layout = 'Vertical and container-based';
    } else if (area < 10) { // 2-10 square meters
      gardeningType = 'small_garden';
      recommendations = [
        'Ideal for raised bed gardening or large containers',
        'Mix of container and ground planting possible',
        'Plan for 2-3 raised beds or multiple container zones',
        'Good space for herb garden and small vegetable plots',
        'Consider companion planting to maximize yield'
      ];
      plantCapacity = '15-25 plants';
      layout = 'Mixed raised beds and containers';
    } else if (area < 50) { // 10-50 square meters
      gardeningType = 'medium_garden';
      recommendations = [
        'Excellent space for diverse vegetable garden',
        'Plan multiple growing zones with different crops',
        'Include pathways for easy access and maintenance',
        'Space for composting area and tool storage',
        'Can grow larger plants like tomatoes, cucumbers, squash'
      ];
      plantCapacity = '50-100 plants';
      layout = 'Zone-based with pathways';
    } else if (area < 200) { // 50-200 square meters
      gardeningType = 'large_garden';
      recommendations = [
        'Substantial space for extensive vegetable production',
        'Plan crop rotation zones for soil health',
        'Include permanent structures like greenhouse or shed',
        'Space for fruit trees or berry bushes',
        'Consider irrigation system for efficient watering'
      ];
      plantCapacity = '200+ plants';
      layout = 'Multi-zone with permanent structures';
    } else { // Over 200 square meters
      gardeningType = 'field_scale';
      recommendations = [
        'Field-scale growing possible',
        'Consider mechanized tools for maintenance',
        'Plan for crop rotation and cover crops',
        'Irrigation system essential',
        'Opportunity for cash crop production',
        'Include storage and processing areas'
      ];
      plantCapacity = '500+ plants';
      layout = 'Field rows with machinery access';
    }

    return {
      gardeningType,
      recommendations,
      plantCapacity,
      layout,
      area: area,
      measurements: realMeasurements.length
    };
  };

  return (
    <div className="space-analyzer">
      <div className="analyzer-container">
        <h2>📏 Space Measurement & Analysis</h2>
        <p className="analyzer-description">
          Upload an image of your space and measure its dimensions to get precise growing recommendations.
          Works for fields, rooftops, patios, balconies, and any outdoor growing area.
        </p>

        {/* Upload Area */}
        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''} ${validationError ? 'error' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          {!imagePreview ? (
            <div className="upload-placeholder">
              <div className="upload-icon">🏞️</div>
              <h3>Upload Your Space Image</h3>
              <p>Drop image here or click to browse</p>
              <small>Fields, rooftops, patios, gardens, balconies, terraces</small>
            </div>
          ) : (
            <div className="image-preview-container">
              <img 
                src={imagePreview} 
                alt="Space preview" 
                className="image-preview"
                style={{ display: showMeasurement ? 'none' : 'block' }}
              />
              
              {showMeasurement && (
                <div className="measurement-container">
                  <div className="canvas-wrapper">
                    <img 
                      src={imagePreview} 
                      alt="Background" 
                      className="background-image"
                    />
                    <canvas
                      ref={canvasRef}
                      className="measurement-canvas"
                      width={800}
                      height={600}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                    />
                  </div>
                </div>
              )}
              
              <button 
                className="change-image-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Image
              </button>
            </div>
          )}
        </div>

        {validationError && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {validationError}
          </div>
        )}

        {/* Space Type Selection */}
        {imagePreview && !validationError && (
          <div className="space-config">
            <h3>Space Configuration</h3>
            <div className="config-grid">
              <div className="config-item">
                <label>Space Type:</label>
                <select 
                  value={spaceType} 
                  onChange={(e) => setSpaceType(e.target.value)}
                  className="config-select"
                >
                  <option value="">Select space type</option>
                  <option value="field">Open Field</option>
                  <option value="rooftop">Rooftop</option>
                  <option value="patio">Patio</option>
                  <option value="balcony">Balcony</option>
                  <option value="terrace">Terrace</option>
                  <option value="backyard">Backyard</option>
                  <option value="courtyard">Courtyard</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Measurement Tools */}
        {imagePreview && !validationError && (
          <div className="measurement-section">
            {!showMeasurement ? (
              <button className="start-measurement-btn" onClick={startMeasurement}>
                📏 Start Measuring Space
              </button>
            ) : (
              <div className="measurement-tools">
                <h3>Measure Your Space</h3>
                <p className="measurement-instructions">
                  Click and drag to draw measurement lines on your image. 
                  Start with a known reference (like a door, person, or object).
                </p>
                
                <div className="reference-setup">
                  <div className="reference-item">
                    <label>Reference Object:</label>
                    <input
                      type="text"
                      placeholder="e.g., door, person, table"
                      value={referenceObject}
                      onChange={(e) => setReferenceObject(e.target.value)}
                      className="reference-input"
                    />
                  </div>
                  <div className="reference-item">
                    <label>Size (meters):</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 2.0"
                      value={referenceSize}
                      onChange={(e) => setReferenceSize(e.target.value)}
                      className="reference-input"
                    />
                  </div>
                </div>
                
                <div className="measurement-stats">
                  <span>Measurements: {measurements.length}</span>
                  {referenceSize && measurements.length > 0 && (
                    <span>Reference: {referenceSize}m</span>
                  )}
                </div>
                
                <div className="measurement-actions">
                  <button className="clear-btn" onClick={clearMeasurements}>
                    Clear All
                  </button>
                  <button 
                    className="done-measuring-btn" 
                    onClick={() => setShowMeasurement(false)}
                  >
                    Done Measuring
                  </button>
                </div>

                {measurements.length > 0 && (
                  <div className="measurements-list">
                    <h4>Measurements:</h4>
                    {measurements.map((measurement, index) => (
                      <div key={measurement.id} className="measurement-item">
                        <span>Line {index + 1}: {measurement.pixelLength} pixels</span>
                        {referenceSize && index === 0 && (
                          <span className="reference-note">(Reference: {referenceSize}m)</span>
                        )}
                        <button 
                          className="remove-measurement-btn"
                          onClick={() => removeMeasurement(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Analysis Button */}
        {imagePreview && !validationError && measurements.length > 0 && referenceSize && (
          <div className="analysis-section">
            <button 
              className="analyze-space-btn"
              onClick={analyzeSpace}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <span className="spinner"></span>
                  Analyzing Space...
                </>
              ) : (
                '🔍 Analyze My Space'
              )}
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="instructions">
          <h3>📋 How to Use:</h3>
          <ol>
            <li>Upload a clear overhead or side view of your growing space</li>
            <li>Select your space type (field, rooftop, patio, etc.)</li>
            <li>Use measurement tool to draw lines on known objects/distances</li>
            <li>Specify the real-world size of your reference measurement</li>
            <li>Add more measurements for length, width, and key features</li>
            <li>Get detailed analysis with exact space recommendations</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SpaceAnalyzer;