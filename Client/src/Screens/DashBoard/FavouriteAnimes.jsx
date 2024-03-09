import React,{useState} from 'react'
import Table from '../../Components/Table'
import UserSidebar from './UserSidebar'
import { getBookmarkedAnimes } from '../../api'
import { UserAuth } from '../../Context/UserContext'

function FavouriteAnimes() {
    const { user } = UserAuth()
    const  id  = user?.id
    //console.log(id)
    const[favAnimes, setFavAnimes] = useState([])

    React.useEffect(() => {
      if(id){
        const fetchBookmarks = async () => {
          try {
            const data = await getBookmarkedAnimes(id)
            console.log(data)
            setFavAnimes(data.animes)
            //console.log(favAnimes)
          } catch (error) {
            console.log(error)
          }
        }
        fetchBookmarks()
      }
    }, [id])
  return (
    <UserSidebar>
      <div className='flex flex-col gap-6'>
        <div className='flex-btn gap-2'>
         <h2 className='text-xl font-bold'>Bookmarked Animes</h2>
         <button 
           className='bg-main font-medium transitions hover:bg-subMain border-subMain text-white py-3 px-6 rounded'>
              Clear All
         </button>
        </div>

        <Table data={favAnimes} user={user}/>   {/*populate table with boookmarked animes here*/}
      </div>
    </UserSidebar>
  )
}

// export const bookmarkLoader = async (userId) => {
//   // const { user } = UserAuth()
//   // console.log(user)
//   const data = await getBookmarkedAnimes(userId)
//   return data.animes
// }

export default FavouriteAnimes
