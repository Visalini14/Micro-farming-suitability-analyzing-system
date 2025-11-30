import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AnalysisHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('analysisHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading analysis history:', error);
    }
    setLoading(false);
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all analysis history?')) {
      localStorage.removeItem('analysisHistory');
      setHistory([]);
    }
  };

  const deleteHistoryItem = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getSpaceTypeDisplay = (type) => {
    const types = {
      balcony: 'Balcony',
      window_seat: 'Window Seat',
      terrace: 'Terrace/Rooftop',
      garden: 'Garden',
      indoor: 'Indoor Room',
      greenhouse: 'Greenhouse'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="analysis-history loading">
        <div className="container">
          <h2>Loading Analysis History...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-history">
      <div className="container">
        <header className="history-header">
          <h1>📊 Analysis History</h1>
          <p>View your past plant space analyses and recommendations</p>
          
          <div className="history-actions">
            <button 
              className="btn-primary"
              onClick={() => {
                const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
                if (!currentUser) {
                  navigate('/login', { state: { returnTo: '/upload' } });
                } else {
                  navigate('/upload');
                }
              }}
            >
              ➕ New Analysis
            </button>
            {history.length > 0 && (
              <button 
                className="btn-danger"
                onClick={clearHistory}
              >
                🗑️ Clear History
              </button>
            )}
          </div>
        </header>

        {history.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📈</div>
            <h3>No Analysis History Yet</h3>
            <p>Start by analyzing your growing space to see your history here.</p>
            <button 
              className="btn-primary"
              onClick={() => {
                const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
                if (!currentUser) {
                  navigate('/login', { state: { returnTo: '/upload' } });
                } else {
                  navigate('/upload');
                }
              }}
            >
              Start Your First Analysis
            </button>
          </div>
        ) : (
          <div className="history-grid">
            {history.map((item) => (
              <div key={item.id} className="history-card">
                <div className="card-header">
                  <div className="analysis-date">
                    <strong>{formatDate(item.date)}</strong>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteHistoryItem(item.id)}
                    title="Delete this analysis"
                  >
                    ❌
                  </button>
                </div>

                <div className="card-content">
                  <div className="analysis-details">
                    <div className="detail-row">
                      <span className="label">Space Type:</span>
                      <span className="value">{getSpaceTypeDisplay(item.spaceType)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Location:</span>
                      <span className="value">{item.location}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Weather:</span>
                      <span className="value">
                        {item.weather.temperature}°C, {item.weather.condition}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Humidity:</span>
                      <span className="value">{item.weather.humidity}%</span>
                    </div>
                    {item.fileName && (
                      <div className="detail-row">
                        <span className="label">Image:</span>
                        <span className="value file-name">{item.fileName}</span>
                      </div>
                    )}
                  </div>

                  {item.imageAnalysis && (
                    <div className="image-analysis-summary">
                      <h4>🔍 Image Analysis:</h4>
                      <div className="analysis-result">
                        <span className="sunlight-condition">
                          Sunlight: {item.imageAnalysis.condition} ({item.imageAnalysis.hours} hours)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button 
                    className="btn-secondary view-btn"
                    onClick={() => navigate('/recommendations', {
                      state: {
                        spaceType: item.spaceType,
                        location: { city: item.location },
                        weatherData: item.weather,
                        imageAnalysis: item.imageAnalysis,
                        analysisId: item.id,
                        isHistoryView: true
                      }
                    })}
                  >
                    📋 View Recommendations
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisHistory;
