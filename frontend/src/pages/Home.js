import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Shield, Star, ArrowRight } from 'lucide-react';
import PGCard from '../components/PGCard';
import { pgAPI } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredPGs, setFeaturedPGs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPGs();
  }, []);

  const fetchFeaturedPGs = async () => {
    try {
      const pgs = await pgAPI.getAllPGs();
      setFeaturedPGs(pgs.slice(0, 6)); // Show first 6 PGs as featured
    } catch (error) {
      console.error('Error fetching featured PGs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?city=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Find Your Perfect PG
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '40px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Discover comfortable and affordable Paying Guest accommodations 
            with verified owners and modern amenities.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city name (e.g., Bangalore, Mumbai)"
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '12px 16px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  outline: 'none',
                  color: '#1e293b'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: 0,
                  borderRadius: '8px'
                }}
              >
                <Search size={18} />
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose PG Allocator?
          </h2>
          
          <div className="grid grid-3 gap-6">
            <div className="text-center">
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#e0e7ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Shield size={32} color="#6366f1" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Verified Properties</h3>
              <p className="text-gray-600">
                All PG listings are verified by our team to ensure quality and authenticity.
              </p>
            </div>

            <div className="text-center">
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#dcfce7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Users size={32} color="#10b981" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Trusted Community</h3>
              <p className="text-gray-600">
                Connect with verified PG owners and fellow tenants in a safe environment.
              </p>
            </div>

            <div className="text-center">
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#fef3c7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <MapPin size={32} color="#f59e0b" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Prime Locations</h3>
              <p className="text-gray-600">
                Find PGs in prime locations with easy access to offices, colleges, and transport.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured PGs Section */}
      <section className="py-12" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <h2 className="text-3xl font-bold">Featured PGs</h2>
            <Link 
              to="/search" 
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="spinner"></div>
              <p className="text-gray-600 mt-4">Loading featured PGs...</p>
            </div>
          ) : featuredPGs.length > 0 ? (
            <div className="grid grid-3 gap-6">
              {featuredPGs.map(pg => (
                <PGCard key={pg.id} pg={pg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No PGs available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container">
          <div style={{
            backgroundColor: '#6366f1',
            color: 'white',
            padding: '60px 40px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Perfect PG?
            </h2>
            <p className="text-xl mb-8" style={{ opacity: 0.9 }}>
              Join thousands of satisfied tenants who found their ideal accommodation through us.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/search" className="btn" style={{ backgroundColor: 'white', color: '#6366f1' }}>
                Browse PGs
              </Link>
              <Link to="/register" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="grid grid-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Verified PGs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-600">Happy Tenants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
