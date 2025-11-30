import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CareGuides.css';

const CareGuides = () => {
  const navigate = useNavigate();

  const careCategories = [
    {
      title: "🌱 Getting Started",
      tips: [
        "Start with easy-to-grow plants like herbs (basil, mint, cilantro)",
        "Choose the right containers with proper drainage holes",
        "Use quality potting soil, not garden soil for containers",
        "Place plants where they'll get appropriate sunlight",
        "Start small and expand your garden gradually"
      ]
    },
    {
      title: "💧 Watering Wisdom",
      tips: [
        "Water when the top inch of soil feels dry",
        "Water deeply but less frequently to encourage deep roots",
        "Water early morning or evening to reduce evaporation",
        "Check soil moisture with your finger, not just surface appearance",
        "Use drip trays to prevent water damage and retain moisture"
      ]
    },
    {
      title: "☀️ Light Requirements",
      tips: [
        "Full sun plants need 6+ hours of direct sunlight daily",
        "Partial sun plants thrive with 3-6 hours of sunlight",
        "Shade plants can grow with less than 3 hours of direct sun",
        "Rotate plants weekly for even growth",
        "Use reflective materials to maximize available light"
      ]
    },
    {
      title: "🥗 Nutrition & Feeding",
      tips: [
        "Feed container plants every 2-4 weeks with balanced fertilizer",
        "Organic compost improves soil health and provides nutrients",
        "Yellow leaves often indicate nitrogen deficiency",
        "Don't over-fertilize - it can burn roots and reduce fruit production",
        "Use slow-release fertilizers for consistent nutrition"
      ]
    },
    {
      title: "🐛 Pest Protection",
      tips: [
        "Inspect plants weekly for early pest detection",
        "Remove affected leaves immediately to prevent spread",
        "Use neem oil spray for natural pest control",
        "Encourage beneficial insects with companion planting",
        "Keep plants healthy - strong plants resist pests better"
      ]
    },
    {
      title: "🌿 Seasonal Care",
      tips: [
        "Spring: Start new plants, increase watering as growth resumes",
        "Summer: Provide shade during extreme heat, water more frequently",
        "Monsoon: Ensure good drainage, watch for fungal issues",
        "Winter: Reduce watering, protect from cold winds",
        "Year-round: Prune dead/diseased parts regularly"
      ]
    },
    {
      title: "🏠 Container Gardening",
      tips: [
        "Choose containers 2-3 times wider than the plant's root ball",
        "Ensure drainage holes and use pot feet to improve airflow",
        "Group plants with similar water and light needs",
        "Use lightweight containers for mobility",
        "Consider self-watering containers for consistent moisture"
      ]
    },
    {
      title: "📏 Space Optimization",
      tips: [
        "Use vertical growing systems for small spaces",
        "Practice succession planting for continuous harvest",
        "Companion plant to maximize space and benefits",
        "Choose dwarf or compact varieties for containers",
        "Use hanging baskets for trailing plants"
      ]
    }
  ];

  return (
    <div className="care-guides-page">
      <div className="container">
        <header className="page-header">
          <h1>📚 Plant Care Guides</h1>
          <p>Essential tips and guidelines for successful container gardening and plant care</p>
        </header>

        <div className="care-categories">
          {careCategories.map((category, index) => (
            <div key={index} className="care-category">
              <h2>{category.title}</h2>
              <ul className="care-tips">
                {category.tips.map((tip, tipIndex) => (
                  <li key={tipIndex}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="quick-action-cards">
          <div className="action-card">
            <h3>🔍 Need Plant Recommendations?</h3>
            <p>Upload an image of your space to get personalized plant suggestions</p>
            <button 
              onClick={() => navigate('/upload')}
              className="btn-primary"
            >
              Start Analysis
            </button>
          </div>
          
          <div className="action-card">
            <h3>🌱 Check Your Garden</h3>
            <p>View and manage your saved plants and growing setups</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-outline"
            >
              My Garden
            </button>
          </div>
        </div>

        <div className="page-actions">
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareGuides;