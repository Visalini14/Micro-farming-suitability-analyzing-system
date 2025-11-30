/**
 * Navigation utility functions for consistent page transitions
 */

export const safeNavigate = (navigate, path, options = {}) => {
  try {
    // Force navigation with timeout to ensure it works after state changes
    setTimeout(() => {
      console.log(`Navigation: Navigating to ${path}`);
      navigate(path, options);
    }, 10);
  } catch (err) {
    console.error('Navigation: Error during navigation:', err);
    // Fallback method if the normal navigation fails
    window.location.href = path;
  }
};

export const goToAnalysis = (navigate, user, weatherData = null) => {
  if (!user) {
    safeNavigate(navigate, '/login', { state: { returnTo: '/upload' } });
    return;
  }

  if (weatherData) {
    safeNavigate(navigate, '/upload', {
      state: {
        weatherData,
        skipWeatherStep: true
      }
    });
  } else {
    safeNavigate(navigate, '/upload');
  }
};

export const goToCareGuides = (navigate, user) => {
  if (!user) {
    safeNavigate(navigate, '/login', { state: { returnTo: '/care-guides' } });
  } else {
    safeNavigate(navigate, '/care-guides');
  }
};
