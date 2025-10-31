import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase'; // Adjust this path to your firebase config file
import { collection, onSnapshot } from 'firebase/firestore';

import AnimatedStatCard from '../../components/AnimatedStatCard';
import ChartsSection from '../../components/ChartsSection';

function Dashboard() {
  // --- State for each data source ---
  const [orders, setOrders] = useState([]);
  const [driverCount, setDriverCount] = useState(0);
  const [stockCount, setStockCount] = useState(0);

  // --- Loading state for each data source ---
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [loadingStock, setLoadingStock] = useState(true);

  // This effect will run once when the component mounts
  useEffect(() => {
    // 1. Set up listener for ORDERS
    const ordersRef = collection(db, 'orders');
    const unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoadingOrders(false);
    });

    // 2. Set up listener for USERS (to count drivers)
    const usersRef = collection(db, 'users');
    const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
      let count = 0;
      snapshot.forEach(doc => {
        if (doc.data().role === 'driver') {
          count++;
        }
      });
      setDriverCount(count);
      setLoadingDrivers(false);
    });

    // 3. Set up listener for CYLINDERS (to count stock)
    const cylindersRef = collection(db, 'cylinders');
    const unsubscribeCylinders = onSnapshot(cylindersRef, (snapshot) => {
      // .size is the most efficient way to get the count of documents
      setStockCount(snapshot.size); 
      setLoadingStock(false);
    });

    // Cleanup: Unsubscribe from all listeners when the component unmounts
    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
      unsubscribeCylinders();
    };
  }, []); // The empty dependency array ensures this runs only once

  // Calculate statistics from the orders data
  const totalDeliveries = orders.length;
  const totalSales = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

  // Show loading screen until all data is fetched
  if (loadingOrders || loadingDrivers || loadingStock) {
    return <h1 className="text-2xl font-bold p-8 text-center">Loading Dashboard...</h1>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-7'>
        <AnimatedStatCard
          title="Total deliveries"
          value={totalDeliveries} 
          percentage=""
          percentageColorClass="text-green-600"
        />
        <AnimatedStatCard
          title="Total Sales (KES)"
          value={totalSales.toLocaleString()}
          percentage=""
          percentageColorClass="text-green-600"
        />
        <AnimatedStatCard
          title="In Stock"
          value={stockCount} // <-- DYNAMIC DATA
          percentage=""
          percentageColorClass="text-green-600"
        />
        <AnimatedStatCard
          title="Drivers"
          value={driverCount} // <-- DYNAMIC DATA
          percentage=""
          percentageColorClass="text-green-600"
        />
      </section>
      <ChartsSection orders={orders} />
    </>
  );
}

export default Dashboard;