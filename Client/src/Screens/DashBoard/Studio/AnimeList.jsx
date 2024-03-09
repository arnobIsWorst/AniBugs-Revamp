import React from 'react'
import Sidebar from '../Sidebar'
import Table from '../../../Components/Table'

function AnimeList() {
  return (
    <Sidebar>
      <div className='flex flex-col gap-6'>
        <div className='flex-btn gap-2'>
         <h2 className='text-xl font-bold'>Animes List</h2>
         <button 
           className='bg-main font-medium transitions hover:bg-subMain border-subMain text-white py-3 px-6 rounded'>
              Clear All
         </button>
        </div>

        <Table data={[]} user={false}/>   {/*populate table with boookmarked animes here*/}
      </div>
    </Sidebar>
  )
}

export default AnimeList
