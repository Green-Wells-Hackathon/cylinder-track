import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: lazy(() => import('./pages/Layout')),
      children: [
        { index: true, Component: lazy(() => import('./pages/Login')) },
        { path: 'home', Component: lazy(() => import('./pages/customer/Home')) },
        { path: 'checkout', Component: lazy(() => import('./pages/customer/Checkout')) },

        {
          path: 'dashboard',
          Component: lazy(() => import('./pages/admin/Layout')),
          children: [
            { index: true, Component: lazy(() => import('./pages/admin/Dashboard')) },
            { path: 'orders', Component: lazy(() => import('./pages/admin/Orders')) },
          ]
        },

        {
          path: 'driver/',
          children: [
            { index: true, Component: lazy(() => import('./pages/driver/DriverDashboard')) },
            { path: 'orders', Component: lazy(() => import('./pages/driver/DriverOrders')) }, 
            { path: 'map', Component: lazy(() => import('./pages/driver/DriverMap')) },         
            { path: 'history', Component: lazy(() => import('./pages/driver/DriverHistory')) }, 
          ]
        },

      ],
    }
  ])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App