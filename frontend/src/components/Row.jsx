import axios from 'axios'
import React, { useState,useEffect } from 'react'
import AnimeCard from './AnimeCard'
import {MdChevronLeft, MdChevronRight} from 'react-icons/md'

function Row({title,fetchURL,rowId}) {

  const [animes,setAnimes] = useState([])
  

  useEffect(() => {
      axios.get(fetchURL).then((response) => {
        setAnimes(response.data)
      })
  },[fetchURL])

  const slideLeft = () => {
    var slider = document.getElementById('slider'+ rowId)
    slider.scrollLeft -= 500
  }

  const slideRight = () => {
    var slider = document.getElementById('slider'+ rowId)
    slider.scrollLeft += 500
  }

  return (
    <>
      <h2 className='text-white font-bold md:text-xl p-4'>{title}</h2>
      <div className='relative flex items-center group'>
      <MdChevronLeft
      onClick={slideLeft} className='bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block' size={40}/>
        <div id={'slider'+ rowId} 
          className='w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative'>
          {animes.map((item,id) =>  (
             <AnimeCard key= {id} item={item}/>
          ))}
        </div>
      <MdChevronRight
      onClick={slideRight} className='bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block' size={40}/>
      </div>
    </>
  )
}

export default Row