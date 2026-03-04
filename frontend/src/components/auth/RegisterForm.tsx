import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    subscriptionPlan: 'Basic'
  });
  
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateUsername = (username: string): boolean => {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!validateUsername(formData.username)) {
      errors.username = 'Username must be at least 3 characters and contain only letters, numbers, and underscores';
    }

    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.subscriptionPlan) {
      errors.subscriptionPlan = 'Please select a subscription plan';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const success = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      subscriptionPlan: formData.subscriptionPlan
    });
    
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-black">
      <div className="bg-neutral-dark p-8 rounded-xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
        
        {(error || Object.keys(validationErrors).length > 0) && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">
            {error && <div>{error}</div>}
            {Object.values(validationErrors).map((err, index) => (
              <div key={index}>{err}</div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username (min 3 characters)"
              value={formData.username}
              onChange={handleChange}
              className={`input-field ${validationErrors.username ? 'border-red-500' : ''}`}
              required
            />
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${validationErrors.email ? 'border-red-500' : ''}`}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${validationErrors.password ? 'border-red-500' : ''}`}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input-field ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
              required
            />
          </div>
          
          <div>
            <select
              name="subscriptionPlan"
              value={formData.subscriptionPlan}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Basic">Basic Plan</option>
              <option value="Standard">Standard Plan</option>
              <option value="Premium">Premium Plan</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;