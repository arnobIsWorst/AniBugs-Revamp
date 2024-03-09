import React from 'react'
import UserSidebar from '../UserSidebar'
import { UserAuth } from '../../../Context/UserContext'
import { getUserFollows } from '../../../api'
import Table3 from '../../../Components/Table3'

function Following() {
  const{ user } = UserAuth()
  const  id  = user?.id
  const[follows, setFollows] = React.useState([])

  React.useEffect(() => {
    if(id){
      const fetchFollows = async () => {
        try {
          const data = await getUserFollows(id)
          console.log(data)
          setFollows(data)
        }catch (error) {
          console.log(error)
        }
      }
      fetchFollows()  
    }
  },[id])

  console.log(follows)
  return (
    <UserSidebar>
      <div className='flex flex-col gap-6'>
        <div className='flex-btn gap-2'>
         <h2 className='text-xl font-bold'>Following Studios</h2>
         <button 
           className='bg-main font-medium transitions hover:bg-subMain border-subMain text-white py-3 px-6 rounded'>
              Clear All
         </button>
        </div>

        <Table3 data={follows} user={user}/>   
      </div>
    </UserSidebar>
  )
}

export default Following
