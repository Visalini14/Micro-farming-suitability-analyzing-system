import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ImageUpload from './components/ImageUpload';
import AdvancedImageUpload from './components/AdvancedImageUpload';
import SpaceAnalyzer from './components/SpaceAnalyzer';
import SpaceResults from './components/SpaceResults';
import SunlightAnalysis from './components/SunlightAnalysis';
import WeatherAnalysis from './components/WeatherAnalysis';
import CropRecommendations from './components/EnhancedCropRecommendations';
import RecommendationsDisplay from './components/RecommendationsDisplay';
import AnalysisHistory from './components/AnalysisHistory';
import CareGuides from './components/CareGuides';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleSetUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={handleSetUser} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={handleSetUser} />} />
          <Route path="/signup" element={<Signup setUser={handleSetUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/upload" element={<AdvancedImageUpload />} />
          <Route path="/upload-basic" element={<ImageUpload />} />
          <Route path="/space-analyzer" element={<SpaceAnalyzer />} />
          <Route path="/space-results" element={<SpaceResults />} />
          <Route path="/sunlight-analysis" element={<SunlightAnalysis />} />
          <Route path="/weather-analysis" element={<WeatherAnalysis />} />
          <Route path="/recommendations" element={<CropRecommendations />} />
          <Route path="/recommendations-old" element={<RecommendationsDisplay />} />
          <Route path="/history" element={<AnalysisHistory />} />
          <Route path="/care-guides" element={<CareGuides />} />
          <Route path="*" element={<Home user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;