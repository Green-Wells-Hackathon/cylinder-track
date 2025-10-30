import React from 'react'
import AnimatedStatCard from '../../components/AnimatedStatCard'
import ChartsSection from '../../components/ChartsSection'

function Dashboard() {
  return (
    <>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-7'>
           <AnimatedStatCard 
             title="Total deliveries" 
             value="60" 
             percentage ="+24%" 
             percentageColorClass="text-green-600"
           />
           <AnimatedStatCard 
             title="Returns Today" 
             value="5" 
             percentage ="+4%" 
             percentageColorClass="text-green-600"
           />
           <AnimatedStatCard 
             title="In Stock" 
             value="300" 
             percentage ="" 
             percentageColorClass="text-green-600"
           />
           <AnimatedStatCard 
             title="Drivers" 
             value="132" 
             percentage ="" 
             percentageColorClass="text-green-600"
           />
        </section>
        <ChartsSection />
    </>
  )
}

export default Dashboard