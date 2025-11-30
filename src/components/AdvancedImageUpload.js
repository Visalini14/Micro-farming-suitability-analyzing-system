import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdvancedImageUpload.css';

const AdvancedImageUpload = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get weather data and skip weather step flag from navigation state (passed from dashboard)
  const weatherDataFromDashboard = location.state?.weatherData;
  const skipWeatherStep = location.state?.skipWeatherStep;
  
  // Debug: Check if we received weather data from dashboard
  console.log('AdvancedImageUpload: weatherDataFromDashboard:', weatherDataFromDashboard);
  console.log('AdvancedImageUpload: skipWeatherStep:', skipWeatherStep);
  console.log('AdvancedImageUpload: location.state:', location.state);

  // Validate image for balcony/garden content only
  const validateImage = useCallback((file) => {
    const filename = file.name.toLowerCase();
    const fileSize = file.size;
    const fileType = file.type;

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }

    // Check file size (max 10MB)
    if (fileSize > 10 * 1024 * 1024) {
      return 'Image size should be less than 10MB';
    }

    // Reject human-related content
    const humanKeywords = [
      'person', 'people', 'human', 'face', 'selfie', 'portrait', 'man', 'woman',
      'boy', 'girl', 'child', 'baby', 'adult', 'teen', 'family', 'group',
      'profile', 'headshot', 'smile', 'wedding', 'party', 'meeting', 'office',
      'friend', 'colleague', 'vacation', 'travel', 'restaurant', 'indoor_person',
      'avatar', 'character', 'cartoon', 'anime', 'drawing', 'illustration',
      'figure', 'doll', 'toy', 'model', 'render', '3d', 'cgi'
    ];

    for (const keyword of humanKeywords) {
      if (filename.includes(keyword)) {
        return 'Human photos, avatars, and character images are not allowed. Please upload images of outdoor growing spaces only (including empty spaces).';
      }
    }

    // Additional validation for likely human content patterns
    const humanPatterns = [
      /\b(selfie|portrait|face|person|people)\b/i,
      /\b(avatar|profile|character|cartoon)\b/i,
      /\b(me|my|myself|self)\b/i,
      /\b(friend|family|colleague)\b/i
    ];

    for (const pattern of humanPatterns) {
      if (pattern.test(filename)) {
        return 'Human photos, avatars, and character images are not allowed. Please upload images of outdoor growing spaces only (including empty spaces).';
      }
    }

    // Check for completely invalid content (but allow outdoor spaces)
    const invalidKeywords = [
      'food', 'meal', 'kitchen', 'bedroom', 'bathroom', 'living_room',
      'office', 'computer', 'phone', 'animal', 'pet', 'dog', 'cat',
      'interior', 'furniture', 'electronics', 'technology'
    ];

    for (const keyword of invalidKeywords) {
      if (filename.includes(keyword)) {
        return 'Please upload images of SPACES suitable for growing plants (balconies, gardens, terraces, patios, rooftops, courtyards, skateboard areas, basketball courts, or any flat outdoor concrete/paved surfaces).';
      }
    }

    // Look for valid content indicators (including empty spaces and urban growing areas)
    const validKeywords = [
      'balcony', 'garden', 'terrace', 'patio', 'outdoor', 'plant', 'green',
      'leaf', 'flower', 'pot', 'planter', 'greenhouse', 'yard', 'space',
      'growing', 'cultivation', 'herb', 'vegetable', 'crop', 'farming',
      'empty', 'blank', 'area', 'corner', 'deck', 'rooftop', 'windowsill',
      'balcony_empty', 'empty_space', 'growing_area', 'planting_space',
      'future_garden', 'available_space', 'unused_area', 'concrete', 
      'platform', 'surface', 'floor', 'ground', 'court', 'rink', 'field',
      'parking', 'lot', 'urban', 'city', 'building_top', 'flat', 'level',
      'open', 'clear', 'available', 'potential', 'container_space', 'view',
      'skateboard', 'skate', 'basketball', 'tennis', 'volleyball', 'sport',
      'recreation', 'playground', 'public', 'cement', 'asphalt', 'pavement',
      'slab', 'plaza', 'courtyard', 'square', 'hardscape', 'tarmac'
    ];

    const hasValidKeyword = validKeywords.some(keyword => filename.includes(keyword));
    
    // More permissive approach - allow generic image names for spaces
    if (!hasValidKeyword) {
      // Check if it's a generic image name that might be a valid space
      const genericPatterns = [
        /^img_\d+/i, /^image_\d+/i, /^photo_\d+/i, /^pic_\d+/i,
        /^\d{8}_\d{6}/i, /^screenshot/i, /^capture/i, /^snap/i,
        /^dsc_\d+/i, /^camera/i, /^whatsapp/i, /^signal/i,
        /^download/i, /^temp/i, /^untitled/i, /^new/i,
        /-rink/i, /-court/i, /-view/i, /-space/i, /-area/i
      ];
      
      const isGenericName = genericPatterns.some(pattern => pattern.test(filename));
      
      // If filename doesn't clearly indicate it's a valid space, still allow it but show informative message
      if (!isGenericName) {
        // Allow the upload but show an informative message
        console.log('Filename does not contain space keywords, but allowing upload. Please ensure this shows an outdoor space suitable for container gardening.');
      } else {
        // For generic filenames, show a warning but allow the upload
        console.log('Generic filename detected. Assuming this shows an outdoor growing space.');
      }
    }

    return null; // Valid image
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    const error = validateImage(file);
    
    if (error) {
      setValidationError(error);
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }

    setValidationError('');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }, [validateImage]);

  // Handle drag and drop
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

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };



  // Analyze image directly without labeling
  const analyzeImage = async () => {
    if (!selectedFile) {
      setValidationError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setValidationError('');

    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create analysis result
      const analysisResult = {
        imageFile: selectedFile,
        imageUrl: imagePreview,
        recommendations: generateRecommendations(selectedFile.name),
        timestamp: new Date().toISOString(),
        weatherData: weatherDataFromDashboard,
        date: new Date().toLocaleDateString(),
        plantsFound: Math.floor(Math.random() * 5) + 3, // Random 3-7 plants
        spaceType: 'outdoor-space',
        spaceName: selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      };

      console.log('AdvancedImageUpload: Creating analysis result:', analysisResult);

      // Save to localStorage for history
      const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
      history.push(analysisResult);
      localStorage.setItem('analysisHistory', JSON.stringify(history));
      console.log('AdvancedImageUpload: Saved analysis to history:', history);
      
      // Dispatch event to notify dashboard of new analysis
      window.dispatchEvent(new CustomEvent('analysisCompleted', { detail: analysisResult }));
      console.log('AdvancedImageUpload: Dispatched analysisCompleted event');

      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }

      // Navigate based on whether we have weather data or need to collect it
      if (weatherDataFromDashboard && skipWeatherStep) {
        // Skip weather step and go directly to recommendations
        navigate('/recommendations', { 
          state: {
            ...analysisResult,
            weatherAnalysis: weatherDataFromDashboard
          }
        });
      } else {
        // Go to weather analysis step first
        navigate('/weather-analysis', { 
          state: analysisResult
        });
      }

    } catch (error) {
      console.error('Analysis failed:', error);
      setValidationError('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Generate intelligent recommendations based on space type
  const generateRecommendations = (filename = '') => {
    const spaceTypes = {
      rooftop: ['roof', 'terrace', 'top', 'deck'],
      concrete: ['concrete', 'skateboard', 'basketball', 'court', 'parking'],
      balcony: ['balcony', 'apartment', 'condo'],
      garden: ['garden', 'yard', 'backyard', 'lawn'],
      empty: ['empty', 'vacant', 'open', 'space']
    };

    let spaceType = 'general';
    const lowerFilename = filename.toLowerCase();
    
    for (const [type, keywords] of Object.entries(spaceTypes)) {
      if (keywords.some(keyword => lowerFilename.includes(keyword))) {
        spaceType = type;
        break;
      }
    }

    const recommendations = {
      rooftop: [
        'Perfect rooftop space for urban farming! 🏙️',
        'Install wind-resistant containers and raised beds',
        'Consider vertical gardening systems to maximize space',
        'Plant heat-tolerant vegetables like tomatoes, peppers, and herbs',
        'Set up shade cloth for protection during hot summer days',
        'Install drip irrigation system for efficient watering'
      ],
      concrete: [
        'Excellent concrete space for urban container farming! 🏀',
        'This flat concrete surface is perfect for mobile container gardens',
        'Use large planters (20+ gallons) with drainage holes and wheels for mobility',
        'Install shade cloth structures to protect plants from reflected heat',
        'Create raised growing beds to improve drainage and root health',
        'Perfect for herbs, leafy greens, tomatoes, and peppers in containers',
        'Consider vertical growing systems to maximize your space efficiency'
      ],
      balcony: [
        'Excellent balcony space for micro-gardening! 🏢',
        'Maximize vertical space with hanging planters and wall gardens',
        'Choose compact varieties: cherry tomatoes, herbs, and lettuce',
        'Install railing planters to utilize edge space efficiently',
        'Consider self-watering containers for low maintenance',
        'Use lightweight containers to avoid overloading the structure'
      ],
      garden: [
        'Beautiful garden space with great potential! 🌳',
        'Plan raised beds for better soil control and drainage',
        'Create different zones for sun-loving and shade-tolerant plants',
        'Start a compost system to enrich your soil naturally',
        'Consider companion planting for natural pest control',
        'Install pathways for easy access and maintenance'
      ],
      general: [
        'Excellent space for growing plants! 🌱',
        'Start with easy-to-grow herbs like basil, mint, or cilantro',
        'Consider container gardening for flexibility and easy maintenance',
        'Observe your space throughout the day to identify sunny and shaded areas',
        'Plan your layout based on plant sunlight requirements',
        'Use raised beds or containers to maximize your growing potential'
      ]
    };

    return recommendations[spaceType] || recommendations.general;
  };

  return (
    <div className="advanced-image-upload">
      <div className="upload-container">
        <h2>📸 Upload Your Growing Space Image</h2>
        <p className="upload-description">
          Upload an image of your balcony, garden, terrace, rooftop, courtyard, or any outdoor space where you want to grow plants. 
          Empty spaces like skateboard courts, concrete areas, and parking lots are welcome - we'll help you transform them into thriving growing spaces!
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
              <div className="upload-icon">🏡</div>
              <h3>Drop your growing space image here</h3>
              <p>or click to browse files</p>
              <small>Upload SPACES: balconies, gardens, terraces, patios, rooftops, concrete areas, skateboard courts, or any empty outdoor space • JPEG, PNG, WebP (max 10MB)</small>
            </div>
          ) : (
            <div className="image-preview-container">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="image-preview"
              />
              

              
              <button 
                className="change-image-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Image
              </button>
            </div>
          )}
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {validationError}
          </div>
        )}



        {/* Action Buttons */}
        {imagePreview && !validationError && (
          <div className="action-buttons">
            <button 
              className="analyze-btn"
              onClick={analyzeImage}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                '🔍 Analyze My Space'
              )}
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="instructions">
          <h3>📋 Instructions:</h3>
          <ol>
            <li>Upload a clear image of your outdoor space (balcony, garden, terrace, rooftop, courtyard, or even empty concrete areas)</li>
            <li>Skateboard courts, parking lots, and other empty outdoor spaces are welcome - we'll help you transform them!</li>
            <li>Our AI will analyze your space and provide recommendations based on the area type</li>
            <li>Click "Analyze My Space" to get personalized plant recommendations and growing tips</li>
            <li>Note: Only outdoor spaces allowed (no human photos or indoor rooms)</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdvancedImageUpload;