import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import './driver.css';
import { getOrderById } from './ordersService';
import { FaShoppingCart, FaHourglassHalf } from 'react-icons/fa';

const DRIVER_COORDS = { lat: -1.286389, lng: 36.821667 };

const customIcon = (color = 'blue') => new L.Icon({
  iconUrl: color === 'green' ? 'https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=home|00a65a' : 'https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=car|2F9E44',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

export default function DriverMap() {
  const loc = useLocation();
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get('id');
  const stateOrder = loc.state?.order || null;
  const [order, setOrder] = useState(stateOrder);

  useEffect(() => {
    if (!stateOrder && idParam) {
      (async () => {
        const ord = await getOrderById(idParam);
        setOrder(ord);
      })();
    }
  }, [idParam, stateOrder]);

  const customerCoords = order?.coords || { lat: -1.3100, lng: 36.8400 };

  const route = useMemo(() => [
    [DRIVER_COORDS.lat, DRIVER_COORDS.lng],
    [(DRIVER_COORDS.lat + customerCoords.lat) / 2 + 0.01, (DRIVER_COORDS.lng + customerCoords.lng) / 2 - 0.02],
    [customerCoords.lat, customerCoords.lng]
  ], [customerCoords]);

  return (
    <div className="driver-page">
      <aside className="driver-sidebar">
        <div className="driver-logo">
          <img src="/images/cylinder-logo.png" alt="logo" />
          <h1>CylinderTrack</h1>
        </div>
        <nav className="driver-nav">
          <Link to="/driver/orders"><FaShoppingCart /> Orders</Link>
          <Link to="/driver/history"><FaHourglassHalf /> History</Link>
        </nav>
      </aside>

      <main className="driver-main">
        <h2 className="page-title">Order Delivery</h2>

        <div className="map-card">
          <MapContainer center={[DRIVER_COORDS.lat, DRIVER_COORDS.lng]} zoom={12} className="leaflet-container" scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[DRIVER_COORDS.lat, DRIVER_COORDS.lng]} icon={customIcon('blue')}>
              <Popup><strong>Driver:</strong> Semhal Tesfay</Popup>
            </Marker>

            <Marker position={[customerCoords.lat, customerCoords.lng]} icon={customIcon('green')}>
              <Popup><strong>Customer:</strong> {order?.buyer || 'Customer'}</Popup>
            </Marker>

            <Polyline positions={route} color="crimson" weight={6} />
          </MapContainer>
        </div>
      </main>
    </div>
  );
}