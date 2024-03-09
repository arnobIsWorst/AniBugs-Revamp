import React from 'react'
import { Link } from 'react-router-dom'
import { MdBookmarks } from 'react-icons/md'

function Anime({anime}) {
  return (
    <>
      <div className='border border-border p-1 hover:scale-95 transitions relative rounded overflow-hidden'>
        <Link to={`/anime/${anime?.romaji_title}`} className='w-full'>
          <img src={anime?.imagelink} alt={anime?.romaji_title} className='w-full h-64 object-cover'/>
        </Link>
        <div className='absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-70 text-white px-4 py-3'>
          <h3 className=' truncate'>{anime?.english_title ? anime.english_title : anime?.romaji_title}</h3>
          <button 
          className='h-9 w-9 text-sm flex-colo transitions hover:bg-transparent border-subMain rounded-md bg-subMain text-white'>
            <MdBookmarks />
          </button>
        </div>
      </div>  
    </>
  )
}

export default Anime
