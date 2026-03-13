import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchFilters = ({ filters, onFilterChange, onSearch, loading }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div className="card-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Filter size={20} />
          Search & Filter PGs
        </h3>
      </div>
      
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2 gap-4">
            {/* City */}
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleInputChange}
                placeholder="Enter city name"
                className="form-input"
              />
            </div>

            {/* Budget Range */}
            <div className="form-group">
              <label className="form-label">Budget Range</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  name="minRent"
                  value={filters.minRent}
                  onChange={handleInputChange}
                  placeholder="Min ₹"
                  className="form-input"
                />
                <input
                  type="number"
                  name="maxRent"
                  value={filters.maxRent}
                  onChange={handleInputChange}
                  placeholder="Max ₹"
                  className="form-input"
                />
              </div>
            </div>

            {/* Sharing Type */}
            <div className="form-group">
              <label className="form-label">Room Type</label>
              <select
                name="sharingType"
                value={filters.sharingType}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">All Types</option>
                <option value="single">Single Room</option>
                <option value="double">Double Sharing</option>
                <option value="triple">Triple Sharing</option>
                <option value="dormitory">Dormitory</option>
              </select>
            </div>

            {/* Gender Preference */}
            <div className="form-group">
              <label className="form-label">Gender Preference</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Any</option>
                <option value="male">Boys Only</option>
                <option value="female">Girls Only</option>
                <option value="any">Co-ed</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div style={{ marginTop: '20px' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', margin: 0 }}></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Search PGs
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchFilters;
