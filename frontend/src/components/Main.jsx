import React, { useState } from 'react'
import axios from 'axios'
import requests from '../Requests'
import { useEffect } from 'react'

function Main() {
    const [animes,setAnimes] = useState([])
    
    const anime =  animes[Math.floor(Math.random() * animes.length)]

    useEffect(() => {
      axios.get(requests.requestAnimes).then((response) => {
           setAnimes(response.data)
      })
    },[])
    
    //console.log(anime)

    const truncateString = (str,num) => {
        if(str?.length > num){
            return str.slice(0,num) + '...'
        }else{
            return str
        }
    }
    
  return (
    <div className='w-full h-[550px] text-white'>
      <div className='w-full h-full'>
        <div className='absolute w-full h-[550px] bg-gradient-to-r from-black'></div>
        <img className = "w-full h-full object-cover" src={anime?.imagelink} alt={anime?.english_title}/>
        <div className='absolute w-full top-[20%] p-4 md:p-8'>
            <h1 className='text-3xl md:text-5xl font-bold'>{anime?.english_title}</h1>
            <div className='my-4'>
                <button className='border bg-gray-300 text-black border-gray-300 py-2 px-5'>Play</button>
                <button className='border text-white border-gray-300 py-2 px-5 ml-4'>Watch Later</button>
            </div>
            <p className='text-gray-400 text-sm'>Start Date: {anime?.start_date.slice(0,10)}</p>
            <p className='w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200'>{truncateString(anime?.description,150)}</p>
        </div>
      </div>
    </div>
  )
}

export default Main
