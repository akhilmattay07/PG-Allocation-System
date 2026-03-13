import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { pgAPI, bookingAPI } from '../services/api';
import { Plus, Edit, Trash2, Eye, MapPin, Users, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pgs');
  const [pgs, setPGs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPG, setEditingPG] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    rent: '',
    sharingType: 'double',
    genderPreference: 'any',
    amenities: [],
    imageUrl: '',
    description: '',
    availableRooms: 1
  });

  const availableAmenities = [
    'WiFi', 'AC', 'Laundry', 'Parking', 'CCTV', 'Security', 'Meals', 'Gym', 'Swimming Pool', 'Power Backup'
  ];

  useEffect(() => {
    if (user) {
      fetchOwnerData();
    }
  }, [user]);

  const fetchOwnerData = async () => {
    try {
      const [pgsData, bookingsData] = await Promise.all([
        pgAPI.getPGsByOwner(user.id),
        bookingAPI.getOwnerBookings(user.id)
      ]);
      setPGs(pgsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching owner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'amenities') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          amenities: [...prev.amenities, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          amenities: prev.amenities.filter(amenity => amenity !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const pgData = {
        ...formData,
        ownerId: user.id,
        rent: parseFloat(formData.rent)
      };

      if (editingPG) {
        pgData.id = editingPG.id;
        await pgAPI.updatePG(pgData);
      } else {
        await pgAPI.addPG(pgData);
      }

      // Reset form and refresh data
      setFormData({
        name: '',
        city: '',
        address: '',
        rent: '',
        sharingType: 'double',
        genderPreference: 'any',
        amenities: [],
        imageUrl: '',
        description: '',
        availableRooms: 1
      });
      setShowAddForm(false);
      setEditingPG(null);
      fetchOwnerData();
      
    } catch (error) {
      console.error('Error saving PG:', error);
      alert('Failed to save PG. Please try again.');
    }
  };

  const handleEdit = (pg) => {
    setFormData({
      name: pg.name,
      city: pg.city,
      address: pg.address,
      rent: pg.rent.toString(),
      sharingType: pg.sharingType,
      genderPreference: pg.genderPreference,
      amenities: pg.amenities || [],
      imageUrl: pg.imageUrl || '',
      description: pg.description || '',
      availableRooms: pg.availableRooms
    });
    setEditingPG(pg);
    setShowAddForm(true);
  };

  const handleDelete = async (pgId) => {
    if (window.confirm('Are you sure you want to delete this PG?')) {
      try {
        await pgAPI.deletePG(pgId, user.id);
        fetchOwnerData();
      } catch (error) {
        console.error('Error deleting PG:', error);
        alert('Failed to delete PG. Please try again.');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} color="#10b981" />;
      case 'cancelled':
        return <XCircle size={16} color="#ef4444" />;
      default:
        return <AlertCircle size={16} color="#f59e0b" />;
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
        <p className="text-gray-600">Manage your PG properties and bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1', marginBottom: '8px' }}>
              {pgs.length}
            </div>
            <div className="text-gray-600">Total PGs</div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {pgs.reduce((sum, pg) => sum + pg.availableRooms, 0)}
            </div>
            <div className="text-gray-600">Available Rooms</div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
              {bookings.length}
            </div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending Requests</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <button
            onClick={() => setActiveTab('pgs')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'pgs' ? '2px solid #6366f1' : 'none',
              color: activeTab === 'pgs' ? '#6366f1' : '#6b7280'
            }}
          >
            My PGs ({pgs.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'bookings' ? '2px solid #6366f1' : 'none',
              color: activeTab === 'bookings' ? '#6366f1' : '#6b7280'
            }}
          >
            Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {/* PGs Tab */}
      {activeTab === 'pgs' && (
        <div>
          {/* Add PG Button */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingPG(null);
                setFormData({
                  name: '',
                  city: '',
                  address: '',
                  rent: '',
                  sharingType: 'double',
                  genderPreference: 'any',
                  amenities: [],
                  imageUrl: '',
                  description: '',
                  availableRooms: 1
                });
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={16} />
              Add New PG
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="card mb-6">
              <div className="card-header">
                <h3 className="text-lg font-semibold">
                  {editingPG ? 'Edit PG' : 'Add New PG'}
                </h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">PG Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Enter PG name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="form-textarea"
                        placeholder="Enter complete address"
                        rows="2"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Monthly Rent (₹)</label>
                      <input
                        type="number"
                        name="rent"
                        value={formData.rent}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Enter rent amount"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Available Rooms</label>
                      <input
                        type="number"
                        name="availableRooms"
                        value={formData.availableRooms}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Sharing Type</label>
                      <select
                        name="sharingType"
                        value={formData.sharingType}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="single">Single Room</option>
                        <option value="double">Double Sharing</option>
                        <option value="triple">Triple Sharing</option>
                        <option value="dormitory">Dormitory</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Gender Preference</label>
                      <select
                        name="genderPreference"
                        value={formData.genderPreference}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="any">Co-ed</option>
                        <option value="male">Boys Only</option>
                        <option value="female">Girls Only</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Image URL (Optional)</label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter image URL"
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-textarea"
                        placeholder="Describe your PG..."
                        rows="3"
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Amenities</label>
                      <div className="grid grid-3 gap-2">
                        {availableAmenities.map(amenity => (
                          <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="checkbox"
                              name="amenities"
                              value={amenity}
                              checked={formData.amenities.includes(amenity)}
                              onChange={handleInputChange}
                            />
                            {amenity}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button type="submit" className="btn btn-primary">
                      {editingPG ? 'Update PG' : 'Add PG'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingPG(null);
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* PGs List */}
          {pgs.length > 0 ? (
            <div className="grid grid-2 gap-6">
              {pgs.map(pg => (
                <div key={pg.id} className="card">
                  <div style={{
                    height: '150px',
                    backgroundImage: `url(${pg.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px 12px 0 0'
                  }} />
                  
                  <div className="card-body">
                    <h3 className="text-lg font-semibold mb-2">{pg.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <MapPin size={14} color="#6b7280" />
                      <span className="text-gray-600 text-sm">{pg.city}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="text-lg font-bold text-green-600">₹{pg.rent?.toLocaleString()}/month</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={14} />
                        <span className="text-sm">{pg.sharingType}</span>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <span className={`badge ${pg.availableRooms > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {pg.availableRooms} room{pg.availableRooms !== 1 ? 's' : ''} available
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(pg)}
                        className="btn btn-outline"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pg.id)}
                        className="btn btn-danger"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
              <h3 className="text-xl font-semibold mb-4">No PGs Listed</h3>
              <p className="text-gray-600 mb-6">Start by adding your first PG property.</p>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          {bookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map(booking => (
                <div key={booking.id} className="card">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Booking #{booking.id}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <MapPin size={14} color="#6b7280" />
                          <span className="text-gray-600 text-sm">PG ID: {booking.pgId}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} color="#6b7280" />
                          <span className="text-gray-600 text-sm">
                            Move-in: {new Date(booking.bookingDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusIcon(booking.status)}
                        <span className={`badge badge-${booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'warning'}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    
                    {booking.message && (
                      <div style={{
                        padding: '12px',
                        backgroundColor: '#f0f9ff',
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}>
                        <div className="text-sm font-semibold text-blue-700 mb-1">Tenant Message:</div>
                        <div className="text-sm text-blue-600">{booking.message}</div>
                      </div>
                    )}
                    
                    {booking.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => bookingAPI.updateBookingStatus(booking.id, 'confirmed')}
                          className="btn btn-success"
                          style={{ flex: 1 }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => bookingAPI.updateBookingStatus(booking.id, 'cancelled')}
                          className="btn btn-danger"
                          style={{ flex: 1 }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 className="text-xl font-semibold mb-4">No Bookings Yet</h3>
              <p className="text-gray-600">Booking requests will appear here when tenants book your PGs.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
