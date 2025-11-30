import React from 'react';

const SpaceTypeSelector = ({ selectedSpaceType, onSpaceTypeChange }) => {
  const spaceTypes = [
    {
      id: 'balcony',
      name: 'Balcony',
      description: 'Small outdoor space with limited area',
      icon: '🏠',
      characteristics: ['Limited space', 'Partial sunlight', 'Wind exposure']
    },
    {
      id: 'window_seat',
      name: 'Window Seat',
      description: 'Indoor space near a window',
      icon: '🪟',
      characteristics: ['Indoor growing', 'Filtered light', 'Climate controlled']
    },
    {
      id: 'terrace',
      name: 'Terrace/Rooftop',
      description: 'Open rooftop area with full sun exposure',
      icon: '🏢',
      characteristics: ['Full sunlight', 'Large space', 'Weather exposed']
    },
    {
      id: 'garden',
      name: 'Garden',
      description: 'Outdoor ground-level growing space',
      icon: '🌳',
      characteristics: ['Ground soil', 'Natural drainage', 'Full growing space']
    },
    {
      id: 'indoor',
      name: 'Indoor Room',
      description: 'Interior room with artificial lighting',
      icon: '🏡',
      characteristics: ['Artificial light', 'Climate controlled', 'Limited natural light']
    },
    {
      id: 'greenhouse',
      name: 'Greenhouse',
      description: 'Controlled environment for optimal growing',
      icon: '🏠',
      characteristics: ['Controlled climate', 'Extended season', 'Optimal conditions']
    }
  ];

  return (
    <div className="space-type-selector">
      <h3>Select Your Growing Space</h3>
      <p>Choose the type of space where you want to grow your plants:</p>
      
      <div className="space-types-grid">
        {spaceTypes.map((space) => (
          <div
            key={space.id}
            className={`space-type-card ${selectedSpaceType === space.id ? 'selected' : ''}`}
            onClick={() => onSpaceTypeChange(space.id)}
          >
            <div className="space-icon">{space.icon}</div>
            <h4>{space.name}</h4>
            <p>{space.description}</p>
            <ul className="characteristics">
              {space.characteristics.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedSpaceType && (
        <div className="selected-space-info">
          <p>✅ Selected: <strong>{spaceTypes.find(s => s.id === selectedSpaceType)?.name}</strong></p>
        </div>
      )}
    </div>
  );
};

export default SpaceTypeSelector;