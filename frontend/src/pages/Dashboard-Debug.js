import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingAPI } from '../services/api';

const DashboardDebug = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    console.log('Dashboard Debug - User:', user);
    setDebugInfo(`User: ${JSON.stringify(user, null, 2)}`);
    
    if (user) {
      fetchUserBookings();
    } else {
      setDebugInfo(prev => prev + '\n\nNo user found - not logged in?');
      setLoading(false);
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      console.log('Fetching bookings for user ID:', user.id);
      setDebugInfo(prev => prev + `\n\nFetching bookings for user ID: ${user.id}`);
      
      const data = await bookingAPI.getUserBookings(user.id);
      console.log('Bookings response:', data);
      
      setBookings(data);
      setDebugInfo(prev => prev + `\n\nBookings response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings: ' + error.message);
      setDebugInfo(prev => prev + `\n\nError: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Debug</h1>
      
      <div className="card mb-6">
        <div className="card-header">
          <h2>Debug Information</h2>
        </div>
        <div className="card-body">
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {debugInfo}
          </pre>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="card">
        <div className="card-header">
          <h2>Bookings ({bookings.length})</h2>
        </div>
        <div className="card-body">
          {bookings.length > 0 ? (
            <pre>{JSON.stringify(bookings, null, 2)}</pre>
          ) : (
            <p>No bookings found</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3>Test Links:</h3>
        <ul>
          <li><a href="http://localhost:8080/api/bookings/user/2" target="_blank">Test User 2 Bookings</a></li>
          <li><a href="http://localhost:8080/api/pgs" target="_blank">Test PG List</a></li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardDebug;
