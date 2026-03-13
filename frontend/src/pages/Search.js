import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchFilters from '../components/SearchFilters';
import PGCard from '../components/PGCard';
import { pgAPI } from '../services/api';
import { MapPin } from 'lucide-react';

const Search = () => {
  const location = useLocation();
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    minRent: '',
    maxRent: '',
    sharingType: '',
    gender: ''
  });

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(location.search);
    const cityFromUrl = urlParams.get('city');
    
    if (cityFromUrl) {
      setFilters(prev => ({ ...prev, city: cityFromUrl }));
      // Auto-search if city is provided in URL
      searchPGs({ ...filters, city: cityFromUrl });
    } else {
      // Load all PGs initially
      loadAllPGs();
    }
  }, [location.search]);

  const loadAllPGs = async () => {
    setLoading(true);
    try {
      const data = await pgAPI.getAllPGs();
      setPGs(data);
    } catch (error) {
      console.error('Error loading PGs:', error);
      setPGs([]);
    } finally {
      setLoading(false);
    }
  };

  const searchPGs = async (searchFilters = filters) => {
    setLoading(true);
    try {
      const data = await pgAPI.searchPGs(searchFilters);
      setPGs(data);
    } catch (error) {
      console.error('Error searching PGs:', error);
      setPGs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    searchPGs();
  };

  const clearFilters = () => {
    const clearedFilters = {
      city: '',
      minRent: '',
      maxRent: '',
      sharingType: '',
      gender: ''
    };
    setFilters(clearedFilters);
    loadAllPGs();
  };

  return (
    <div className="container py-8">
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl font-bold mb-4">Search PGs</h1>
        <p className="text-gray-600">
          Find your perfect Paying Guest accommodation from our verified listings.
        </p>
      </div>

      {/* Search Filters */}
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Results Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 className="text-xl font-semibold">
            {loading ? 'Searching...' : `${pgs.length} PG${pgs.length !== 1 ? 's' : ''} Found`}
          </h2>
          {filters.city && (
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MapPin size={14} />
              in {filters.city}
            </p>
          )}
        </div>
        
        {(filters.city || filters.minRent || filters.maxRent || filters.sharingType || filters.gender) && (
          <button
            onClick={clearFilters}
            className="btn btn-secondary"
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {(filters.city || filters.minRent || filters.maxRent || filters.sharingType || filters.gender) && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px'
        }}>
          <span style={{ fontWeight: '600', color: '#374151' }}>Active Filters:</span>
          {filters.city && (
            <span className="badge badge-primary">City: {filters.city}</span>
          )}
          {filters.minRent && (
            <span className="badge badge-primary">Min: ₹{filters.minRent}</span>
          )}
          {filters.maxRent && (
            <span className="badge badge-primary">Max: ₹{filters.maxRent}</span>
          )}
          {filters.sharingType && (
            <span className="badge badge-primary">Type: {filters.sharingType}</span>
          )}
          {filters.gender && (
            <span className="badge badge-primary">Gender: {filters.gender}</span>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="text-gray-600 mt-4">Searching for PGs...</p>
        </div>
      ) : pgs.length > 0 ? (
        <div className="grid grid-3 gap-6">
          {pgs.map(pg => (
            <PGCard key={pg.id} pg={pg} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            🏠
          </div>
          <h3 className="text-xl font-semibold mb-4">No PGs Found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any PGs matching your criteria. Try adjusting your filters.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear All Filters
            </button>
            <button onClick={loadAllPGs} className="btn btn-outline">
              View All PGs
            </button>
          </div>
        </div>
      )}

      {/* Search Tips */}
      {!loading && pgs.length === 0 && (
        <div style={{
          marginTop: '40px',
          padding: '24px',
          backgroundColor: '#f0f9ff',
          borderRadius: '12px',
          border: '1px solid #bae6fd'
        }}>
          <h4 className="font-semibold mb-3" style={{ color: '#0369a1' }}>
            Search Tips:
          </h4>
          <ul style={{ 
            color: '#0369a1', 
            paddingLeft: '20px',
            lineHeight: '1.6'
          }}>
            <li>Try searching with just the city name</li>
            <li>Expand your budget range</li>
            <li>Consider different room types</li>
            <li>Check if the city name is spelled correctly</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
