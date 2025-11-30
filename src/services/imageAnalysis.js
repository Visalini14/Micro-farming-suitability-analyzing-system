export const analyzeSunlight = (imageData, spaceType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const analysis = generateSpaceAnalysis(spaceType);
      resolve(analysis);
    }, 3000);
  });
};

const generateSpaceAnalysis = (spaceType) => {
  const baseAnalysis = {
    totalSunHours: 0,
    zones: [],
    spaceType: spaceType,
    recommendations: []
  };

  switch (spaceType) {
    case 'balcony':
      baseAnalysis.totalSunHours = 4 + Math.floor(Math.random() * 4);
      baseAnalysis.zones = generateBalconyZones();
      baseAnalysis.recommendations = [
        'Use vertical space with hanging planters',
        'Consider railing planters for maximum sun exposure',
        'Rotate plants weekly for even growth'
      ];
      break;
    
    case 'terrace':
      baseAnalysis.totalSunHours = 6 + Math.floor(Math.random() * 4);
      baseAnalysis.zones = generateTerraceZones();
      baseAnalysis.recommendations = [
        'Perfect for container gardening',
        'Use raised beds for better soil control',
        'Provide afternoon shade for sensitive plants'
      ];
      break;
    
    case 'garden':
      baseAnalysis.totalSunHours = 5 + Math.floor(Math.random() * 5);
      baseAnalysis.zones = generateGardenZones();
      baseAnalysis.recommendations = [
        'Mix sun-loving and shade-tolerant plants',
        'Create microclimates with strategic planting',
        'Use companion planting for pest control'
      ];
      break;
    
    case 'window':
      baseAnalysis.totalSunHours = 3 + Math.floor(Math.random() * 3);
      baseAnalysis.zones = generateWindowZones();
      baseAnalysis.recommendations = [
        'Ideal for herbs and small greens',
        'Rotate plants regularly for even light',
        'Use reflective surfaces to maximize light'
      ];
      break;
    
    default:
      baseAnalysis.totalSunHours = 4 + Math.floor(Math.random() * 3);
      baseAnalysis.zones = generateBalconyZones();
      baseAnalysis.recommendations = [
        'Assess your space for optimal plant placement',
        'Consider sunlight patterns throughout the day',
        'Start with easy-to-grow plants'
      ];
      break;
  }

  return baseAnalysis;
};

const generateBalconyZones = () => [
  { type: 'sunny', top: 10, left: 70, width: 25, height: 30, hours: 6 },
  { type: 'partial', top: 40, left: 20, width: 50, height: 40, hours: 4 },
  { type: 'shade', top: 10, left: 10, width: 15, height: 80, hours: 2 }
];

const generateTerraceZones = () => [
  { type: 'sunny', top: 5, left: 5, width: 90, height: 60, hours: 8 },
  { type: 'partial', top: 65, left: 20, width: 60, height: 30, hours: 5 },
  { type: 'shade', top: 5, left: 5, width: 15, height: 20, hours: 2 }
];

const generateGardenZones = () => [
  { type: 'sunny', top: 15, left: 15, width: 70, height: 50, hours: 7 },
  { type: 'partial', top: 65, left: 10, width: 80, height: 30, hours: 4 },
  { type: 'shade', top: 10, left: 10, width: 30, height: 40, hours: 2 },
  { type: 'sunny', top: 50, left: 60, width: 35, height: 45, hours: 6 }
];

const generateWindowZones = () => [
  { type: 'partial', top: 20, left: 10, width: 80, height: 60, hours: 4 },
  { type: 'shade', top: 80, left: 10, width: 80, height: 15, hours: 1 }
];

// Image analysis function for plant identification and recommendations
export const analyzeImage = async (imageFile, spaceType, location) => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock plant identification based on filename or content
  const filename = imageFile.name.toLowerCase();
  
  // Mock detection logic - in a real app this would use ML/AI services
  const plantDetected = detectPlantType(filename);
  
  if (!plantDetected) {
    throw new Error("No plant detected in the image. Please upload an image containing plants or leaves.");
  }
  
  // Generate mock analysis results
  const analysis = {
    plantType: plantDetected.type,
    confidence: plantDetected.confidence,
    healthStatus: generateHealthStatus(),
    recommendations: generateRecommendations(plantDetected.type, spaceType, location),
    spaceType,
    location,
    timestamp: new Date().toISOString(),
    imageUrl: URL.createObjectURL(imageFile)
  };
  
  return analysis;
};

// Enhanced plant detection logic with better human photo filtering
const detectPlantType = (filename) => {
  const plantKeywords = {
    'tomato': { type: 'Tomato', confidence: 0.95 },
    'lettuce': { type: 'Lettuce', confidence: 0.92 },
    'basil': { type: 'Basil', confidence: 0.88 },
    'mint': { type: 'Mint', confidence: 0.85 },
    'pepper': { type: 'Bell Pepper', confidence: 0.90 },
    'herb': { type: 'Mixed Herbs', confidence: 0.75 },
    'plant': { type: 'Leafy Green', confidence: 0.70 },
    'leaf': { type: 'Unknown Plant', confidence: 0.65 },
    'green': { type: 'Leafy Vegetable', confidence: 0.60 },
    'garden': { type: 'Garden Plant', confidence: 0.55 },
    'flower': { type: 'Flowering Plant', confidence: 0.80 },
    'crop': { type: 'Crop Plant', confidence: 0.75 },
    'vegetable': { type: 'Vegetable', confidence: 0.85 },
    'seedling': { type: 'Seedling', confidence: 0.70 }
  };
  
  // Enhanced human detection keywords - more comprehensive list
  const humanKeywords = [
    'person', 'people', 'human', 'face', 'selfie', 'portrait', 'man', 'woman',
    'boy', 'girl', 'child', 'baby', 'adult', 'teen', 'family', 'group',
    'profile', 'headshot', 'smile', 'eye', 'hair', 'skin', 'hand', 'finger',
    'body', 'arm', 'leg', 'head', 'neck', 'shoulder', 'photo', 'pic',
    'img', 'image', 'snap', 'shot', 'camera', 'mobile', 'phone'
  ];
  
  // Check for human-related keywords that should be rejected
  for (const keyword of humanKeywords) {
    if (filename.includes(keyword)) {
      return null; // Reject human photos
    }
  }
  
  // Check for common non-plant patterns
  const nonPlantPatterns = [
    /\b(me|my|self|myself)\b/i,
    /\b(avatar|profile|dp|display)\b/i,
    /\b(birthday|party|event|wedding)\b/i,
    /\b(office|work|meeting|conference)\b/i,
    /\b(friend|colleague|family|relative)\b/i,
    /\b(indoor|outdoor|beach|park|restaurant)\b/i,
    /\b(vacation|holiday|trip|travel)\b/i
  ];
  
  for (const pattern of nonPlantPatterns) {
    if (pattern.test(filename)) {
      return null; // Likely not a plant image
    }
  }
  
  // Look for plant keywords in filename (case insensitive)
  for (const [keyword, result] of Object.entries(plantKeywords)) {
    if (filename.toLowerCase().includes(keyword)) {
      return result;
    }
  }
  
  // Check for botanical/gardening terms that suggest plant content
  const botanicalTerms = [
    'garden', 'greenhouse', 'nursery', 'botanical', 'flora', 'foliage',
    'chlorophyll', 'photosynthesis', 'bloom', 'bud', 'stem', 'root',
    'soil', 'pot', 'planter', 'grow', 'cultivation', 'harvest'
  ];
  
  for (const term of botanicalTerms) {
    if (filename.includes(term)) {
      return { type: 'Garden Plant', confidence: 0.65 };
    }
  }
  
  // More conservative approach - only accept if filename suggests plant content
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
  if (imageExtensions.some(ext => filename.endsWith(ext))) {
    // Final check - look for any indication this might be a plant
    const plantIndicators = ['leaf', 'green', 'plant', 'tree', 'flower', 'grass', 'weed'];
    const hasPlantIndicator = plantIndicators.some(indicator => filename.includes(indicator));
    
    if (hasPlantIndicator) {
      return { type: 'Unknown Plant', confidence: 0.45 };
    }
    
    // If no plant indicators found, be more cautious
    return null; // Reject unclear images
  }
  
  return null; // No plant detected
};

// Generate mock health status
const generateHealthStatus = () => {
  const statuses = [
    { status: 'Healthy', score: 85, color: '#4CAF50' },
    { status: 'Good', score: 75, color: '#8BC34A' },
    { status: 'Fair', score: 65, color: '#FFC107' },
    { status: 'Needs Attention', score: 45, color: '#FF9800' }
  ];
  
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Generate recommendations based on plant type, space, and location
const generateRecommendations = (plantType, spaceType, location) => {
  const baseRecommendations = {
    'Tomato': [
      'Provide 6-8 hours of direct sunlight daily',
      'Water deeply but infrequently, allowing soil to dry between waterings',
      'Use tomato cages or stakes for support as plants grow',
      'Feed with balanced fertilizer every 2-3 weeks'
    ],
    'Lettuce': [
      'Prefers partial shade in hot weather, full sun in cooler conditions',
      'Keep soil consistently moist but not waterlogged',
      'Harvest outer leaves regularly to promote continuous growth',
      'Provide good air circulation to prevent fungal issues'
    ],
    'Basil': [
      'Needs warm conditions and 6+ hours of sunlight',
      'Water regularly but ensure good drainage',
      'Pinch flower buds to maintain leaf production',
      'Harvest frequently to encourage bushy growth'
    ],
    'Bell Pepper': [
      'Requires full sun and warm temperatures',
      'Water consistently, avoiding both drought and waterlogging',
      'Support plants with stakes as they grow and fruit',
      'Feed with phosphorus-rich fertilizer during flowering'
    ]
  };
  
  let recommendations = baseRecommendations[plantType] || [
    'Ensure adequate sunlight for your plant type',
    'Maintain consistent watering schedule',
    'Monitor for pests and diseases regularly',
    'Provide appropriate nutrients based on growth stage'
  ];
  
  // Add space-specific recommendations
  const spaceRecommendations = {
    'balcony': [
      'Consider wind protection for exposed balconies',
      'Use containers with good drainage',
      'Monitor temperature fluctuations'
    ],
    'windowSeat': [
      'Rotate plants regularly for even growth',
      'Watch for temperature extremes near windows',
      'Ensure adequate humidity indoors'
    ],
    'terrace': [
      'Provide shade during hottest part of day',
      'Use larger containers for better root development',
      'Consider drip irrigation for consistent watering'
    ],
    'backyard': [
      'Take advantage of natural soil if available',
      'Plan for seasonal changes',
      'Consider companion planting'
    ],
    'indoorGarden': [
      'Supplement with grow lights if needed',
      'Maintain proper humidity levels',
      'Ensure good air circulation'
    ],
    'rooftop': [
      'Provide wind barriers and shade structures',
      'Use heat-resistant varieties',
      'Implement efficient irrigation system'
    ]
  };
  
  if (spaceRecommendations[spaceType]) {
    recommendations = [...recommendations, ...spaceRecommendations[spaceType]];
  }
  
  // Add weather-based recommendations if location data available
  if (location && location.weather) {
    const weather = location.weather;
    if (weather.temperature > 30) {
      recommendations.push('Provide shade during hot afternoons');
      recommendations.push('Increase watering frequency in hot weather');
    }
    if (weather.humidity < 40) {
      recommendations.push('Consider increasing humidity around plants');
    }
    if (weather.windSpeed > 15) {
      recommendations.push('Protect plants from strong winds');
    }
  }
  
  return recommendations;
};