import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Wifi, Car, Utensils, Shield, Phone, Mail, ArrowLeft } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { pgAPI } from '../services/api';

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pg, setPG] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchPGDetails();
  }, [id]);

  const fetchPGDetails = async () => {
    try {
      const data = await pgAPI.getPGById(id);
      setPG(data);
    } catch (error) {
      setError('Failed to load PG details');
      console.error('Error fetching PG details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'WiFi': <Wifi size={20} />,
      'Parking': <Car size={20} />,
      'Meals': <Utensils size={20} />,
      'Security': <Shield size={20} />,
      'CCTV': <Shield size={20} />,
      'AC': '❄️',
      'Laundry': '🧺',
      'Gym': '💪',
      'Swimming Pool': '🏊‍♂️',
      'Power Backup': '🔋'
    };
    return iconMap[amenity] || '✓';
  };

  const getSharingTypeDisplay = (type) => {
    const typeMap = {
      'single': 'Single Room',
      'double': 'Double Sharing',
      'triple': 'Triple Sharing',
      'dormitory': 'Dormitory'
    };
    return typeMap[type] || type;
  };

  const getGenderDisplay = (gender) => {
    const genderMap = {
      'male': 'Boys Only',
      'female': 'Girls Only',
      'any': 'Co-ed'
    };
    return genderMap[gender] || gender;
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="text-gray-600 mt-4">Loading PG details...</p>
        </div>
      </div>
    );
  }

  if (error || !pg) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">PG Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested PG could not be found.'}</p>
          <button onClick={() => navigate('/search')} className="btn btn-primary">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary mb-6"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Main Content */}
        <div>
          {/* Image */}
          <div style={{
            height: '400px',
            backgroundImage: `url(${pg.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            marginBottom: '24px',
            position: 'relative'
          }}>
            {pg.isVerified && (
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                ✓ Verified Property
              </div>
            )}
          </div>

          {/* Title and Location */}
          <div style={{ marginBottom: '24px' }}>
            <h1 className="text-3xl font-bold mb-4">{pg.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MapPin size={20} color="#6b7280" />
              <span className="text-lg text-gray-600">{pg.address}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="badge badge-primary">
                {getGenderDisplay(pg.genderPreference)}
              </div>
              <div className="badge badge-success">
                <Users size={14} style={{ marginRight: '4px' }} />
                {getSharingTypeDisplay(pg.sharingType)}
              </div>
              {pg.availableRooms > 0 && (
                <div className="badge badge-warning">
                  {pg.availableRooms} room{pg.availableRooms > 1 ? 's' : ''} available
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {pg.description && (
            <div style={{ marginBottom: '32px' }}>
              <h3 className="text-xl font-semibold mb-4">About This PG</h3>
              <p className="text-gray-700 leading-relaxed">{pg.description}</p>
            </div>
          )}

          {/* Amenities */}
          <div style={{ marginBottom: '32px' }}>
            <h3 className="text-xl font-semibold mb-4">Amenities & Facilities</h3>
            <div className="grid grid-3 gap-4">
              {pg.amenities?.map((amenity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ color: '#6366f1' }}>
                    {getAmenityIcon(amenity)}
                  </div>
                  <span style={{ fontWeight: '500' }}>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Booking Card */}
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <div className="card-body">
              {/* Price */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#059669',
                  marginBottom: '4px'
                }}>
                  ₹{pg.rent?.toLocaleString()}
                </div>
                <div className="text-gray-600">per month</div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '16px' }}
                disabled={pg.availableRooms === 0}
              >
                {pg.availableRooms === 0 ? 'No Rooms Available' : 'Book Now'}
              </button>

              {/* Contact Info */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Contact Owner
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px' }}>+91 9876543210</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px' }}>owner@example.com</span>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Key Features
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-gray-600">Room Type:</span>
                    <span style={{ fontWeight: '500' }}>{getSharingTypeDisplay(pg.sharingType)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-gray-600">Gender:</span>
                    <span style={{ fontWeight: '500' }}>{getGenderDisplay(pg.genderPreference)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-gray-600">Available Rooms:</span>
                    <span style={{ fontWeight: '500', color: pg.availableRooms > 0 ? '#059669' : '#dc2626' }}>
                      {pg.availableRooms}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-gray-600">Verification:</span>
                    <span style={{ 
                      fontWeight: '500', 
                      color: pg.isVerified ? '#059669' : '#f59e0b' 
                    }}>
                      {pg.isVerified ? '✓ Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        pg={pg}
      />
    </div>
  );
};

export default PGDetails;
