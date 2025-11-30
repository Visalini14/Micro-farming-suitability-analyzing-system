import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would validate against a backend
    // For now, accept any valid email/password
    if (formData.email && formData.password.length >= 6) {
      const userData = { name: formData.email.split('@')[0], email: formData.email };
      setUser(userData);
      
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirect to return URL or dashboard
      const returnTo = location.state?.returnTo || '/dashboard';
      navigate(returnTo);
    } else {
      alert('Please enter a valid email and password (minimum 6 characters)');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your PlantAI account</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary">Sign In</button>
        </form>
        
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;