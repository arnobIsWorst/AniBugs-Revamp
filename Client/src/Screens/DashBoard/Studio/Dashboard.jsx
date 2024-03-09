import React from 'react'
import Sidebar from '../Sidebar'
import { FaRegListAlt, FaUser } from 'react-icons/fa'
import { HiViewGridAdd } from 'react-icons/hi'
import { MdCameraOutdoor } from "react-icons/md"
import Table from '../../../Components/Table'

function Dashboard() {
    const Dashboarddata = [
        {
          bg:'bg-orange-600',
          icon: FaRegListAlt,
          title: 'Total Animes',
          total: 90,
        },
        {
          bg:'bg-blue-700',
          icon: HiViewGridAdd,
          title: 'Total Genres',
          total:18,
        },
        {
          bg:'bg-green-600',
          icon: FaUser,
          title: 'Total Users',
          total: 200,
        },
        {
          bg:'bg-red-600',
          icon: MdCameraOutdoor,
          title: 'Total Studios',
          total: 29, 
        }
    ]
  return (
    <Sidebar>
        <h2 className='text-xl font-bold '>Dashboard</h2>
        <div className='grid sm:grid-cols-2 lg:grod-cols-3 gap-6 mt-4'>
           {Dashboarddata.map((data, index) => (
             <div key={index} className='p-4 rounded bg-main border-border grid grid-cols-4 gap-2'> 
               <div className={`col-span-1 rounded-full h-12 w-12 flex-colo ${data.bg}`}>
                  <data.icon />
               </div>
               <div className='col-span-4'>
                  <h2>{data.title}</h2>
                  <p className=' mt-2 font-bold'>{data.total}</p>
               </div>
             </div>
           ))}
        </div>
        <h3 className='text-md font-medium italic my-6 text-border'>Recent Animes</h3>
        {/* We can put here latest ones by fetching first or can use as some history*/}
        <Table data={[]} user={false} />
    </Sidebar>
  )
}

export default Dashboard
