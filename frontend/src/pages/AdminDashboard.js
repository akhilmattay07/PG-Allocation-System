import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { pgAPI, bookingAPI } from '../services/api';
import { Users, Home, Calendar, TrendingUp, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPGs: 0,
    totalBookings: 0,
    pendingVerifications: 0,
    totalRevenue: 0
  });
  const [pgs, setPGs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // In a real app, you'd have admin-specific endpoints
      const pgsData = await pgAPI.getAllPGs();
      setPGs(pgsData);
      
      // Calculate stats
      setStats({
        totalPGs: pgsData.length,
        totalBookings: 0, // Would come from admin endpoint
        pendingVerifications: pgsData.filter(pg => !pg.isVerified).length,
        totalRevenue: pgsData.reduce((sum, pg) => sum + (pg.rent || 0), 0)
      });
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
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
          <p className="text-gray-600 mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform management and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body text-center">
            <div style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: '#e0e7ff', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <Home size={24} color="#6366f1" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#6366f1', marginBottom: '4px' }}>
              {stats.totalPGs}
            </div>
            <div className="text-gray-600">Total PGs</div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <div style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: '#dcfce7', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <Users size={24} color="#10b981" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
              {stats.totalBookings}
            </div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <div style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: '#fef3c7', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <AlertCircle size={24} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
              {stats.pendingVerifications}
            </div>
            <div className="text-gray-600">Pending Verifications</div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <div style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: '#fee2e2', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <TrendingUp size={24} color="#ef4444" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444', marginBottom: '4px' }}>
              ₹{(stats.totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="text-gray-600">Platform Value</div>
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
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'overview' ? '2px solid #6366f1' : 'none',
              color: activeTab === 'overview' ? '#6366f1' : '#6b7280'
            }}
          >
            Overview
          </button>
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
            All PGs ({pgs.length})
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'verifications' ? '2px solid #6366f1' : 'none',
              color: activeTab === 'verifications' ? '#6366f1' : '#6b7280'
            }}
          >
            Pending Verifications ({stats.pendingVerifications})
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-2 gap-6">
            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>New PG listing added</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>2 hours ago</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>Verification pending</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>5 hours ago</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#6366f1', borderRadius: '50%' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>New user registered</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>1 day ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Analytics */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">Platform Analytics</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-gray-600">Verified PGs</span>
                    <span style={{ fontWeight: '600' }}>
                      {pgs.filter(pg => pg.isVerified).length} / {pgs.length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-gray-600">Average Rent</span>
                    <span style={{ fontWeight: '600' }}>
                      ₹{pgs.length > 0 ? Math.round(pgs.reduce((sum, pg) => sum + (pg.rent || 0), 0) / pgs.length).toLocaleString() : 0}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-gray-600">Cities Covered</span>
                    <span style={{ fontWeight: '600' }}>
                      {new Set(pgs.map(pg => pg.city)).size}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-gray-600">Total Available Rooms</span>
                    <span style={{ fontWeight: '600' }}>
                      {pgs.reduce((sum, pg) => sum + (pg.availableRooms || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All PGs Tab */}
      {activeTab === 'pgs' && (
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">All PG Listings</h3>
            </div>
            <div className="card-body">
              {pgs.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>PG Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>City</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Rent</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pgs.map(pg => (
                        <tr key={pg.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '500' }}>{pg.name}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {pg.id}</div>
                          </td>
                          <td style={{ padding: '12px' }}>{pg.city}</td>
                          <td style={{ padding: '12px', fontWeight: '600', color: '#059669' }}>
                            ₹{pg.rent?.toLocaleString()}
                          </td>
                          <td style={{ padding: '12px' }}>{pg.sharingType}</td>
                          <td style={{ padding: '12px' }}>
                            <span className={`badge ${pg.isVerified ? 'badge-success' : 'badge-warning'}`}>
                              {pg.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <button
                              className="btn btn-outline"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                            >
                              <Eye size={12} style={{ marginRight: '4px' }} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No PG listings found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verifications Tab */}
      {activeTab === 'verifications' && (
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Pending Verifications</h3>
            </div>
            <div className="card-body">
              {pgs.filter(pg => !pg.isVerified).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pgs.filter(pg => !pg.isVerified).map(pg => (
                    <div key={pg.id} style={{
                      padding: '20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      backgroundColor: '#fafafa'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                            {pg.name}
                          </h4>
                          <p style={{ color: '#6b7280', marginBottom: '8px' }}>{pg.address}</p>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <span style={{ fontSize: '14px' }}>
                              <strong>Rent:</strong> ₹{pg.rent?.toLocaleString()}
                            </span>
                            <span style={{ fontSize: '14px' }}>
                              <strong>Type:</strong> {pg.sharingType}
                            </span>
                            <span style={{ fontSize: '14px' }}>
                              <strong>Rooms:</strong> {pg.availableRooms}
                            </span>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '14px' }}>
                            Approve
                          </button>
                          <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '14px' }}>
                            Reject
                          </button>
                        </div>
                      </div>
                      
                      {pg.description && (
                        <div style={{
                          padding: '12px',
                          backgroundColor: '#f0f9ff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          color: '#0369a1'
                        }}>
                          {pg.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                  <h4 className="text-lg font-semibold mb-2">All Caught Up!</h4>
                  <p className="text-gray-600">No pending verifications at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
