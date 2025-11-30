import React, { useState } from 'react';

const ManualWeatherEntry = ({ onWeatherSubmit, onCancel }) => {
  const [weatherData, setWeatherData] = useState({
    city: '',
    temperature: '',
    feelsLike: '',
    humidity: '',
    condition: 'Sunny',
    windSpeed: '',
    rainProbability: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const weatherConditions = [
    'Sunny',
    'Partly Cloudy',
    'Cloudy',
    'Overcast',
    'Rainy',
    'Drizzle',
    'Thunderstorm',
    'Foggy',
    'Windy',
    'Hot',
    'Cool'
  ];

  const validateWeatherData = (data) => {
    const validationErrors = {};

    // City validation
    if (!data.city.trim()) {
      validationErrors.city = 'City name is required';
    }

    // Temperature validation
    const temp = parseFloat(data.temperature);
    if (!data.temperature || isNaN(temp)) {
      validationErrors.temperature = 'Temperature is required';
    } else if (temp < -50 || temp > 60) {
      validationErrors.temperature = 'Temperature must be between -50°C and 60°C';
    }

    // Feels like temperature validation
    const feelsLike = parseFloat(data.feelsLike);
    if (data.feelsLike && !isNaN(feelsLike)) {
      if (feelsLike < -60 || feelsLike > 70) {
        validationErrors.feelsLike = 'Feels like temperature must be between -60°C and 70°C';
      }
    }

    // Humidity validation
    const humidity = parseFloat(data.humidity);
    if (!data.humidity || isNaN(humidity)) {
      validationErrors.humidity = 'Humidity is required';
    } else if (humidity < 0 || humidity > 100) {
      validationErrors.humidity = 'Humidity must be between 0% and 100%';
    }

    // Wind speed validation
    const windSpeed = parseFloat(data.windSpeed);
    if (data.windSpeed && !isNaN(windSpeed)) {
      if (windSpeed < 0 || windSpeed > 300) {
        validationErrors.windSpeed = 'Wind speed must be between 0 and 300 km/h';
      }
    }

    // Rain probability validation
    const rainProb = parseFloat(data.rainProbability);
    if (data.rainProbability && !isNaN(rainProb)) {
      if (rainProb < 0 || rainProb > 100) {
        validationErrors.rainProbability = 'Rain probability must be between 0% and 100%';
      }
    }

    return validationErrors;
  };

  const handleInputChange = (field, value) => {
    setWeatherData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', weatherData);

    const validationErrors = validateWeatherData(weatherData);
    console.log('Validation errors:', validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('Form has validation errors, not submitting');
      return;
    }

    // Process the weather data
    const processedData = {
      city: weatherData.city.trim(),
      temperature: parseInt(weatherData.temperature),
      feelsLike: weatherData.feelsLike ? parseInt(weatherData.feelsLike) : parseInt(weatherData.temperature) + 2,
      humidity: parseInt(weatherData.humidity),
      condition: weatherData.condition,
      description: weatherData.description || getDefaultDescription(weatherData.condition),
      windSpeed: weatherData.windSpeed ? parseInt(weatherData.windSpeed) : 5,
      rainProbability: weatherData.rainProbability ? parseInt(weatherData.rainProbability) : getDefaultRainProbability(weatherData.condition),
      forecast: generateSimpleForecast(weatherData),
      growingConditions: generateGrowingConditions(weatherData)
    };

    console.log('Processed weather data:', processedData);
    onWeatherSubmit(processedData);
  };

  const getDefaultDescription = (condition) => {
    const descriptions = {
      'Sunny': 'Clear and sunny skies',
      'Partly Cloudy': 'Partly cloudy with some sun',
      'Cloudy': 'Cloudy skies throughout the day',
      'Overcast': 'Completely overcast with no sun',
      'Rainy': 'Rainy conditions expected',
      'Drizzle': 'Light drizzle throughout the day',
      'Thunderstorm': 'Thunderstorms with heavy rain',
      'Foggy': 'Foggy conditions with limited visibility',
      'Windy': 'Windy conditions throughout the day',
      'Hot': 'Hot and sunny weather',
      'Cool': 'Cool and pleasant weather'
    };
    return descriptions[condition] || 'Pleasant weather conditions';
  };

  const getDefaultRainProbability = (condition) => {
    const rainProbs = {
      'Sunny': 5,
      'Partly Cloudy': 15,
      'Cloudy': 25,
      'Overcast': 35,
      'Rainy': 80,
      'Drizzle': 60,
      'Thunderstorm': 90,
      'Foggy': 20,
      'Windy': 10,
      'Hot': 5,
      'Cool': 15
    };
    return rainProbs[condition] || 20;
  };

  const generateSimpleForecast = (data) => {
    const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseTemp = parseInt(data.temperature);
    
    return days.map((day, index) => {
      const tempVariation = Math.floor(Math.random() * 6) - 3; // ±3 degrees variation
      return {
        day,
        high: baseTemp + tempVariation + 2,
        low: baseTemp + tempVariation - 3,
        condition: index === 0 ? data.condition : weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
        icon: getWeatherIcon(index === 0 ? data.condition : weatherConditions[Math.floor(Math.random() * weatherConditions.length)]),
        rainProbability: index === 0 ? (data.rainProbability || getDefaultRainProbability(data.condition)) : Math.floor(Math.random() * 60) + 10
      };
    });
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'Sunny': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Overcast': '☁️',
      'Rainy': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Foggy': '🌫️',
      'Windy': '💨',
      'Hot': '🌡️',
      'Cool': '🌤️'
    };
    return icons[condition] || '☀️';
  };

  const generateGrowingConditions = (data) => {
    const temp = parseInt(data.temperature);
    const humidity = parseInt(data.humidity);
    const condition = data.condition;
    
    const favorable = [];
    const challenges = [];
    const recommendations = [];

    // Temperature analysis
    if (temp >= 20 && temp <= 30) {
      favorable.push('Ideal temperature range for most plants');
    } else if (temp > 30) {
      challenges.push('High temperatures may stress some plants');
      recommendations.push('Provide afternoon shade and extra watering');
    } else if (temp < 15) {
      challenges.push('Cool temperatures may slow plant growth');
      recommendations.push('Consider cold-hardy plants or indoor growing');
    }

    // Humidity analysis
    if (humidity >= 40 && humidity <= 70) {
      favorable.push('Good humidity levels for plant growth');
    } else if (humidity > 70) {
      challenges.push('High humidity may increase disease risk');
      recommendations.push('Ensure good air circulation around plants');
    } else {
      challenges.push('Low humidity may stress plants');
      recommendations.push('Consider increasing humidity around plants');
    }

    // Condition analysis
    if (condition === 'Sunny') {
      favorable.push('Excellent light conditions for photosynthesis');
    } else if (condition === 'Rainy' || condition === 'Thunderstorm') {
      challenges.push('Excessive moisture may cause root rot');
      recommendations.push('Ensure proper drainage for potted plants');
    } else if (condition === 'Cloudy' || condition === 'Overcast') {
      challenges.push('Limited sunlight may slow growth');
      recommendations.push('Consider supplemental lighting for indoor plants');
    }

    return { favorable, challenges, recommendations };
  };

  return (
    <div className="manual-weather-entry">
      <div className="weather-form-container">
        <h3>🌤️ Enter Weather Information</h3>
        <p>Manually input your current weather conditions for accurate growing recommendations</p>

        <form onSubmit={handleSubmit} className="weather-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Location/City *</label>
              <input
                id="city"
                type="text"
                value={weatherData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="e.g., Mumbai, Delhi, Your City"
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="condition">Weather Condition *</label>
              <select
                id="condition"
                value={weatherData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
              >
                {weatherConditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="temperature">Temperature (°C) *</label>
              <input
                id="temperature"
                type="number"
                value={weatherData.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                placeholder="e.g., 25"
                min="-50"
                max="60"
                className={errors.temperature ? 'error' : ''}
              />
              {errors.temperature && <span className="error-text">{errors.temperature}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="feelsLike">Feels Like (°C)</label>
              <input
                id="feelsLike"
                type="number"
                value={weatherData.feelsLike}
                onChange={(e) => handleInputChange('feelsLike', e.target.value)}
                placeholder="e.g., 28 (optional)"
                min="-60"
                max="70"
                className={errors.feelsLike ? 'error' : ''}
              />
              {errors.feelsLike && <span className="error-text">{errors.feelsLike}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="humidity">Humidity (%) *</label>
              <input
                id="humidity"
                type="number"
                value={weatherData.humidity}
                onChange={(e) => handleInputChange('humidity', e.target.value)}
                placeholder="e.g., 65"
                min="0"
                max="100"
                className={errors.humidity ? 'error' : ''}
              />
              {errors.humidity && <span className="error-text">{errors.humidity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="windSpeed">Wind Speed (km/h)</label>
              <input
                id="windSpeed"
                type="number"
                value={weatherData.windSpeed}
                onChange={(e) => handleInputChange('windSpeed', e.target.value)}
                placeholder="e.g., 10 (optional)"
                min="0"
                max="300"
                className={errors.windSpeed ? 'error' : ''}
              />
              {errors.windSpeed && <span className="error-text">{errors.windSpeed}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rainProbability">Rain Probability (%)</label>
              <input
                id="rainProbability"
                type="number"
                value={weatherData.rainProbability}
                onChange={(e) => handleInputChange('rainProbability', e.target.value)}
                placeholder="e.g., 20 (optional)"
                min="0"
                max="100"
                className={errors.rainProbability ? 'error' : ''}
              />
              {errors.rainProbability && <span className="error-text">{errors.rainProbability}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                value={weatherData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="e.g., Clear and sunny skies (optional)"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Use This Weather Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualWeatherEntry;