import React from 'react'
import { Outlet } from 'react-router'

function Layout() {
  return (
    <section>
        {/* nav */}
        <section>
            <Outlet />
        </section>
        {/* footer */}
    </section>
  )
}

export default Layout