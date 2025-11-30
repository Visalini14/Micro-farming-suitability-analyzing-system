import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpaceTypeSelector from './SpaceTypeSelector';
import LocationSelector from './LocationSelector';
import EnhancedImageUpload from './EnhancedImageUpload';
import { analyzeImage } from '../services/imageAnalysis';

const ImageUpload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [spaceType, setSpaceType] = useState('');
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageValidation, setImageValidation] = useState(null);
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Enhanced image validation to detect if it's suitable for plant analysis
  const validateImageForPlantAnalysis = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Enhanced image validation for growing spaces
          const filename = file.name.toLowerCase();
          
          // Check for obvious human photos to reject
          const hasHumanKeywords = /selfie|portrait|headshot|profile|face|person|people|human|avatar/i.test(filename);
          
          // Be more permissive - allow most images that could be spaces
          if (hasHumanKeywords) {
            resolve({
              isValid: false,
              reason: 'This appears to be a photo of people. Please upload an image of your growing space (garden, balcony, terrace, etc.)'
            });
          } else if (img.width < 150 || img.height < 150) {
            resolve({
              isValid: false,
              reason: 'Image resolution is too low. Please upload a clearer image of your growing space.'
            });
          } else {
            resolve({
              isValid: true,
              reason: 'Image looks good for plant space analysis!'
            });
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (file) => {
    if (file) {
      setLoading(true);
      try {
        const validation = await validateImageForPlantAnalysis(file);
        setImageValidation(validation);
        
        if (validation.isValid) {
          setSelectedFile(file);
        } else {
          setSelectedFile(null);
          alert(validation.reason);
        }
      } catch (error) {
        console.error('Image validation error:', error);
        setSelectedFile(file); // Allow image if validation fails
      }
      setLoading(false);
    } else {
      setSelectedFile(null);
      setImageValidation(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !spaceType || !location || !weatherData) {
      let missing = [];
      if (!spaceType) missing.push('space type');
      if (!location) missing.push('location');
      if (!weatherData) missing.push('weather data');
      if (!selectedFile) missing.push('image');
      
      alert(`Please complete all steps: ${missing.join(', ')}`);
      return;
    }

    setLoading(true);
    
    try {
      // Analyze the image with all required parameters
      const imageAnalysis = await analyzeImage(selectedFile, spaceType, location);
      
      // Create analysis history entry
      const historyEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        spaceType: spaceType,
        location: location.city,
        weather: {
          temperature: weatherData.temperature,
          condition: weatherData.condition,
          humidity: weatherData.humidity
        },
        imageAnalysis: imageAnalysis,
        fileName: selectedFile.name
      };

      // Save to analysis history
      const existingHistory = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
      const updatedHistory = [historyEntry, ...existingHistory.slice(0, 9)]; // Keep last 10 entries
      localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
      
      // Navigate to recommendations with all data
      navigate('/recommendations', {
        state: {
          image: selectedFile,
          spaceType: spaceType,
          location: location,
          weatherData: weatherData,
          imageAnalysis: imageAnalysis,
          analysisId: historyEntry.id
        }
      });
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze image. Please try again.');
    }
    
    setLoading(false);
  };

  const canProceedToNext = () => {
    if (currentStep === 1) return spaceType;
    if (currentStep === 2) return location && weatherData;
    if (currentStep === 3) return selectedFile && imageValidation?.isValid;
    return false;
  };

  const isAnalyzeReady = selectedFile && spaceType && location && weatherData && imageValidation?.isValid;

  return (
    <div className="analysis-wizard">
      <div className="container">
        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Space Type</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Location & Weather</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Upload Space Image</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="step-content">
          {currentStep === 1 && (
            <SpaceTypeSelector 
              selectedSpaceType={spaceType}
              onSpaceTypeChange={setSpaceType}
            />
          )}

          {currentStep === 2 && (
            <LocationSelector 
              selectedLocation={location}
              onLocationChange={setLocation}
              onWeatherData={setWeatherData}
            />
          )}

          {currentStep === 3 && (
            <div>
              <EnhancedImageUpload 
                selectedImage={selectedFile}
                onImageSelect={handleImageSelect}
              />
              
              {imageValidation && (
                <div className={`validation-message ${imageValidation.isValid ? 'success' : 'error'}`}>
                  {imageValidation.isValid ? '✅' : '❌'} {imageValidation.reason}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="step-navigation">
          {currentStep > 1 && (
            <button 
              className="btn-secondary"
              onClick={handlePrevStep}
              disabled={loading}
            >
              ← Previous
            </button>
          )}

          {currentStep < 3 ? (
            <button 
              className="btn-primary"
              onClick={handleNextStep}
              disabled={!canProceedToNext() || loading}
            >
              Next →
            </button>
          ) : (
            <button 
              className="btn-primary analyze-btn"
              onClick={handleAnalyze}
              disabled={!isAnalyzeReady || loading}
            >
              {loading ? 'Analyzing Image...' : '🔬 Analyze & Get Recommendations'}
            </button>
          )}
        </div>

        {/* Summary */}
        {currentStep === 3 && (
          <div className="analysis-summary">
            <h4>Analysis Summary:</h4>
            <div className="summary-items">
              <div className="summary-item">
                <span className="label">Space Type:</span>
                <span className="value">{spaceType || 'Not selected'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Location:</span>
                <span className="value">{location?.city || 'Not set'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Weather:</span>
                <span className="value">
                  {weatherData ? `${weatherData.temperature}°C, ${weatherData.condition}` : 'Not loaded'}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Image Status:</span>
                <span className="value">
                  {selectedFile ? 
                    (imageValidation?.isValid ? '✅ Ready for analysis' : '❌ Invalid image') : 
                    'No image selected'
                  }
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;