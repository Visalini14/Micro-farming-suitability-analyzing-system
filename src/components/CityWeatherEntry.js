import React, { useState } from 'react';

const CityWeatherEntry = ({ onWeatherSubmit, onCancel }) => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    },
    'Hyderabad': { 
      summer: { temp: 35, humidity: 50, condition: 'Hot', description: 'Hot and dry weather' },
      monsoon: { temp: 28, humidity: 80, condition: 'Rainy', description: 'Moderate rains with humidity' },
      winter: { temp: 24, humidity: 65, condition: 'Pleasant', description: 'Cool and comfortable weather' }
    },
    'Ahmedabad': { 
      summer: { temp: 40, humidity: 40, condition: 'Very Hot', description: 'Extremely hot and dry weather' },
      monsoon: { temp: 32, humidity: 75, condition: 'Humid', description: 'Hot with moderate humidity' },
      winter: { temp: 22, humidity: 50, condition: 'Pleasant', description: 'Cool and dry weather' }
    },
    'Jaipur': { 
      summer: { temp: 39, humidity: 35, condition: 'Very Hot', description: 'Very hot and dry weather' },
      monsoon: { temp: 31, humidity: 70, condition: 'Warm', description: 'Warm with light rains' },
      winter: { temp: 18, humidity: 45, condition: 'Cool', description: 'Cold and dry weather' }
    },
    'Lucknow': { 
      summer: { temp: 37, humidity: 60, condition: 'Hot', description: 'Hot and humid weather' },
      monsoon: { temp: 31, humidity: 85, condition: 'Rainy', description: 'Heavy rains with high humidity' },
      winter: { temp: 16, humidity: 65, condition: 'Cool', description: 'Cold and foggy weather' }
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    if (month >= 3 && month <= 5) return 'summer';
    if (month >= 6 && month <= 9) return 'monsoon';
    return 'winter';
  };

  const getWeatherForCity = (cityName) => {
    const normalizedCity = cityName.trim();
    const season = getCurrentSeason();
    
    // Check if we have specific data for this city
    let cityData = cityWeatherData[normalizedCity];
    
    // If not found, try case-insensitive search
    if (!cityData) {
      const foundCity = Object.keys(cityWeatherData).find(
        key => key.toLowerCase() === normalizedCity.toLowerCase()
      );
      if (foundCity) {
        cityData = cityWeatherData[foundCity];
      }
    }
    
    // If still not found, use default regional data
    if (!cityData) {
      cityData = {
        summer: { temp: 32, humidity: 60, condition: 'Hot', description: 'Hot summer weather' },
        monsoon: { temp: 28, humidity: 80, condition: 'Rainy', description: 'Monsoon season with rains' },
        winter: { temp: 22, humidity: 65, condition: 'Pleasant', description: 'Cool winter weather' }
      };
    }

    const seasonData = cityData[season];
    
    // Add some random variation to make it more realistic
    const tempVariation = Math.floor(Math.random() * 6) - 3; // ±3 degrees
    const humidityVariation = Math.floor(Math.random() * 20) - 10; // ±10%
    
    return {
      city: normalizedCity,
      temperature: seasonData.temp + tempVariation,
      feelsLike: seasonData.temp + tempVariation + 2,
      humidity: Math.max(20, Math.min(100, seasonData.humidity + humidityVariation)),
      condition: seasonData.condition,
      description: seasonData.description,
      windSpeed: 5 + Math.floor(Math.random() * 15), // 5-20 km/h
      rainProbability: season === 'monsoon' ? 70 + Math.floor(Math.random() * 20) : 
                       season === 'winter' ? 10 + Math.floor(Math.random() * 20) : 
                       20 + Math.floor(Math.random() * 30),
      forecast: generateForecast(normalizedCity, season, seasonData.temp),
      growingConditions: generateGrowingConditions(seasonData.temp + tempVariation, seasonData.humidity + humidityVariation, seasonData.condition)
    };
  };

  const generateForecast = (city, season, baseTemp) => {
    const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map((day, index) => {
      const tempVariation = Math.floor(Math.random() * 8) - 4; // ±4 degrees variation
      const temp = baseTemp + tempVariation;
      
      return {
        day,
        high: temp + 3,
        low: temp - 5,
        condition: getRandomCondition(season),
        icon: getWeatherIcon(season),
        rainProbability: season === 'monsoon' ? 60 + (index * 5) : 
                        season === 'winter' ? 15 + (index * 2) : 
                        25 + (index * 3)
      };
    });
  };

  const getRandomCondition = (season) => {
    const conditions = {
      summer: ['Sunny', 'Hot', 'Partly Cloudy'],
      monsoon: ['Rainy', 'Cloudy', 'Thunderstorm', 'Drizzle'],
      winter: ['Pleasant', 'Cool', 'Partly Cloudy', 'Clear']
    };
    const seasonConditions = conditions[season] || ['Pleasant'];
    return seasonConditions[Math.floor(Math.random() * seasonConditions.length)];
  };

  const getWeatherIcon = (season) => {
    const icons = {
      summer: '☀️',
      monsoon: '🌧️',
      winter: '🌤️'
    };
    return icons[season] || '☀️';
  };

  const generateGrowingConditions = (temp, humidity, condition) => {
    const favorable = [];
    const challenges = [];
    const recommendations = [];

    // Temperature analysis
    if (temp >= 20 && temp <= 30) {
      favorable.push('Ideal temperature range for most plants');
    } else if (temp > 35) {
      challenges.push('Very high temperatures may stress plants');
      recommendations.push('Provide shade during peak hours and increase watering');
    } else if (temp > 30) {
      challenges.push('High temperatures may stress some plants');
      recommendations.push('Provide afternoon shade and extra watering');
    } else if (temp < 15) {
      challenges.push('Cool temperatures may slow plant growth');
      recommendations.push('Consider cold-hardy plants or indoor growing');
    }

    // Humidity analysis
    if (humidity >= 50 && humidity <= 70) {
      favorable.push('Good humidity levels for plant growth');
    } else if (humidity > 80) {
      challenges.push('High humidity may increase disease risk');
      recommendations.push('Ensure good air circulation around plants');
    } else if (humidity < 40) {
      challenges.push('Low humidity may stress plants');
      recommendations.push('Consider increasing humidity around plants');
    }

    // Seasonal recommendations
    const season = getCurrentSeason();
    if (season === 'monsoon') {
      favorable.push('Monsoon season - natural watering for plants');
      recommendations.push('Ensure proper drainage to prevent waterlogging');
      recommendations.push('Perfect time for leafy greens and herbs');
    } else if (season === 'winter') {
      favorable.push('Cool weather ideal for many vegetables');
      recommendations.push('Great time for root vegetables and flowers');
    } else {
      recommendations.push('Summer season - choose heat-tolerant varieties');
      recommendations.push('Mulch soil to conserve moisture');
    }

    return { favorable, challenges, recommendations };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const weatherData = getWeatherForCity(city);
      console.log('Generated weather data for', city, ':', weatherData);
      
      onWeatherSubmit(weatherData);
    } catch (err) {
      setError('Unable to fetch weather data. Please try again.');
      setLoading(false);
    }
  };

  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Pune', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  return (
    <div className="city-weather-entry">
      <div className="weather-form-container">
        <h3>🌤️ Enter Your City</h3>
        <p>Enter your city name to get current weather conditions and growing recommendations</p>

        <form onSubmit={handleSubmit} className="city-form">
          <div className="form-group">
            <label htmlFor="city">City Name *</label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setError('');
              }}
              placeholder="e.g., Mumbai, Delhi, Bangalore"
              className={error ? 'error' : ''}
              disabled={loading}
            />
            {error && <span className="error-text">{error}</span>}
          </div>

          <div className="popular-cities">
            <p>Popular cities:</p>
            <div className="city-buttons">
              {popularCities.map(popularCity => (
                <button
                  key={popularCity}
                  type="button"
                  className="city-button"
                  onClick={() => setCity(popularCity)}
                  disabled={loading}
                >
                  {popularCity}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onCancel} 
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || !city.trim()}
            >
              {loading ? '🌤️ Getting Weather...' : '🌤️ Get Weather Data'}
            </button>
          </div>
        </form>

        <div className="weather-info">
          <p><small>Weather data includes current conditions, 7-day forecast, and growing recommendations tailored to your city's climate.</small></p>
        </div>
      </div>
    </div>
  );
};

export default CityWeatherEntry;