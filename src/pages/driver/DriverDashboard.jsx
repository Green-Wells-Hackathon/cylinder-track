import React from 'react';
import { FaCarSide, FaWallet, FaRoute } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function DriverDashboard() {
  return (
    <div style={{padding:24}}>
      <h2>Driver Dashboard</h2>
      <div style={{display:'flex', gap:16}}>
        <div style={{padding:12, border:'1px solid #ddd', borderRadius:8}}>
          <FaCarSide size={24} />
          <div>Active ride</div>
        </div>
        <div style={{padding:12, border:'1px solid #ddd', borderRadius:8}}>
          <FaWallet size={24} />
          <div>Earnings</div>
        </div>
        <div style={{padding:12, border:'1px solid #ddd', borderRadius:8}}>
          <FaRoute size={24} />
          <div>Route</div>
        </div>
      </div>
      <p style={{marginTop:16}}><Link to="/driver/orders">Go to Orders</Link></p>
    </div>
  );
}