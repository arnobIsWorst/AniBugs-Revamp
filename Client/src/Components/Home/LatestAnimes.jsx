import React from 'react'
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import Titles from '../Titles'
import { BsBookmarkStarFill, BsCaretLeftFill, BsCaretRightFill } from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { getTopRatedAnimes } from '../../api'
import Rating from '../Stars'


function LatestAnimes() {
  const[animes, setAnimes] = useState([])
  const[nextEl, setNextEl] = useState(null)
  const[prevEl, setPrevEl] = useState(null)  
  const classNames = 
  "hover:bg-dry transitions text-sm rounded w-8 h-8 flex-colo bg-subMain text-white"

  useEffect(() => {
    const fetchLatestAnimes = async () => {
      const data = await getTopRatedAnimes()
      setAnimes(data.animes)
    }
    fetchLatestAnimes()
  },[])
  
  //console.log(animes)

  return (
    <div className='my-16'>
      <Titles title="Top Rated" Icon={BsBookmarkStarFill}/>
      <div className='mt-10'>
        <Swiper navigation = {{nextEl, prevEl}}
                slidesPerView={4}
                spaceBetween={40}
                autoplay={true}
                speed={1000}
                loop={true}
                modules={[Navigation,Autoplay]}
        >
        {
          animes.map((anime,index) => (
            <SwiperSlide key={index}>
              <div className='p-4 h-rate hovered border border-border bg-dry rounded-lg overflow-hidden'>
               <img 
                  src={anime?.imagelink} 
                  alt={anime?.romaji_title} 
                  className='w-full h-full object-cover rounded-lg'
                />
                <div 
                  className='px-4 hovers gap-6 text-center absolute bg-black bg-opacity-70 top-0 left-0 right-0 bottom-0'>
                  <button className='w-12 h-12 flex-colo transitions hover:bg-subMain rounded-full bg-white bg-opacity-30 text-white'>
                    <FaHeart/>
                  </button>
                  <Link 
                    className='font-semibold text-xl trancuted line-clamp-2' 
                    to= {`/anime/${anime?.romaji_title}`}>
                  {anime?.romaji_title}
                  </Link>
                  <div className='flex gap-2 text-star'>
                    <Rating value={anime?.rating}/>
                  </div>
                </div>  
              </div>
            </SwiperSlide>
          ))
        }
        </Swiper>
        <div className='w-full px-1 flex-rows gap-6 pt-12'>
          <button 
             className={classNames} 
             ref={(node) => setPrevEl(node)}
          >
           <BsCaretLeftFill/>
          </button>
          <button 
             className={classNames} 
             ref={(node) => setNextEl(node)}
          >
           <BsCaretRightFill/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LatestAnimes
