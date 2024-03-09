import React from 'react'
import UserSidebar from '../UserSidebar'
import { UserAuth } from '../../../Context/UserContext'
import { getUserReviews } from '../../../api'
import Table4 from '../../../Components/Table4'
import Table5 from '../../../Components/Table5'

function ReviewsOfUser() {
  const{ user } = UserAuth()
  const  id  = user?.id
  const[animeReviews, setAnimeReviews] = React.useState([])
  const[characterReviews, setCharacterReviews] = React.useState([])

  React.useEffect(() => {
    if(id){
      const fetchReviews = async () => {
        try {
          const data = await getUserReviews(id)
          //console.log(data)
          setAnimeReviews(data.animeReviews)
          setCharacterReviews(data.characterReviews)
        }catch (error) {
          console.log(error)
        }
      }
      fetchReviews()  
    }
  },[id])

  console.log(animeReviews)
  console.log(characterReviews)
  return (
    <UserSidebar>
      <div className='flex flex-col gap-6'>
        <div className='flex-btn gap-2'>
         <h2 className='text-xl font-bold'>Reviews</h2>
         <button 
           className='bg-main font-medium transitions hover:bg-subMain border-subMain text-white py-3 px-6 rounded'>
              Clear All
         </button>
        </div>

        <Table4 data={animeReviews} user={user} topic={'Anime'}/>  
        <Table5 data={characterReviews} user={user} topic={'Character'}/>
      </div>
    </UserSidebar>
  )
}

export default ReviewsOfUser
