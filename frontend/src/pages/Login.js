import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      if (response.success) {
        login(response.user);
        
        // Redirect based on user role
        if (response.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (response.user.role === 'owner') {
          navigate('/owner-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div style={{
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <div className="card">
          <div className="card-header text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to your PG Allocator account</p>
          </div>

          <div className="card-body">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="form-input"
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="form-input"
                    style={{ paddingRight: '45px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px', margin: 0 }}></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Login
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                Demo Accounts:
              </h4>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>
                <div><strong>Admin:</strong> admin@pgallocator.com / admin123</div>
                <div><strong>Owner:</strong> jane@example.com / password123</div>
                <div><strong>Tenant:</strong> john@example.com / password123</div>
              </div>
            </div>
          </div>

          <div className="card-footer text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: '#6366f1', 
                  textDecoration: 'none', 
                  fontWeight: '600' 
                }}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Role Selection Info */}
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: '#f0f9ff',
          borderRadius: '12px',
          border: '1px solid #bae6fd'
        }}>
          <h4 className="font-semibold mb-3" style={{ color: '#0369a1' }}>
            Account Types:
          </h4>
          <div style={{ color: '#0369a1', fontSize: '14px', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>🏠 Tenant:</strong> Search and book PG accommodations
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>👤 Owner:</strong> List and manage your PG properties
            </div>
            <div>
              <strong>⚙️ Admin:</strong> Platform management and verification
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
