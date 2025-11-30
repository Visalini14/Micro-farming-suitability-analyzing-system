import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SpaceResults.css';

const SpaceResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysisData = location.state;

  if (!analysisData) {
    return (
      <div className="space-results-container">
        <div className="error-state">
          <h2>No Analysis Data Found</h2>
          <p>Please analyze a space first.</p>
          <button 
            onClick={() => {
              const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
              if (!currentUser) {
                navigate('/login', { state: { returnTo: '/space-analyzer' } });
              } else {
                navigate('/space-analyzer');
              }
            }} 
            className="btn-primary"
          >
            Start Space Analysis
          </button>
        </div>
      </div>
    );
  }

  const { 
    imageUrl, 
    spaceType, 
    measurements, 
    totalArea, 
    spaceAnalysis,
    referenceObject,
    referenceSize
  } = analysisData;

  return (
    <div className="space-results-container">
      <header className="results-header">
        <h1>📏 Space Analysis Results</h1>
        <p>Complete analysis of your {spaceType.replace('_', ' ')} space</p>
      </header>

      <div className="results-grid">
        {/* Space Overview */}
        <div className="result-card space-overview">
          <h2>🏞️ Space Overview</h2>
          <div className="overview-stats">
            <div className="stat-large">
              <span className="stat-value">{totalArea}</span>
              <span className="stat-unit">m²</span>
              <span className="stat-label">Total Area</span>
            </div>
            <div className="stat-medium">
              <span className="stat-value">{spaceAnalysis.plantCapacity}</span>
              <span className="stat-label">Plant Capacity</span>
            </div>
            <div className="stat-medium">
              <span className="stat-value">{measurements.length}</span>
              <span className="stat-label">Measurements</span>
            </div>
          </div>
          
          {imageUrl && (
            <div className="analyzed-space-image">
              <img src={imageUrl} alt="Analyzed space" />
              <p>Your measured {spaceType.replace('_', ' ')}</p>
            </div>
          )}
        </div>

        {/* Gardening Type */}
        <div className="result-card gardening-type">
          <h2>🌱 Recommended Gardening Type</h2>
          <div className="gardening-type-display">
            <div className="type-icon">
              {spaceAnalysis.gardeningType === 'container_gardening' && '🪴'}
              {spaceAnalysis.gardeningType === 'small_garden' && '🌿'}
              {spaceAnalysis.gardeningType === 'medium_garden' && '🏡'}
              {spaceAnalysis.gardeningType === 'large_garden' && '🌳'}
              {spaceAnalysis.gardeningType === 'field_scale' && '🚜'}
            </div>
            <h3>{spaceAnalysis.gardeningType.replace('_', ' ').toUpperCase()}</h3>
            <p className="type-description">{spaceAnalysis.layout}</p>
          </div>
        </div>

        {/* Measurements Details */}
        <div className="result-card measurements-detail">
          <h2>📐 Detailed Measurements</h2>
          <div className="reference-info">
            <p><strong>Reference:</strong> {referenceObject} ({referenceSize}m)</p>
          </div>
          <div className="measurements-list">
            {measurements.map((measurement, index) => (
              <div key={measurement.id} className="measurement-row">
                <span className="measurement-number">{index + 1}</span>
                <span className="measurement-length">{measurement.realLength}m</span>
                {index === 0 && <span className="reference-badge">Reference</span>}
                {index === 1 && measurements.length >= 2 && <span className="secondary-badge">Secondary</span>}
              </div>
            ))}
          </div>
          
          {totalArea > 0 && (
            <div className="area-calculation">
              <div className="calculation-formula">
                <span>Area = {measurements[0]?.realLength}m × {measurements[1]?.realLength}m</span>
                <span className="equals">=</span>
                <span className="total">{totalArea}m²</span>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="result-card recommendations-full">
          <h2>💡 Detailed Recommendations</h2>
          <div className="recommendations-list">
            {spaceAnalysis.recommendations.map((recommendation, index) => (
              <div key={index} className="recommendation-item">
                <div className="recommendation-icon">
                  {index === 0 && '🎯'}
                  {index === 1 && '📋'}
                  {index === 2 && '🌱'}
                  {index === 3 && '🔧'}
                  {index === 4 && '💧'}
                  {index >= 5 && '⭐'}
                </div>
                <p>{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plant Layout Suggestions */}
        <div className="result-card layout-suggestions">
          <h2>🗺️ Layout Planning</h2>
          <div className="layout-content">
            <div className="layout-type">
              <h3>Recommended Layout: {spaceAnalysis.layout}</h3>
            </div>
            
            <div className="layout-zones">
              {spaceAnalysis.gardeningType === 'container_gardening' && (
                <div className="zone-list">
                  <div className="zone-item">🪴 Container Zone 1: Herbs (2-3 pots)</div>
                  <div className="zone-item">🪴 Container Zone 2: Leafy greens (3-4 pots)</div>
                  <div className="zone-item">🪴 Vertical Zone: Hanging plants</div>
                </div>
              )}
              
              {spaceAnalysis.gardeningType === 'small_garden' && (
                <div className="zone-list">
                  <div className="zone-item">🟢 Raised Bed 1: Quick crops (lettuce, radish)</div>
                  <div className="zone-item">🟢 Raised Bed 2: Medium crops (herbs, peppers)</div>
                  <div className="zone-item">🟢 Container Area: Larger plants (tomatoes)</div>
                </div>
              )}
              
              {spaceAnalysis.gardeningType === 'medium_garden' && (
                <div className="zone-list">
                  <div className="zone-item">🌿 Zone 1: Root vegetables</div>
                  <div className="zone-item">🌿 Zone 2: Leafy greens</div>
                  <div className="zone-item">🌿 Zone 3: Fruiting plants</div>
                  <div className="zone-item">🚶 Pathways for access</div>
                </div>
              )}
              
              {spaceAnalysis.gardeningType === 'large_garden' && (
                <div className="zone-list">
                  <div className="zone-item">🌳 Permanent: Fruit trees/berry bushes</div>
                  <div className="zone-item">🌾 Annual crops: Rotation zones</div>
                  <div className="zone-item">🏠 Structures: Greenhouse/shed area</div>
                  <div className="zone-item">♻️ Utility: Compost and storage</div>
                </div>
              )}
              
              {spaceAnalysis.gardeningType === 'field_scale' && (
                <div className="zone-list">
                  <div className="zone-item">🚜 Field Rows: Main crop production</div>
                  <div className="zone-item">🔄 Rotation Zones: Soil health management</div>
                  <div className="zone-item">🏭 Processing: Storage and handling area</div>
                  <div className="zone-item">💧 Irrigation: Water distribution system</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="result-card next-steps-full">
          <h2>🚀 Your Action Plan</h2>
          <div className="steps-timeline">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Plan Layout</h4>
                <p>Use your measurements to mark growing zones and pathways</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Prepare Infrastructure</h4>
                <p>Set up containers, raised beds, or prepare soil based on your space type</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Install Systems</h4>
                <p>Add irrigation, support structures, and storage as recommended</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Start Planting</h4>
                <p>Begin with recommended plants for your space size and type</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="btn-secondary" 
          onClick={() => navigate('/space-analyzer')}
        >
          ← Analyze Another Space
        </button>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/history')}
        >
          View Analysis History →
        </button>
      </div>
    </div>
  );
};

export default SpaceResults;