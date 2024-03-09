import React from 'react'
import Sidebar from '../Sidebar'
import Table from '../../../Components/Table'
import {  HiPlusCircle } from 'react-icons/hi'

function Genres() {
  return (
    <Sidebar>
      <div className='flex flex-col gap-6'>
        <div className='flex-btn gap-2'>
         <h2 className='text-xl font-bold'>Genres</h2>
         <button 
           className='bg-subMain flex-rows gap-4 font-medium transitions hover:bg-main border-subMain text-white py-2 px-4 rounded'>
            <HiPlusCircle/>  Create
         </button>
        </div>

        <Table data={[]} user={false}/>   {/*populate table with boookmarked animes here*/}
      </div>
    </Sidebar>
  )
}

export default Genres
