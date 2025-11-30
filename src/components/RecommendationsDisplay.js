import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RecommendationsDisplay.css';

const RecommendationsDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysisData = location.state;

  if (!analysisData) {
    return (
      <div className="recommendations-container">
        <div className="error-state">
          <h2>No Analysis Data Found</h2>
          <p>Please upload and analyze an image first.</p>
          <button 
            onClick={() => {
              const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
              if (!currentUser) {
                navigate('/login', { state: { returnTo: '/upload' } });
              } else {
                navigate('/upload');
              }
            }}
            className="btn-primary"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    );
  }

  const { imageUrl, labeledAreas, sunnyAreas, shadedAreas, recommendations } = analysisData;

  return (
    <div className="recommendations-container">
      <header className="recommendations-header">
        <h1>🌱 Your Space Analysis Results</h1>
        <p>Based on your labeled areas, here are our recommendations</p>
      </header>

      <div className="analysis-summary">
        <div className="summary-stats">
          <div className="stat-item sunny">
            <div className="stat-icon">☀️</div>
            <div className="stat-content">
              <h3>{sunnyAreas}</h3>
              <p>Sunny Areas</p>
            </div>
          </div>
          <div className="stat-item shaded">
            <div className="stat-icon">🌙</div>
            <div className="stat-content">
              <h3>{shadedAreas}</h3>
              <p>Shaded Areas</p>
            </div>
          </div>
          <div className="stat-item total">
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <h3>{labeledAreas.length}</h3>
              <p>Total Labeled</p>
            </div>
          </div>
        </div>
        
        {imageUrl && (
          <div className="analyzed-image">
            <h3>Your Analyzed Space</h3>
            <img src={imageUrl} alt="Analyzed growing space" />
          </div>
        )}
      </div>

      <div className="recommendations-section">
        <h2>📋 Personalized Recommendations</h2>
        <div className="recommendations-list">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="recommendation-item">
              <div className="recommendation-icon">🌿</div>
              <p>{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="plant-suggestions">
        <h2>🌱 Suggested Plants for Your Space</h2>
        <div className="plants-grid">
          {sunnyAreas > 0 && (
            <div className="plant-category">
              <h3>☀️ For Sunny Areas</h3>
              <div className="plant-list">
                <div className="plant-item">
                  <span className="plant-emoji">🍅</span>
                  <div className="plant-info">
                    <h4>Tomatoes</h4>
                    <p>Perfect for 6+ hours of direct sunlight</p>
                  </div>
                </div>
                <div className="plant-item">
                  <span className="plant-emoji">🌶️</span>
                  <div className="plant-info">
                    <h4>Peppers</h4>
                    <p>Love heat and full sun exposure</p>
                  </div>
                </div>
                <div className="plant-item">
                  <span className="plant-emoji">🌿</span>
                  <div className="plant-info">
                    <h4>Basil</h4>
                    <p>Thrives in warm, sunny conditions</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {shadedAreas > 0 && (
            <div className="plant-category">
              <h3>🌙 For Shaded Areas</h3>
              <div className="plant-list">
                <div className="plant-item">
                  <span className="plant-emoji">🥬</span>
                  <div className="plant-info">
                    <h4>Lettuce</h4>
                    <p>Prefers partial shade, especially in hot weather</p>
                  </div>
                </div>
                <div className="plant-item">
                  <span className="plant-emoji">🌿</span>
                  <div className="plant-info">
                    <h4>Spinach</h4>
                    <p>Cool-season crop that tolerates shade</p>
                  </div>
                </div>
                <div className="plant-item">
                  <span className="plant-emoji">🌱</span>
                  <div className="plant-info">
                    <h4>Mint</h4>
                    <p>Grows well in partial shade</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="next-steps">
        <h2>🚀 Next Steps</h2>
        <div className="steps-grid">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Plan Your Layout</h4>
              <p>Use the sunny/shaded areas you marked to position your plants optimally</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Prepare Containers</h4>
              <p>Get appropriate sized pots or planters for your chosen plants</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Start Planting</h4>
              <p>Begin with easy plants like herbs and lettuce for quick success</p>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="btn-secondary" 
          onClick={() => navigate('/upload')}
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

export default RecommendationsDisplay;