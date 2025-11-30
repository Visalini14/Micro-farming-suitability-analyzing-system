import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPlantRecommendations } from '../services/plantService';

const CropRecommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sunlight: 'all',
    growth: 'all',
    maintenance: 'all',
    season: 'all'
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Get data from the current flow: AdvancedImageUpload -> WeatherAnalysis -> CropRecommendations
      const spaceData = location.state; // Contains space analysis from AdvancedImageUpload
      const weatherData = location.state?.weatherAnalysis; // From WeatherAnalysis component
      
      console.log('CropRecommendations: Received state:', location.state);
      console.log('CropRecommendations: Space data:', spaceData);
      console.log('CropRecommendations: Weather data:', weatherData);

      if (!spaceData) {
        console.log('CropRecommendations: No space data, redirecting to upload');
        navigate('/upload');
        return;
      }

      try {
        // Generate recommendations based on space analysis and weather data
        const recommendations = await getPlantRecommendations(spaceData, weatherData);
        setPlants(recommendations);
        setFilteredPlants(recommendations);
        
        // Save to analysis history
        const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
        history.unshift({
          date: new Date().toLocaleDateString(),
          plantsFound: recommendations.length,
          spaceType: location.state?.imageType
        });
        localStorage.setItem('analysisHistory', JSON.stringify(history.slice(0, 10)));
      } catch (error) {
        console.error('Recommendation error:', error);
        alert('Could not load plant recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [location, navigate]);

  useEffect(() => {
    let filtered = plants;

    if (filters.sunlight !== 'all') {
      filtered = filtered.filter(plant => plant.sunlight === filters.sunlight);
    }

    if (filters.growth !== 'all') {
      filtered = filtered.filter(plant => plant.growthSpeed === filters.growth);
    }

    if (filters.maintenance !== 'all') {
      filtered = filtered.filter(plant => plant.maintenance === filters.maintenance);
    }

    if (filters.season !== 'all') {
      filtered = filtered.filter(plant => plant.season === filters.season);
    }

    setFilteredPlants(filtered);
  }, [filters, plants]);

  const handleAddToGarden = (plant) => {
    const userGarden = JSON.parse(localStorage.getItem('userGarden') || '[]');
    const spaceInfo = location.state || {};
    
    userGarden.push({
      ...plant,
      id: Date.now() + Math.random(),
      added: new Date().toISOString(),
      daysGrowing: 0,
      spaceType: spaceInfo.spaceType || 'outdoor-space',
      spaceName: spaceInfo.spaceName || 'My Space',
      weatherConditions: spaceInfo.weatherAnalysis || null
    });
    localStorage.setItem('userGarden', JSON.stringify(userGarden));
    
    alert(`${plant.name} added to your garden!`);
  };

  const handleSaveCompleteSetup = () => {
    const userGarden = JSON.parse(localStorage.getItem('userGarden') || '[]');
    const spaceInfo = location.state || {};
    const timestamp = Date.now();
    
    // Add top 6 recommended plants as a complete setup
    const topPlants = filteredPlants.slice(0, 6).map((plant, index) => ({
      ...plant,
      id: timestamp + index,
      added: new Date().toISOString(),
      daysGrowing: 0,
      spaceType: spaceInfo.spaceType || 'outdoor-space',
      spaceName: spaceInfo.spaceName || 'My Space',
      weatherConditions: spaceInfo.weatherAnalysis || null,
      isPartOfSetup: true,
      setupName: `${spaceInfo.spaceName || 'My Space'} Complete Setup`
    }));
    
    userGarden.push(...topPlants);
    localStorage.setItem('userGarden', JSON.stringify(userGarden));
    
    alert(`Complete garden setup saved! ${topPlants.length} plants added to your garden.`);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <h2>Finding Perfect Plants...</h2>
        <p>Analyzing your space and weather conditions</p>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <div className="container">
        <header className="page-header">
          <h1>Perfect Plants for Your Space! 🌱</h1>
          <p>Based on your sunlight analysis and local weather conditions</p>
          <div className="header-actions">
            <button 
              onClick={handleSaveCompleteSetup}
              className="btn-primary btn-large"
              style={{ marginRight: '15px', padding: '15px 30px', fontSize: '16px' }}
            >
              🌿 Save Complete Garden Setup (Top 6 Plants)
            </button>
            <p style={{ margin: '10px 0', color: '#666', fontSize: '14px' }}>
              Save all recommended plants to your garden with one click, or add individual plants below
            </p>
          </div>
        </header>

        <div className="recommendations-container">
          <div className="filters-sidebar">
            <h3>Filter Plants</h3>
            
            <div className="filter-group">
              <label>Sunlight</label>
              <select 
                value={filters.sunlight}
                onChange={(e) => setFilters({...filters, sunlight: e.target.value})}
              >
                <option value="all">All Sunlight</option>
                <option value="full">Full Sun</option>
                <option value="partial">Partial Sun</option>
                <option value="shade">Shade</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Growth Speed</label>
              <select 
                value={filters.growth}
                onChange={(e) => setFilters({...filters, growth: e.target.value})}
              >
                <option value="all">Any Growth</option>
                <option value="fast">Fast Growing</option>
                <option value="medium">Medium</option>
                <option value="slow">Slow Growing</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Maintenance</label>
              <select 
                value={filters.maintenance}
                onChange={(e) => setFilters({...filters, maintenance: e.target.value})}
              >
                <option value="all">Any Level</option>
                <option value="low">Low Maintenance</option>
                <option value="medium">Medium</option>
                <option value="high">High Maintenance</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Season</label>
              <select 
                value={filters.season}
                onChange={(e) => setFilters({...filters, season: e.target.value})}
              >
                <option value="all">All Seasons</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="monsoon">Monsoon</option>
                <option value="winter">Winter</option>
              </select>
            </div>

            <div className="results-count">
              Showing {filteredPlants.length} of {plants.length} plants
            </div>
          </div>

          <div className="plants-grid">
            {filteredPlants.map((plant, index) => (
              <div key={index} className="plant-card">
                <div className="plant-image">
                  <div className="image-placeholder">🌿</div>
                </div>
                
                <div className="plant-info">
                  <div className="plant-header">
                    <h3>{plant.name}</h3>
                    <span className="plant-type">{plant.type}</span>
                  </div>

                  <p className="plant-description">{plant.description}</p>

                  <div className="plant-details">
                    <div className="detail">
                      <span className="label">Sunlight:</span>
                      <span className={`value sunlight-${plant.sunlight}`}>
                        {plant.sunlight === 'full' ? '☀️ Full Sun' :
                         plant.sunlight === 'partial' ? '⛅ Partial' : '🌳 Shade'}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="label">Growth:</span>
                      <span className="value">{plant.growthDuration}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Maintenance:</span>
                      <span className={`value maintenance-${plant.maintenance}`}>
                        {plant.maintenance}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="label">Season:</span>
                      <span className="value">{plant.season}</span>
                    </div>
                  </div>

                  <div className="space-tips">
                    <strong>Space Tips:</strong> {plant.spaceTips}
                  </div>

                  <div className="plant-actions">
                    <button 
                      onClick={() => handleAddToGarden(plant)}
                      className="btn-primary"
                    >
                      Add to My Garden
                    </button>
                    <button 
                      className="btn-outline"
                      onClick={() => {
                        navigate('/care-guides');
                      }}
                    >
                      View Care Guide
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="page-actions">
          <button 
            onClick={handleSaveCompleteSetup}
            className="btn-primary"
            style={{ marginRight: '10px' }}
          >
            🌱 Save Complete Garden Setup
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            ← Back to Dashboard
          </button>
          <button 
            onClick={() => {
              // Check if user is authenticated (get from localStorage)
              const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
              if (!currentUser) {
                navigate('/login', { state: { returnTo: '/upload' } });
              } else {
                navigate('/upload');
              }
            }}
            className="btn-outline"
          >
            New Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendations;