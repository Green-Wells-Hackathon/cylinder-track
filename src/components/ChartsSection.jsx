import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

// The component accepts 'orders' as a prop
function ChartsSection({ orders }) {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  // This useEffect will re-run whenever the 'orders' prop changes
  useEffect(() => {
    console.log('Orders data for charts:', orders);
    // --- FIX: Guard Clause ---
    // This is the crucial update. It checks if 'orders' has data before
    // trying to use it, which prevents the 'forEach' of undefined error.
    if (!orders || orders.length === 0) {
      return; // Exit the effect if there's no data yet
    }

    let barChartInstance = null;
    let pieChartInstance = null;

    // --- Process Data for Charts ---

    // 1. Bar Chart: Group orders by month
    const monthlyCounts = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    orders.forEach(order => {
      // Firebase Timestamps must be converted to JS Date objects
      const date = order.created_at.toDate();
      const monthKey = `${date.getFullYear()}-${monthNames[date.getMonth()]}`;
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });

    const barChartLabels = Object.keys(monthlyCounts).reverse();
    const barChartData = Object.values(monthlyCounts).reverse();


    // 2. Pie Chart: Group orders by status
    // NOTE: This assumes you have a field named 'order_status' in your Firestore documents.
    const statusCounts = {
        'delivered': 0,
        'assigned': 0,
        'in-delivery': 0,
        'pending': 0,
    };

    orders.forEach(order => {
      if (order.order_status && statusCounts.hasOwnProperty(order.order_status)) {
        statusCounts[order.order_status]++;
      } else {
        // If status is different or not set, it's counted as 'pending'
        statusCounts['pending']++; 
      }
    });
    
    const pieChartLabels = Object.keys(statusCounts);
    const pieChartData = Object.values(statusCounts);


    // --- Create Bar Chart ---
    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext('2d');
      barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: barChartLabels,
          datasets: [{
            label: 'Cylinders Delivered',
            data: barChartData,
            backgroundColor: 'rgba(47, 158, 68, 0.6)',
            borderColor: 'rgba(47, 158, 68, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: 'Gas Delivery Trends', font: { size: 18, weight: '600' }, padding: { bottom: 20 } },
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Number of Cylinders' }, grid: { color: 'rgba(0, 0, 0, 0.1)', borderDash: [5, 5] } },
            x: { title: { display: true, text: 'Months' }, grid: { display: false } }
          }
        }
      });
    }

    // --- Create Pie Chart ---
    if (pieChartRef.current) {
      const pieCtx = pieChartRef.current.getContext('2d');
      pieChartInstance = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: pieChartLabels,
          datasets: [{
            label: 'Order Status',
            data: pieChartData,
            backgroundColor: [
              'rgba(47, 158, 68, 0.8)',   // Delivered
              'rgba(52, 152, 219, 0.8)', // Assigned
              'rgba(241, 196, 15, 0.8)', // In-delivery
              'rgba(231, 76, 60, 0.8)'   // Pending
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: 'Order Status Breakdown', font: { size: 18, weight: '600' }, padding: { bottom: 20 } },
            legend: { position: 'top' }
          }
        }
      });
    }

    // Cleanup function to destroy old charts when data updates
    return () => {
      if (barChartInstance) barChartInstance.destroy();
      if (pieChartInstance) pieChartInstance.destroy();
    };
  }, [orders]); // Dependency array ensures charts rebuild when 'orders' data changes

  return (
    <section className="mt-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Bar Chart Card */}
        <div className="w-full lg:w-1/2 p-4 md:p-6 bg-white rounded-[28px] shadow-sm">
          <div className="relative h-96">
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="w-full lg:w-1/2 p-4 md:p-6 bg-white rounded-[28px] shadow-sm">
          <div className="relative h-96">
            <canvas ref={pieChartRef}></canvas>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChartsSection;