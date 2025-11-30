import React, { useState, useEffect } from 'react';

const WeatherWidget = ({ onWeatherUpdate }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [showInput, setShowInput] = useState(true);

  // Load saved weather data from localStorage
  useEffect(() => {
    const savedWeather = localStorage.getItem('dashboardWeather');
    if (savedWeather) {
      const weatherData = JSON.parse(savedWeather);
      setWeather(weatherData);
      setShowInput(false);
      // Notify parent component
      if (onWeatherUpdate) {
        onWeatherUpdate(weatherData);
      }
    }
  }, [onWeatherUpdate]);

  // City-based weather data with realistic seasonal variations
  const cityWeatherData = {
    'Mumbai': { 
      summer: { temp: 32, humidity: 75, condition: 'Hot', description: 'Hot and humid weather' },
      monsoon: { temp: 28, humidity: 90, condition: 'Rainy', description: 'Heavy monsoon rains' },
      winter: { temp: 25, humidity: 65, condition: 'Pleasant', description: 'Cool and pleasant weather' }
    },
    'Delhi': { 
      summer: { temp: 38, humidity: 45, condition: 'Hot', description: 'Very hot and dry weather' },
      monsoon: { temp: 32, humidity: 80, condition: 'Humid', description: 'Hot and humid with occasional rain' },
      winter: { temp: 15, humidity: 55, condition: 'Cool', description: 'Cold and foggy mornings' }
    },
    'Bangalore': { 
      summer: { temp: 30, humidity: 60, condition: 'Pleasant', description: 'Warm and pleasant weather' },
      monsoon: { temp: 26, humidity: 85, condition: 'Rainy', description: 'Moderate rain with cool weather' },
      winter: { temp: 22, humidity: 70, condition: 'Cool', description: 'Cool and comfortable weather' }
    },
    'Chennai': { 
      summer: { temp: 35, humidity: 70, condition: 'Hot', description: 'Hot and humid weather' },
      monsoon: { temp: 30, humidity: 85, condition: 'Rainy', description: 'Heavy rains and high humidity' },
      winter: { temp: 27, humidity: 75, condition: 'Warm', description: 'Warm and humid weather' }
    },
    'Kolkata': { 
      summer: { temp: 36, humidity: 80, condition: 'Hot', description: 'Very hot and humid weather' },
      monsoon: { temp: 30, humidity: 90, condition: 'Rainy', description: 'Heavy monsoon with high humidity' },
      winter: { temp: 20, humidity: 65, condition: 'Pleasant', description: 'Cool and dry weather' }
    },
    'Pune': { 
      summer: { temp: 33, humidity: 55, condition: 'Hot', description: 'Hot and dry weather' },
      monsoon: { temp: 26, humidity: 85, condition: 'Rainy', description: 'Pleasant rains and cool weather' },
      winter: { temp: 23, humidity: 60, condition: 'Pleasant', description: 'Cool and pleasant weather' }
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'summer';
    if (month >= 6 && month <= 9) return 'monsoon';
    return 'winter';
  };

  const getWeatherForCity = (cityName) => {
    const normalizedCity = cityName.trim();
    const season = getCurrentSeason();
    
    let cityData = cityWeatherData[normalizedCity];
    
    if (!cityData) {
      const foundCity = Object.keys(cityWeatherData).find(
        key => key.toLowerCase() === normalizedCity.toLowerCase()
      );
      if (foundCity) {
        cityData = cityWeatherData[foundCity];
      }
    }
    
    if (!cityData) {
      cityData = {
        summer: { temp: 32, humidity: 60, condition: 'Hot', description: 'Hot summer weather' },
        monsoon: { temp: 28, humidity: 80, condition: 'Rainy', description: 'Monsoon season with rains' },
        winter: { temp: 22, humidity: 65, condition: 'Pleasant', description: 'Cool winter weather' }
      };
    }

    const seasonData = cityData[season];
    const tempVariation = Math.floor(Math.random() * 6) - 3;
    const humidityVariation = Math.floor(Math.random() * 20) - 10;
    
    return {
      city: normalizedCity,
      temperature: seasonData.temp + tempVariation,
      condition: seasonData.condition,
      humidity: Math.max(20, Math.min(100, seasonData.humidity + humidityVariation)),
      rainProbability: season === 'monsoon' ? 70 + Math.floor(Math.random() * 20) : 
                       season === 'winter' ? 10 + Math.floor(Math.random() * 20) : 
                       20 + Math.floor(Math.random() * 30)
    };
  };

  const handleCitySubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const weatherData = getWeatherForCity(city);
    console.log('WeatherWidget: Generated weather data:', weatherData);
    setWeather(weatherData);
    localStorage.setItem('dashboardWeather', JSON.stringify(weatherData));
    console.log('WeatherWidget: Saved weather data to localStorage');
    setShowInput(false);
    setLoading(false);
    
    // Notify parent component
    if (onWeatherUpdate) {
      console.log('WeatherWidget: Calling onWeatherUpdate callback');
      onWeatherUpdate(weatherData);
    } else {
      console.log('WeatherWidget: No onWeatherUpdate callback provided');
    }
    
    // Dispatch custom event to notify dashboard of weather update
    window.dispatchEvent(new CustomEvent('weatherUpdated', { detail: weatherData }));
    console.log('WeatherWidget: Dispatched weatherUpdated event');
  };

  const handleEditLocation = () => {
    setShowInput(true);
    setCity(weather?.city || '');
  };

  if (loading) {
    return (
      <div className="weather-widget">
        <h3>Current Weather</h3>
        <div className="loading-spinner small"></div>
        <p>Getting weather data...</p>
      </div>
    );
  }

  if (showInput) {
    return (
      <div className="weather-widget">
        <h3>Current Weather</h3>
        <form onSubmit={handleCitySubmit} className="weather-input-form">
          <div className="input-group">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
              className="city-input"
              required
            />
            <button type="submit" className="weather-btn" disabled={!city.trim()}>
              🌤️
            </button>
          </div>
        </form>
        <div className="popular-cities-mini">
          {['Mumbai', 'Delhi', 'Bangalore'].map(popularCity => (
            <button
              key={popularCity}
              type="button"
              className="city-tag"
              onClick={() => setCity(popularCity)}
            >
              {popularCity}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3>Current Weather</h3>
        <button className="edit-location-btn" onClick={handleEditLocation}>
          📍
        </button>
      </div>
      {weather && (
        <div className="weather-content">
          <div className="weather-main">
            <div className="temperature">{weather.temperature}°C</div>
            <div className="condition">{weather.condition}</div>
          </div>
          <div className="weather-details">
            <div className="detail">
              <span className="label">Location</span>
              <span className="value">{weather.city}</span>
            </div>
            <div className="detail">
              <span className="label">Humidity</span>
              <span className="value">{weather.humidity}%</span>
            </div>
            <div className="detail">
              <span className="label">Rain Chance</span>
              <span className="value">{weather.rainProbability}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;