import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function ChartsSection() {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    let barChartInstance = null;
    let pieChartInstance = null;

    // ---  Bar Chart ---
    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext('2d');
      
      barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['June', 'July', 'August', 'September', 'October', 'November'],
          datasets: [{
            label: 'Cylinders Delivered',
            data: [130, 155, 142, 178, 160, 195],
            backgroundColor: 'rgba(47, 158, 68, 0.6)', 
            borderColor: 'rgba(47, 158, 68, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, 
          plugins: {
            title: {
              display: true,
              text: 'Gas Delivery Trends',
              font: { size: 18, weight: '600' },
              padding: { bottom: 20 }
            },
            legend: {
              display: false 
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Cylinders'
              },

              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                borderDash: [5, 5], 
              }
            },
            x: {
              title: {
                display: true,
                text: 'Months'
              },
              grid: {
                display: false 
              }
            }
          }
        }
      });
    }

    // --- Pie Chart ---
    if (pieChartRef.current) {
      const pieCtx = pieChartRef.current.getContext('2d');
      
      pieChartInstance = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['Delivered', 'Assigned', 'In-delivery', 'Pending'],
          datasets: [{
            label: 'Order Status',
            data: [280, 45, 80, 30],
            backgroundColor: [
              'rgba(47, 158, 68, 0.8)',  // Delivered (Green)
              'rgba(52, 152, 219, 0.8)', // Assigned (Blue)
              'rgba(241, 196, 15, 0.8)', // In-delivery (Yellow)
              'rgba(231, 76, 60, 0.8)'   // Pending (Red)
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Order Status Breakdown',
              font: { size: 18, weight: '600' },
              padding: { bottom: 20 }
            },
            legend: {
              position: 'top',
            }
          }
        }
      });
    }

    return () => {
      if (barChartInstance) {
        barChartInstance.destroy();
      }
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }
    };
  }, []); 

  return (
    <section className="mt-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Bar Chart Card */}
        <div className="w-full lg:w-1/2 p-4 md:p-6 bg-white rounded-[28px] shadow-sm">
          {/* This container gives the chart a fixed height */}
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
)
}

export default ChartsSection;