import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantCard from './PlantCard';
import WeatherWidget from './WeatherWidget';
import { isAuthenticated } from '../utils/auth';

const Dashboard = ({ user }) => {
  const [plants, setPlants] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [dashboardWeather, setDashboardWeather] = useState(null);
  const navigate = useNavigate();
  const prevPlantsLength = useRef(0);

  useEffect(() => {
    const loadData = () => {
      const userGarden = JSON.parse(localStorage.getItem('userGarden') || '[]');
      console.log('Dashboard: Loaded plants from localStorage:', userGarden);
      setPlants(userGarden);
      prevPlantsLength.current = userGarden.length;

      const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
      setAnalysisHistory(history);
      console.log('Dashboard: Loaded analysis history:', history);

      // Load saved weather data
      const savedWeather = localStorage.getItem('dashboardWeather');
      if (savedWeather) {
        setDashboardWeather(JSON.parse(savedWeather));
      }
    };

    // Initial load
    loadData();

    // Listen for weather data updates from other components
    const handleStorageChange = (e) => {
      console.log('Dashboard: Storage change event:', e.key, e.newValue);
      if (e.key === 'dashboardWeather' && e.newValue) {
        setDashboardWeather(JSON.parse(e.newValue));
      }
      if (e.key === 'analysisHistory' && e.newValue) {
        setAnalysisHistory(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-window updates
    const handleWeatherUpdateEvent = (e) => {
      console.log('Dashboard: Weather update event received:', e.detail);
      setDashboardWeather(e.detail);
    };
    
    const handleAnalysisCompleted = (e) => {
      console.log('Dashboard: Analysis completed event received:', e.detail);
      loadData(); // Refresh all data including analysis history
    };
    
    window.addEventListener('weatherUpdated', handleWeatherUpdateEvent);
    window.addEventListener('analysisCompleted', handleAnalysisCompleted);

    // Refresh data when window regains focus (user returns to dashboard)
    const handleFocus = () => {
      console.log('Dashboard: Window focused, refreshing data');
      loadData();
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('weatherUpdated', handleWeatherUpdateEvent);
      window.removeEventListener('analysisCompleted', handleAnalysisCompleted);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Monitor changes to plants array
  useEffect(() => {
    // If plants were added, ensure navigation works by refreshing handlers
    if (plants.length > prevPlantsLength.current) {
      console.log('Plants added, ensuring navigation works');
      prevPlantsLength.current = plants.length;
    }
  }, [plants]);

  const removePlant = (plantId) => {
    const updatedPlants = plants.filter(plant => plant.id !== plantId);
    setPlants(updatedPlants);
    localStorage.setItem('userGarden', JSON.stringify(updatedPlants));
  };

  const handleWeatherUpdate = (weatherData) => {
    console.log('Dashboard: Received weather update:', weatherData);
    setDashboardWeather(weatherData);
  };

  // Safe navigation function with timeout and error handling
  const safeNavigate = (path, options = {}) => {
    try {
      console.log(`Dashboard: Attempting navigation to ${path}`);
      // Force navigation with timeout to ensure it works after state changes
      setTimeout(() => {
        navigate(path, options);
        console.log(`Dashboard: Navigation to ${path} completed`);
      }, 50);
    } catch (err) {
      console.error('Dashboard: Navigation error:', err);
      // Fallback for extreme cases
      window.location.href = path;
    }
  };

  // Fix navigation by using a single method for all analysis/add buttons
  const startAnalysisWithWeather = (e) => {
    if (e) e.preventDefault(); // Prevent any default action
    console.log('Dashboard: startAnalysisWithWeather called');

    // Check if user is authenticated using utility
    if (!isAuthenticated()) {
      safeNavigate('/login', { state: { returnTo: '/upload' } });
      return;
    }
    
    if (dashboardWeather) {
      console.log('Dashboard: Navigating with weather data:', dashboardWeather);
      safeNavigate('/upload', { 
        state: { 
          weatherData: dashboardWeather,
          skipWeatherStep: true 
        } 
      });
    } else {
      console.log('Dashboard: Navigating without weather data');
      safeNavigate('/upload');
    }
  };

  const navigateToCareGuides = (e) => {
    if (e) e.preventDefault();
    console.log('Dashboard: navigateToCareGuides called');
    
    if (!isAuthenticated()) {
      safeNavigate('/login', { state: { returnTo: '/care-guides' } });
    } else {
      safeNavigate('/care-guides');
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <header className="dashboard-header">
          <h1>Welcome back, {user?.name || 'Gardener'}! 🌱</h1>
          <p>Here's an overview of your microfarming journey</p>
        </header>

        <div className="dashboard-grid">
          <div className="plants-section">
            <div className="section-header">
              <h2>My Plants</h2>
              <button
                onClick={(e) => startAnalysisWithWeather(e)}
                className="btn-primary"
                type="button"
              >
                + Add New Plants
              </button>
            </div>

            {plants.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🌿</div>
                <h3>No plants in your garden yet</h3>
                <p>Start by analyzing your space to get plant recommendations</p>
                <button
                  onClick={(e) => startAnalysisWithWeather(e)}
                  className="btn-primary"
                  type="button"
                >
                  Start Your First Analysis
                </button>
              </div>
            ) : (
              <div className="plants-grid-dashboard">
                {plants.map(plant => (
                  <PlantCard 
                    key={plant.id} 
                    plant={plant} 
                    onRemove={removePlant}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-sidebar">
            <WeatherWidget onWeatherUpdate={handleWeatherUpdate} />



            <div className="analysis-history">
              <h3>Recent Analysis</h3>
              {analysisHistory.length === 0 ? (
                <p>No analysis history</p>
              ) : (
                <div className="history-list">
                  {analysisHistory.slice(0, 5).map((analysis, index) => (
                    <div key={index} className="history-item">
                      <span className="date">{analysis.date}</span>
                      <span className="plants-found">{analysis.plantsFound} plants found</span>
                    </div>
                  ))}
                </div>
              )}
              <button 
                onClick={(e) => startAnalysisWithWeather(e)} 
                className="btn-outline" 
                type="button" 
                style={{ marginTop: '15px', display: 'block', textAlign: 'center', width: '100%', border: 'none', background: 'none', color: '#4CAF50' }}
              >
                New Analysis
              </button>
            </div>

            <div className="quick-actions">
              <button 
                onClick={(e) => startAnalysisWithWeather(e)} 
                className="btn-primary" 
                type="button"
              >
                📸 New Analysis
              </button>
              <button 
                className="btn-outline"
                type="button"
                onClick={(e) => navigateToCareGuides(e)}
              >
                📚 Care Guides
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;