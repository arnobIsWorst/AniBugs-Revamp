import React,{useState} from 'react'
import Titles from '../Titles'
import { FaUserFriends } from 'react-icons/fa'
import { Swiper,SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { Link } from 'react-router-dom'

function AnimeCharacters({characters}) {
  //console.log(characters)

  return (
    <div className='my-12 '>
      <Titles title='Characters' Icon={FaUserFriends}/>
      <div className='mt-10'>
        <Swiper 
          autoplay= {{
            delay: 1000,
            disableOnInteraction: false,}} 
          loop={true} 
          speed = {1000}
          modules = {[Autoplay]}
          spaceBetween ={30}
          breakpoints = {{
            0:{
              slidesPerView: 1,
            },
            400:{
              slidesPerView: 2,
            },
            768:{
              slidesPerView: 3,
            },
            1024:{
              slidesPerView: 4,
            },
            1280:{
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}>
          {
            characters?.length > 0 ? (
              characters.map((character,index) => (
              <SwiperSlide key= {index}>
                <div className='w-full p-3 italic text-xs text-text rounded flex-colo bg-dry border border-gray-800'>
                  <Link to = {`/character/${character.id}`} >
                    <img 
                      src={character?.imagelink} 
                      alt={character?.name}
                      className='w-full h-64 object-cover rounded mb-4'  
                      />
                    <p>{character?.name}</p> 
                  </Link>   
                </div>
              </SwiperSlide>
              ))
            ): (
                <h1 className='text-center text-2xl'>No Characters Found</h1>
                )
          }
        </Swiper> 
      </div>
    </div>
  )
}

export default AnimeCharacters
