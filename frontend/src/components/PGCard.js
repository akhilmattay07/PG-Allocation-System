import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Wifi, Car, Utensils, Shield, Star } from 'lucide-react';

const PGCard = ({ pg }) => {
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'WiFi': <Wifi size={16} />,
      'Parking': <Car size={16} />,
      'Meals': <Utensils size={16} />,
      'Security': <Shield size={16} />,
      'CCTV': <Shield size={16} />,
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

  return (
    <div className="card">
      {/* Image */}
      <div style={{ 
        height: '200px', 
        backgroundImage: `url(${pg.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {pg.isVerified && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#10b981',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            ✓ Verified
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          {getGenderDisplay(pg.genderPreference)}
        </div>
      </div>

      <div className="card-body">
        {/* Title and Location */}
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '4px',
            color: '#1e293b'
          }}>
            {pg.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
            <MapPin size={14} />
            <span style={{ fontSize: '14px' }}>{pg.address}</span>
          </div>
        </div>

        {/* Price and Sharing */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <div>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#059669' 
            }}>
              ₹{pg.rent?.toLocaleString()}
            </span>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>/month</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            backgroundColor: '#f1f5f9',
            padding: '4px 8px',
            borderRadius: '8px'
          }}>
            <Users size={14} />
            <span style={{ fontSize: '12px', fontWeight: '600' }}>
              {getSharingTypeDisplay(pg.sharingType)}
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '6px' 
          }}>
            {pg.amenities?.slice(0, 4).map((amenity, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500'
                }}
              >
                {getAmenityIcon(amenity)}
                {amenity}
              </div>
            ))}
            {pg.amenities?.length > 4 && (
              <div style={{
                backgroundColor: '#f1f5f9',
                color: '#6b7280',
                padding: '2px 6px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                +{pg.amenities.length - 4} more
              </div>
            )}
          </div>
        </div>

        {/* Available Rooms */}
        {pg.availableRooms > 0 && (
          <div style={{ 
            marginBottom: '16px',
            color: '#059669',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {pg.availableRooms} room{pg.availableRooms > 1 ? 's' : ''} available
          </div>
        )}
      </div>

      <div className="card-footer">
        <Link 
          to={`/pg/${pg.id}`}
          className="btn btn-primary"
          style={{ width: '100%', textAlign: 'center' }}
        >
          View Details & Book
        </Link>
      </div>
    </div>
  );
};

export default PGCard;
