import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Search, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isOwner, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (isAdmin()) return '/admin-dashboard';
    if (isOwner()) return '/owner-dashboard';
    return '/dashboard';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav style={{
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#6366f1',
              textDecoration: 'none'
            }}
          >
            🏠 PG Allocator
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-6" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
            <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none', color: '#475569' }}>
              <Home size={18} />
              Home
            </Link>
            <Link to="/search" className="flex items-center gap-2" style={{ textDecoration: 'none', color: '#475569' }}>
              <Search size={18} />
              Search PGs
            </Link>

            {isAuthenticated() ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={getDashboardLink()} 
                  className="flex items-center gap-2" 
                  style={{ textDecoration: 'none', color: '#475569' }}
                >
                  <User size={18} />
                  Dashboard
                </Link>
                <span style={{ color: '#6b7280' }}>
                  Welcome, {user.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline flex items-center gap-2"
                  style={{ padding: '8px 16px' }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            style={{ 
              display: window.innerWidth <= 768 ? 'block' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div style={{
            display: 'block',
            paddingBottom: '16px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px' }}>
              <Link 
                to="/" 
                className="flex items-center gap-2" 
                style={{ textDecoration: 'none', color: '#475569', padding: '8px 0' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                Home
              </Link>
              <Link 
                to="/search" 
                className="flex items-center gap-2" 
                style={{ textDecoration: 'none', color: '#475569', padding: '8px 0' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <Search size={18} />
                Search PGs
              </Link>

              {isAuthenticated() ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="flex items-center gap-2" 
                    style={{ textDecoration: 'none', color: '#475569', padding: '8px 0' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    Dashboard
                  </Link>
                  <div style={{ padding: '8px 0', color: '#6b7280', fontSize: '14px' }}>
                    Welcome, {user.name}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline flex items-center gap-2"
                    style={{ justifyContent: 'center' }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link 
                    to="/login" 
                    className="btn btn-outline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
