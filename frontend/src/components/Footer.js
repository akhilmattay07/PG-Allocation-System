import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#1e293b',
      color: 'white',
      marginTop: '60px'
    }}>
      <div className="container py-12">
        <div className="grid grid-3 gap-6">
          {/* Company Info */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              🏠 PG Allocator
            </h3>
            <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
              Find your perfect Paying Guest accommodation with ease. 
              Connect with verified PG owners and secure your ideal living space.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                <Facebook size={20} />
              </a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                <Twitter size={20} />
              </a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                Home
              </Link>
              <Link to="/search" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                Search PGs
              </Link>
              <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                Login
              </Link>
              <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                Register
              </Link>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                About Us
              </a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                Contact
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} />
                <span style={{ color: '#94a3b8' }}>info@pgallocator.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} />
                <span style={{ color: '#94a3b8' }}>+91 9999999999</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} />
                <span style={{ color: '#94a3b8' }}>Bangalore, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #334155',
          marginTop: '32px',
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            © 2024 PG Allocator. All rights reserved. | 
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', marginLeft: '8px' }}>
              Privacy Policy
            </a> | 
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', marginLeft: '8px' }}>
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
