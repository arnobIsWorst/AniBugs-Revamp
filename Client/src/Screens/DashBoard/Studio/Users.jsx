import React from 'react'
import Sidebar from '../Sidebar'
import Table from '../../../Components/Table'
import {  HiPlusCircle } from 'react-icons/hi'

function Users() {
  return (
    <Sidebar>
      <div className='flex flex-col gap-6'>
        <h2 className='text-xl font-bold'>Users</h2>
        <Table data={[]} users={false}/>   {/*populate table with Users who purchased something here*/}
      </div>
    </Sidebar>
  )
}

export default Users
