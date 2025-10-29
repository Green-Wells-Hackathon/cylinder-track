import React, { Suspense, lazy }  from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'


function App() {

  const router = createBrowserRouter([
  {
    path:"/",
    Component: lazy(() => import('./Pages/Layout')),
    children: [
      {index: true, Component: lazy(() => import('./Pages/Home'))},
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
