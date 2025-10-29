import React from 'react'
import { Outlet } from 'react-router'
import Nav from '../Nav'
function Layout() {
  return (
    <section>
        {/* nav */}
        <Nav/>
        <section>
            <Outlet />
        </section>
        {/* footer */}
    </section>
  )
}

export default Layout