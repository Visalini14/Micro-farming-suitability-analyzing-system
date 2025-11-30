// Manual weather service - no automatic data fetching
// All weather functions moved to ManualWeatherEntry component

// Legacy functions - kept for backward compatibility if needed
export const getLocation = () => {
  return Promise.reject(new Error('Manual weather entry is now used instead of automatic location detection'));
};

export const getWeatherData = async (city) => {
  console.warn('getWeatherData is deprecated - use manual weather entry instead');
  return Promise.reject(new Error('Manual weather entry is now used instead of automatic weather fetching'));
};

// All weather processing functionality has been moved to the ManualWeatherEntry component
// This file is kept minimal for legacy compatibility