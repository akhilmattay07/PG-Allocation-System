import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingAPI } from '../services/api';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      const data = await bookingAPI.getUserBookings(user.id);
      setBookings(data);
    } catch (error) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={20} color="#10b981" />;
      case 'cancelled':
        return <XCircle size={20} color="#ef4444" />;
      default:
        return <AlertCircle size={20} color="#f59e0b" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Manage your PG bookings and account settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-3 gap-6 mb-8">
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1', marginBottom: '8px' }}>
              {bookings.length}
            </div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-gray-600">Confirmed</div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold">My Bookings</h2>
        </div>
        
        <div className="card-body">
          {loading ? (
            <div className="text-center py-8">
              <div className="spinner"></div>
              <p className="text-gray-600 mt-4">Loading your bookings...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">
              {error}
            </div>
          ) : bookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                        Booking #{booking.id}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
                        <MapPin size={14} />
                        <span style={{ fontSize: '14px' }}>PG ID: {booking.pgId}</span>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: 'white',
                      border: `2px solid ${getStatusColor(booking.status)}`
                    }}>
                      {getStatusIcon(booking.status)}
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: getStatusColor(booking.status),
                        textTransform: 'capitalize'
                      }}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        Move-in: {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        Booked on: {formatDate(booking.createdAt || booking.bookingDate)}
                      </span>
                    </div>
                  </div>

                  {booking.message && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '8px',
                      border: '1px solid #bae6fd'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#0369a1', marginBottom: '4px' }}>
                        Your Message:
                      </div>
                      <div style={{ fontSize: '14px', color: '#0369a1' }}>
                        {booking.message}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 className="text-xl font-semibold mb-4">No Bookings Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't made any PG bookings yet. Start exploring our listings!
              </p>
              <a href="/search" className="btn btn-primary">
                Browse PGs
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="card mt-8">
        <div className="card-header">
          <h2 className="text-xl font-semibold">Account Information</h2>
        </div>
        
        <div className="card-body">
          <div className="grid grid-2 gap-6">
            <div>
              <label className="form-label">Full Name</label>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                {user?.name}
              </div>
            </div>
            
            <div>
              <label className="form-label">Email Address</label>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                {user?.email}
              </div>
            </div>
            
            <div>
              <label className="form-label">Account Type</label>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                textTransform: 'capitalize'
              }}>
                🏠 {user?.role}
              </div>
            </div>
            
            <div>
              <label className="form-label">Phone Number</label>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                {user?.phone || 'Not provided'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
