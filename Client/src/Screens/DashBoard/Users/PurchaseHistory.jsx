import React from 'react'
import UserSidebar from '../UserSidebar'
import Table2 from '../../../Components/Table'
import { UserAuth } from '../../../Context/UserContext'
import { getPurchaseHistory } from '../../../api'

function PurchaseHistory() {
  const { user } = UserAuth()
  const  id  = user?.id
  const[purchasedAnimes, setPurchasedAnimes] = React.useState([])

  React.useEffect(() => {
    if(id){
      const fetchPurchasedAnimes = async () => {
        try {
          const data = await getPurchaseHistory(id)
          console.log(data)
          setPurchasedAnimes(data)
        }catch (error) {
          console.log(error)
        }
      }
      fetchPurchasedAnimes()  
    }
  },[id])

  return (
    <UserSidebar>
      <div className='flex flex-col gap-6'>
        <div className='flex-btn gap-2'>
         <h2 className='text-xl font-bold'>Purchased Animes</h2>
         <button 
           className='bg-main font-medium transitions hover:bg-subMain border-subMain text-white py-3 px-6 rounded'>
              Clear All
         </button>
        </div>

        <Table2 data={purchasedAnimes} user={user}/>   
      </div>
    </UserSidebar>
  )
}

export default PurchaseHistory
