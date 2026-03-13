import React, { useState } from 'react';
import { X, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { bookingAPI } from '../services/api';

const BookingModal = ({ isOpen, onClose, pg }) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    bookingDate: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setError('Please login to book a PG');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        pgId: pg.id,
        userId: user.id,
        bookingDate: formData.bookingDate,
        message: formData.message
      };

      await bookingAPI.createBooking(bookingData);
      setSuccess(true);
      
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setSuccess(false);
        setFormData({ bookingDate: '', message: '' });
        onClose();
      }, 2000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Get tomorrow's date as minimum booking date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Book PG: {pg?.name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {success ? (
            <div className="alert alert-success">
              <strong>Booking Successful!</strong> Your booking request has been sent to the PG owner. 
              You will be notified once it's confirmed.
            </div>
          ) : (
            <>
              {error && (
                <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                  {error}
                </div>
              )}

              {!isAuthenticated() ? (
                <div className="alert alert-info">
                  Please <a href="/login" style={{ color: '#1e40af', textDecoration: 'underline' }}>login</a> to book this PG.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* PG Details Summary */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Booking Details</h4>
                    <p style={{ margin: '4px 0', color: '#6b7280' }}>
                      <strong>PG:</strong> {pg?.name}
                    </p>
                    <p style={{ margin: '4px 0', color: '#6b7280' }}>
                      <strong>Location:</strong> {pg?.address}
                    </p>
                    <p style={{ margin: '4px 0', color: '#6b7280' }}>
                      <strong>Rent:</strong> ₹{pg?.rent?.toLocaleString()}/month
                    </p>
                    <p style={{ margin: '4px 0', color: '#6b7280' }}>
                      <strong>Type:</strong> {pg?.sharingType}
                    </p>
                  </div>

                  {/* Booking Date */}
                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                      Preferred Move-in Date
                    </label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      min={minDate}
                      required
                      className="form-input"
                    />
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label className="form-label">
                      <MessageSquare size={16} style={{ display: 'inline', marginRight: '8px' }} />
                      Message to Owner (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Any specific requirements or questions..."
                      className="form-textarea"
                      rows="4"
                    />
                  </div>

                  {/* Submit Button */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                      style={{ flex: 1 }}
                    >
                      {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
