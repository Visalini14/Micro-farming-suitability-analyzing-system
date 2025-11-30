import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find the Perfect Plants for Your Space!</h1>
          <p>AI-powered analysis to help you grow the right plants on your balcony, terrace, or garden</p>
          <div className="hero-actions">
            {user ? (
              <Link to="/upload" className="btn-primary btn-large">
                Start Analysis
              </Link>
            ) : (
              <Link to="/signup" className="btn-primary btn-large">
                Get Started Free
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            🏡 Beautiful Balcony Garden
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3>Upload Your Space</h3>
              <p>Take a photo of your balcony, terrace, or garden area</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">☀️</div>
              <h3>Sunlight Analysis</h3>
              <p>AI detects sunlight patterns and shade areas automatically</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌦️</div>
              <h3>Weather Integration</h3>
              <p>Get local weather data and seasonal recommendations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Smart Recommendations</h3>
              <p>Perfect plants based on your space and climate</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Microfarming Journey?</h2>
          <p>Join thousands of urban gardeners growing fresh produce in small spaces</p>
          {!user && (
            <div className="cta-actions">
              <Link to="/signup" className="btn-primary btn-large">
                Create Free Account
              </Link>
              <Link to="/login" className="btn-outline btn-large">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;