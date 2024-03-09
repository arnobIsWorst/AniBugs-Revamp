import React from 'react'
import { useEffect } from 'react' 
import { getGenresOfAnime } from '../api'
import  {FaRegCalendarAlt}  from 'react-icons/fa'
import { GiDuration } from "react-icons/gi"

function FlexAnimeItems({anime}) {
    const [genres, setGenres] = React.useState([])
    useEffect(() => {
        const fetchGenres = async () => {
            const data = await getGenresOfAnime(anime.id)
            setGenres(data.genres)
        }

        fetchGenres()
    },[])

    //console.log(genres)
  return (
    <>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium'>{
            genres.map((genre, index) => (
                <span key={index}> {genre.genre}
                {index < genres.length-1 ? <span> ,</span> : <span></span>}</span>
            ))
        }</span>
      </div>  
      <div className='flex items-center gap-2'>
        <FaRegCalendarAlt className='text-subMain w-3 h-3'/>
        <span className='text-sm font-medium'>{
            `${anime?.start_date.substring(0,4)} - ${anime?.end_date.substring(0,4)}`
        }</span>
      </div>  

      <div className='flex items-center gap-2'>
        <GiDuration className='text-subMain w-3 h-3'/>
        <span className='text-sm font-medium'>{`${anime?.duration}mins`}</span>
      </div> 
    </>
  )
}

export default FlexAnimeItems
