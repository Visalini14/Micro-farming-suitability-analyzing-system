const plantDatabase = [
  {
    id: 1,
    name: 'Tomato',
    type: 'Vegetable',
    sunlight: 'full',
    water: 'medium',
    maintenance: 'medium',
    growthSpeed: 'medium',
    growthDuration: '60-80 days',
    season: 'summer',
    description: 'Juicy, sun-loving tomatoes perfect for containers',
    spaceTips: 'Use large pots (5-gallon) and provide support stakes',
    fullDescription: 'Tomatoes thrive in full sun and warm temperatures. They need consistent watering and benefit from regular fertilization.'
  },
  {
    id: 2,
    name: 'Basil',
    type: 'Herb',
    sunlight: 'full',
    water: 'medium',
    maintenance: 'low',
    growthSpeed: 'fast',
    growthDuration: '30-60 days',
    season: 'summer',
    description: 'Aromatic herb essential for Italian cooking',
    spaceTips: 'Grows well in small pots, pinch flowers for bushier growth',
    fullDescription: 'Basil loves heat and sun. Keep soil moist but well-drained. Regular harvesting encourages growth.'
  },
  {
    id: 3,
    name: 'Marigold',
    type: 'Flower',
    sunlight: 'full',
    water: 'low',
    maintenance: 'low',
    growthSpeed: 'fast',
    growthDuration: '45-60 days',
    season: 'all',
    description: 'Bright flowers that naturally repel pests',
    spaceTips: 'Perfect for border planting and companion planting',
    fullDescription: 'Marigolds are tough, drought-resistant flowers that bloom continuously in full sun.'
  },
  {
    id: 4,
    name: 'Rosemary',
    type: 'Herb',
    sunlight: 'full',
    water: 'low',
    maintenance: 'low',
    growthSpeed: 'slow',
    growthDuration: '90-180 days',
    season: 'all',
    description: 'Drought-tolerant herb with aromatic leaves',
    spaceTips: 'Great for rocky or sandy soil in containers',
    fullDescription: 'Rosemary thrives in full sun and well-drained soil. Very low maintenance once established.'
  },
  {
    id: 5,
    name: 'Mint',
    type: 'Herb',
    sunlight: 'partial',
    water: 'high',
    maintenance: 'low',
    growthSpeed: 'fast',
    growthDuration: '30-45 days',
    season: 'cool',
    description: 'Fast-growing herb perfect for teas and cooking',
    spaceTips: 'Grows aggressively, best in contained spaces',
    fullDescription: 'Mint prefers moist soil and partial shade. Can become invasive if not contained.'
  },
  {
    id: 6,
    name: 'Lettuce',
    type: 'Vegetable',
    sunlight: 'partial',
    water: 'high',
    maintenance: 'low',
    growthSpeed: 'fast',
    growthDuration: '30-45 days',
    season: 'cool',
    description: 'Crisp leafy greens for fresh salads',
    spaceTips: 'Successive planting for continuous harvest',
    fullDescription: 'Lettuce grows quickly in cool weather with consistent moisture. Bolts in hot weather.'
  },
  {
    id: 7,
    name: 'Spinach',
    type: 'Vegetable',
    sunlight: 'partial',
    water: 'high',
    maintenance: 'low',
    growthSpeed: 'fast',
    growthDuration: '40-50 days',
    season: 'cool',
    description: 'Nutrient-packed leafy green',
    spaceTips: 'Harvest outer leaves for continuous production',
    fullDescription: 'Spinach thrives in cool weather with regular watering. Rich in iron and vitamins.'
  },
  {
    id: 8,
    name: 'Cilantro',
    type: 'Herb',
    sunlight: 'partial',
    water: 'medium',
    maintenance: 'medium',
    growthSpeed: 'fast',
    growthDuration: '30-45 days',
    season: 'cool',
    description: 'Fresh herb essential for Asian and Mexican cuisine',
    spaceTips: 'Plant successively every 2-3 weeks',
    fullDescription: 'Cilantro prefers cooler temperatures and bolts quickly in heat. Keep soil consistently moist.'
  },
  {
    id: 9,
    name: 'Parsley',
    type: 'Herb',
    sunlight: 'shade',
    water: 'medium',
    maintenance: 'low',
    growthSpeed: 'slow',
    growthDuration: '70-90 days',
    season: 'cool',
    description: 'Versatile herb that grows in various conditions',
    spaceTips: 'Great for window boxes and shady corners',
    fullDescription: 'Parsley is a biennial herb that grows well in shade. Rich in vitamins and easy to grow.'
  },
  {
    id: 10,
    name: 'Kale',
    type: 'Vegetable',
    sunlight: 'shade',
    water: 'medium',
    maintenance: 'low',
    growthSpeed: 'medium',
    growthDuration: '50-65 days',
    season: 'cool',
    description: 'Superfood green packed with nutrients',
    spaceTips: 'Harvest lower leaves first, plant grows upward',
    fullDescription: 'Kale is cold-tolerant and grows well in partial shade. Becomes sweeter after frost.'
  },
  {
    id: 11,
    name: 'Chives',
    type: 'Herb',
    sunlight: 'shade',
    water: 'medium',
    maintenance: 'low',
    growthSpeed: 'medium',
    growthDuration: '60-90 days',
    season: 'all',
    description: 'Mild onion-flavored herb for garnishes',
    spaceTips: 'Divide clumps every 2-3 years for best growth',
    fullDescription: 'Chives are perennial herbs that grow well in containers. Cut back regularly for new growth.'
  },
  {
    id: 12,
    name: 'Mushrooms',
    type: 'Fungus',
    sunlight: 'shade',
    water: 'high',
    maintenance: 'medium',
    growthSpeed: 'fast',
    growthDuration: '20-30 days',
    season: 'all',
    description: 'Gourmet mushrooms grown in shady spots',
    spaceTips: 'Requires specific growing kits and high humidity',
    fullDescription: 'Mushrooms thrive in dark, humid conditions. Perfect for indoor cultivation in basements or closets.'
  }
];

export const getPlantRecommendations = (spaceData, weatherData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('PlantService: Generating recommendations for space:', spaceData);
      console.log('PlantService: Using weather data:', weatherData);
      
      // Extract space type from data
      const spaceType = spaceData?.spaceType || 'outdoor-space';
      const spaceName = spaceData?.spaceName || 'Unknown Space';
      
      // Default to balanced sunlight if no weather data
      let sunlightCondition = 'full'; // Default assumption for outdoor spaces
      let rainForecast = 'medium'; // Default assumption
      
      // If we have weather data, use it to determine growing conditions
      if (weatherData) {
        // Determine sunlight based on weather conditions
        if (weatherData.condition?.toLowerCase().includes('sunny')) {
          sunlightCondition = 'full';
        } else if (weatherData.condition?.toLowerCase().includes('cloudy') || weatherData.condition?.toLowerCase().includes('overcast')) {
          sunlightCondition = 'partial';
        }
        
        // Determine water needs based on rain probability
        if (weatherData.rainProbability > 70) {
          rainForecast = 'high';
        } else if (weatherData.rainProbability > 30) {
          rainForecast = 'medium';
        } else {
          rainForecast = 'low';
        }
      }
      
      console.log('PlantService: Determined conditions - sunlight:', sunlightCondition, 'rain:', rainForecast);
      
      // Filter plants based on conditions
      let filteredPlants = plantDatabase.filter(plant => {
        // More flexible sunlight matching for outdoor spaces
        const sunlightMatch = plant.sunlight === sunlightCondition || 
                             (sunlightCondition === 'full' && plant.sunlight === 'partial') ||
                             (spaceType.includes('concrete') && plant.sunlight !== 'shade'); // Concrete spaces usually get good sun
        
        const waterMatch = 
          (rainForecast === 'high' && (plant.water === 'high' || plant.water === 'medium')) ||
          (rainForecast === 'medium' && plant.water !== 'high') ||
          (rainForecast === 'low' && plant.water === 'low');
        
        return sunlightMatch && waterMatch;
      });

      // If no perfect matches, get a broader selection
      if (filteredPlants.length < 3) {
        console.log('PlantService: Too few matches, expanding selection');
        filteredPlants = plantDatabase.filter(plant => 
          plant.sunlight === sunlightCondition || plant.sunlight === 'partial'
        );
      }
      
      // Ensure we have at least some plants
      if (filteredPlants.length === 0) {
        console.log('PlantService: No matches, using all plants');
        filteredPlants = [...plantDatabase];
      }

      // Sort by maintenance level (easier plants first)
      filteredPlants.sort((a, b) => {
        const maintenanceOrder = { low: 1, medium: 2, high: 3 };
        return maintenanceOrder[a.maintenance] - maintenanceOrder[b.maintenance];
      });

      console.log('PlantService: Returning', filteredPlants.length, 'plant recommendations');
      resolve(filteredPlants);
    }, 1500);
  });
};

export const getPlantById = (id) => {
  return plantDatabase.find(plant => plant.id === id);
};

export const getAllPlants = () => {
  return plantDatabase;
};