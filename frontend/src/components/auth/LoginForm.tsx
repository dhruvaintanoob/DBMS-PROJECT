import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    const success = await login(formData.username, formData.password);
    if (success) {
      navigate('/profiles');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-black">
      <div className="bg-neutral-dark p-8 rounded-xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
        
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
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`input-field ${validationErrors.username ? 'border-red-500' : ''}`}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${validationErrors.password ? 'border-red-500' : ''}`}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            New to Netflix?{' '}
            <Link to="/register" className="text-white hover:underline">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;