import React from 'react'
import OrdersTable from '../../components/OrdersTable'

function Orders() {
  return (
    <>
       <h1 className="text-2xl font-bold mb-5">Orders</h1>
      <section className="w-full">
        <OrdersTable />
      </section>
    </>
  )
}

export default Orders