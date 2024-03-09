import React from 'react'
import {useState} from 'react'
import Filters from '../Components/Filters'
import { getAllGenres , getAllAnimes} from '../api'
import { useLoaderData } from 'react-router-dom'
import Anime from '../Components/Anime'
import { CgSpinner } from 'react-icons/cg'

function AnimesPage() {
    const allAnimes = useLoaderData().animes
    const allGenres = useLoaderData().genres
    //console.log(allGenres)
    //console.log(allAnimes)

   const maxPerPage = 15
   const [page,setPage] = useState(maxPerPage)

   const HandleLoadMore = () => {
      setPage(page + maxPerPage)
   }

  return (
    <div className='min-height-screen container mx-auto px-2 my-6'>
      <Filters data={allGenres}/>
      <p className='text-lg font-medium my-6'>
        Total <span className="font-bold text-subMain">{allAnimes.length}</span> Animes Found 
      </p>
      <div className='grid sm:mt-10 mt-6 xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
       {
        allAnimes.slice(0,page)?.map((anime,index) => (
          <Anime key={index} anime={anime}/>
        ))
       }
      </div>
     {/*Loading More */}
      <div className='w-full flex-colo md:my-20 my-10'>
        <button onClick={HandleLoadMore} className='flex-rows gap-3 text-white py-3 px-8 rounded font-semibold border-2 border-subMain'>
          Loading More <CgSpinner className="animate spin"/>
        </button>
      </div>  
    </div>
  )
}

export const genreLoader = async () => {
    const genredata = await getAllGenres()
    const animeData = await getAllAnimes()
    return {animes: animeData.animes , genres:genredata.genres}
}

export default AnimesPage
