import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CityWeatherEntry from './CityWeatherEntry';

const WeatherAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [weather, setWeather] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(true);

  const handleWeatherSubmit = (weatherData) => {
    console.log('Weather data received in WeatherAnalysis:', weatherData);
    setWeather(weatherData);
    setShowManualEntry(false);
    
    // Update dashboard weather data so it syncs back
    localStorage.setItem('dashboardWeather', JSON.stringify(weatherData));
    
    // Dispatch custom event to notify dashboard of weather update
    window.dispatchEvent(new CustomEvent('weatherUpdated', { detail: weatherData }));
  };

  const handleContinue = () => {
    if (!weather) {
      alert('Please enter weather data first');
      return;
    }

    navigate('/recommendations', {
      state: {
        ...location.state,
        weatherAnalysis: weather
      }
    });
  };

  const handleEditWeather = () => {
    setShowManualEntry(true);
  };

  return (
    <div className="weather-analysis-page">
      <div className="container">
        <header className="page-header">
          <h1>Weather & Climate Analysis</h1>
          <p>Understanding your local growing conditions</p>
        </header>

        <div className="weather-container">
          {showManualEntry ? (
            <CityWeatherEntry 
              onWeatherSubmit={handleWeatherSubmit}
              onCancel={() => navigate('/upload')}
            />
          ) : weather && (
            <div className="weather-results">
              <div className="current-weather">
                <h3>Current Conditions in {weather.city}</h3>
                <div className="weather-main">
                  <div className="temperature">{weather.temperature}°C</div>
                  <div className="condition">{weather.condition}</div>
                </div>
                <div className="weather-details">
                  <div className="detail">
                    <span className="label">Feels Like</span>
                    <span className="value">{weather.feelsLike}°C</span>
                  </div>
                  <div className="detail">
                    <span className="label">Humidity</span>
                    <span className="value">{weather.humidity}%</span>
                  </div>
                  <div className="detail">
                    <span className="label">Rain Probability</span>
                    <span className="value">{weather.rainProbability}%</span>
                  </div>
                  <div className="detail">
                    <span className="label">Wind Speed</span>
                    <span className="value">{weather.windSpeed} km/h</span>
                  </div>
                </div>
              </div>

              <div className="weather-forecast">
                <h3>7-Day Forecast</h3>
                <div className="forecast-grid">
                  {weather.forecast.map((day, index) => (
                    <div key={index} className="forecast-day">
                      <div className="day">{day.day}</div>
                      <div className="forecast-icon">{day.icon}</div>
                      <div className="forecast-temp">{day.high}° / {day.low}°</div>
                      <div className="forecast-condition">{day.condition}</div>
                      <div className="forecast-rain">💧 {day.rainProbability}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="growing-conditions">
                <h3>🌱 Growing Conditions Analysis</h3>
                <div className="conditions-grid">
                  <div className="condition-card favorable">
                    <h4>Favorable Conditions</h4>
                    <ul>
                      {weather.growingConditions.favorable.map((condition, idx) => (
                        <li key={idx}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="condition-card challenges">
                    <h4>Challenges</h4>
                    <ul>
                      {weather.growingConditions.challenges.map((condition, idx) => (
                        <li key={idx}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="condition-card recommendations">
                    <h4>Seasonal Tips</h4>
                    <ul>
                      {weather.growingConditions.recommendations.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showManualEntry && (
            <div className="weather-actions">
              <button 
                onClick={handleEditWeather}
                className="btn-secondary edit-weather-btn"
              >
                Edit Weather Data
              </button>
              <button 
                onClick={handleContinue}
                disabled={!weather}
                className="btn-primary continue-btn"
              >
                Get Plant Recommendations →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherAnalysis;