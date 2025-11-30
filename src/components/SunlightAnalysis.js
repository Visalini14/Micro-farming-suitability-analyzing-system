import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { analyzeSunlight } from '../services/imageAnalysis';

const SunlightAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userMarkings, setUserMarkings] = useState([]);

  useEffect(() => {
    const analyzeImage = async () => {
      const imageData = location.state?.image;
      const imageType = location.state?.imageType;

      if (!imageData) {
        navigate('/upload');
        return;
      }

      try {
        const result = await analyzeSunlight(imageData, imageType);
        setAnalysis(result);
      } catch (error) {
        console.error('Analysis error:', error);
        alert('Analysis failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    analyzeImage();
  }, [location, navigate]);

  const handleMarkArea = (type) => {
    setUserMarkings([...userMarkings, { type, position: 'user_defined' }]);
  };

  const handleContinue = () => {
    navigate('/weather-analysis', {
      state: {
        ...location.state,
        sunlightAnalysis: analysis,
        userMarkings
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <h2>Analyzing Sunlight Patterns...</h2>
        <p>Detecting sunny and shaded areas in your space</p>
      </div>
    );
  }

  return (
    <div className="sunlight-analysis-page">
      <div className="container">
        <header className="page-header">
          <h1>Sunlight Analysis</h1>
          <p>Understanding light patterns in your space</p>
        </header>

        <div className="analysis-container">
          <div className="image-analysis">
            <div className="analysis-overlay">
              <img src={location.state.image} alt="Analysis" />
              <div className="overlay-grid">
                {analysis?.zones.map((zone, index) => (
                  <div 
                    key={index}
                    className={`zone ${zone.type}`}
                    style={{
                      top: `${zone.top}%`,
                      left: `${zone.left}%`,
                      width: `${zone.width}%`,
                      height: `${zone.height}%`
                    }}
                  >
                    <span className="zone-label">{zone.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="analysis-results">
            <div className="result-card">
              <h3>☀️ Sunlight Summary</h3>
              <div className="sunlight-stats">
                <div className="stat">
                  <span className="label">Total Sun Hours</span>
                  <span className="value">{analysis?.totalSunHours} hours</span>
                </div>
                <div className="stat">
                  <span className="label">Sunny Areas</span>
                  <span className="value">{analysis?.zones.filter(z => z.type === 'sunny').length} zones</span>
                </div>
                <div className="stat">
                  <span className="label">Partial Shade</span>
                  <span className="value">{analysis?.zones.filter(z => z.type === 'partial').length} zones</span>
                </div>
                <div className="stat">
                  <span className="label">Full Shade</span>
                  <span className="value">{analysis?.zones.filter(z => z.type === 'shade').length} zones</span>
                </div>
              </div>
            </div>

            <div className="marking-tool">
              <h3>Mark Areas (Optional)</h3>
              <p>Help us understand your space better</p>
              <div className="marking-buttons">
                <button onClick={() => handleMarkArea('sunny')} className="mark-btn sunny">
                  ☀️ Mark Sunny Spot
                </button>
                <button onClick={() => handleMarkArea('shaded')} className="mark-btn shade">
                  🌳 Mark Shaded Area
                </button>
              </div>
            </div>

            <button onClick={handleContinue} className="btn-primary continue-btn">
              Continue to Weather Analysis →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunlightAnalysis;