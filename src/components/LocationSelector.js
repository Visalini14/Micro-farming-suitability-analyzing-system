import React, { useState } from 'react';
import { getLocation, getWeatherData } from '../services/weatherService';

const LocationSelector = ({ selectedLocation, onLocationChange, onWeatherData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualLocation, setManualLocation] = useState('');

  const handleCurrentLocation = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Getting current location...');
      const locationData = await getLocation();
      console.log('Location data received:', locationData);
      
      if (!locationData.city) {
        throw new Error('Unable to determine city from location');
      }
      
      console.log('Fetching weather for:', locationData.city);
      const weather = await getWeatherData(locationData.city);
      console.log('Weather data received:', weather);
      
      if (!weather || !weather.temperature) {
        throw new Error('Unable to fetch weather data');
      }
      
      onLocationChange({
        city: locationData.city,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        source: 'gps'
      });
      
      if (onWeatherData) {
        onWeatherData(weather);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Location/Weather error:', err);
      setError(`Unable to get location or weather data: ${err.message}. Please enter your city manually.`);
      setLoading(false);
    }
  };

  const handleManualLocation = async (e) => {
    e.preventDefault();
    if (!manualLocation.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching weather for manual location:', manualLocation);
      const weather = await getWeatherData(manualLocation.trim());
      console.log('Manual weather data received:', weather);
      
      if (!weather || !weather.temperature) {
        throw new Error('Unable to fetch weather data for this location');
      }
      
      onLocationChange({
        city: manualLocation.trim(),
        source: 'manual'
      });
      
      if (onWeatherData) {
        onWeatherData(weather);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Manual location error:', err);
      setError(`Unable to fetch weather for "${manualLocation}". Please check the spelling or try a different city.`);
      setLoading(false);
    }
  };

  return (
    <div className="location-selector">
      <h3>Select Your Location</h3>
      <p>We need your location to provide accurate weather data and crop recommendations.</p>
      
      <div className="location-options">
        <div className="current-location-option">
          <button 
            className="btn-primary location-btn"
            onClick={handleCurrentLocation}
            disabled={loading}
          >
            {loading ? '📍 Getting Location...' : '📍 Use Current Location'}
          </button>
          <p className="location-help">Uses GPS to get your exact location and weather</p>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <form onSubmit={handleManualLocation} className="manual-location-option">
          <div className="form-group">
            <label htmlFor="manual-location">Enter Your City</label>
            <input
              id="manual-location"
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder="e.g., Mumbai, Delhi, Bangalore, Chowari"
              className="location-input"
            />
          </div>
          <button 
            type="submit" 
            className="btn-secondary location-btn"
            disabled={loading || !manualLocation.trim()}
          >
            {loading ? '🌤️ Getting Weather...' : '🌤️ Get Weather Data'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {selectedLocation && (
        <div className="selected-location-info">
          <div className="location-status">
            ✅ Location: <strong>{selectedLocation.city}</strong>
            {selectedLocation.source === 'gps' && (
              <span className="gps-indicator"> (GPS)</span>
            )}
          </div>
          {selectedLocation.latitude && selectedLocation.longitude && (
            <div className="coordinates">
              📍 Coordinates: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
            </div>
          )}
        </div>
      )}

      {/* Weather Status Display */}
      {selectedLocation && (
        <div className="weather-status">
          <h4>🌤️ Current Weather Status:</h4>
          <div className="weather-loading">
            {loading ? (
              <span>Loading weather data...</span>
            ) : error ? (
              <span className="error">Weather data not available</span>
            ) : (
              <span className="success">Weather data loaded successfully</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;