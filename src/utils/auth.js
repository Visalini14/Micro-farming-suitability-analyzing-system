// Authentication utility functions

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const requireAuth = (navigate, returnTo = '/') => {
  if (!isAuthenticated()) {
    navigate('/login', { state: { returnTo } });
    return false;
  }
  return true;
};

export const logout = (navigate, setUser) => {
  localStorage.removeItem('user');
  localStorage.removeItem('userGarden');
  localStorage.removeItem('analysisHistory');
  localStorage.removeItem('dashboardWeather');
  if (setUser) setUser(null);
  navigate('/');
};

export const saveUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const clearUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('userGarden');
  localStorage.removeItem('analysisHistory');
  localStorage.removeItem('dashboardWeather');
};