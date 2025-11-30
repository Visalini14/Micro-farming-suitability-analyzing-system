import React, { useState } from 'react';

const PlantCard = ({ plant, onRemove }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getDaysGrowing = (addedDate) => {
    const added = new Date(addedDate);
    const today = new Date();
    const diffTime = Math.abs(today - added);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleRemove = () => {
    if (window.confirm(`Remove ${plant.name} from your garden?`)) {
      onRemove(plant.id);
    }
  };

  return (
    <div className="plant-card">
      <div className="plant-header">
        <h3>{plant.name}</h3>
        <span className="plant-type">{plant.type}</span>
      </div>
      
      <p className="plant-description">{plant.description}</p>
      
      <div className="plant-meta">
        <span>Added: {getDaysGrowing(plant.added)} days ago</span>
        <span>Days Growing: {getDaysGrowing(plant.added)}</span>
        {plant.spaceName && (
          <span className="space-info">📍 {plant.spaceName}</span>
        )}
        {plant.setupName && (
          <span className="setup-info">🌿 {plant.setupName}</span>
        )}
      </div>

      <div className="plant-details">
        <div className="detail">
          <span className="label">Sunlight:</span>
          <span className={`value sunlight-${plant.sunlight}`}>
            {plant.sunlight === 'full' ? '☀️ Full Sun' :
             plant.sunlight === 'partial' ? '⛅ Partial' : '🌳 Shade'}
          </span>
        </div>
        <div className="detail">
          <span className="label">Maintenance:</span>
          <span className={`value maintenance-${plant.maintenance}`}>
            {plant.maintenance}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="plant-details-expanded">
          <div className="detail">
            <span className="label">Growth Duration:</span>
            <span className="value">{plant.growthDuration}</span>
          </div>
          <div className="detail">
            <span className="label">Season:</span>
            <span className="value">{plant.season}</span>
          </div>
          <div className="space-tips">
            <strong>Space Tips:</strong> {plant.spaceTips}
          </div>
        </div>
      )}

      <div className="plant-actions">
        <button 
          className="btn-primary"
          onClick={() => {
            // For now, show basic info then redirect to care guides
            alert(`${plant.name} Care Info:\n• ${plant.maintenance} maintenance required\n• Needs ${plant.sunlight} sunlight\n• Water when soil feels dry\n\nRedirecting to full care guides...`);
            // Navigate to care guides - we need to import navigate
            window.location.href = '/care-guides';
          }}
        >
          Care Guide
        </button>
        <button 
          className="btn-outline"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Less' : 'More'} Details
        </button>
        {onRemove && (
          <button 
            className="btn-outline"
            onClick={handleRemove}
            style={{ color: '#f44336', borderColor: '#f44336' }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default PlantCard;