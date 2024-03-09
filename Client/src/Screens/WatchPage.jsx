import React,{useState} from 'react'
import { useParams, useLoaderData, Link } from 'react-router-dom'
import { getAnimeById } from '../api'
import { BiArrowBack } from 'react-icons/bi'
import { FaCloud, FaHeart, FaPlay } from 'react-icons/fa'
import videoBaba from '../assets/videoRun.mp4'


function WatchPage() {
  
    const anime = useLoaderData()
    const [play,setPlay] = useState(false)
  return (
    <>
      <div className='container mx-auto bg-dry p-6 mb-12'>
        <div className='flex-btn flex-wrap mb-6 gap-2 bg-main rounded border border-gray-800 p-6'>
          <Link 
            to ={`/anime/${anime?.romaji_title}`}
            className="md:text-xl text-sm flex gap-3 items-center font-bold text-dryGray">
                Watch
              <BiArrowBack/> {anime?.english_title ? anime.english_title : anime?.romaji_title}
            </Link>
            <div className='flex-btn sm:w-auto w-full gap-5'>
              <button className='bg-white hover:text-subMain transitions bg-opacity-30 text-white rounded px-4 py-3
              text-sm'>
                <FaHeart/>
              </button>
              <button className='bg-subMain flex-rows gap-2 hover:text-main transitions text-white rounded px-8 font-medium py-3 text-sm'>
                <FaCloud/> Download
              </button>
            </div>
        </div>
        {/*watch video */}
        {
            play? (
                <video controls autoPlay={play} className='w-full h-full rounded'>
                    <source src={videoBaba} type='video/mp4' title={anime?.romaji_title}/>
                </video>
            ) : (
                <div className='w-full h-screen rounded-lg overflow-hidden relative'>
                  <div className='absolute top-0 left-0 bottom-0 right-0 bg-main bg-opacity-30 flex-colo '>
                    <button onClick={() => setPlay(true)} className='bg-white text-subMain flex-colo border border-subMain rounded-full w-20 h-20 font-medium text-xl'>
                        <FaPlay/>
                    </button>
                  </div>
                  <img src = {anime?.bannerlink? anime.bannerlink : anime?.imagelink} 
                       alt = {anime?.romaji_title} 
                       className = 'w-full h-full object-cover rounded-lg'
                  />
                </div>
            )
        }
        
      </div>
      <div className='container mx-auto bg-dry p-6 mb-12'>
        Comment section
      </div>
    </>
  )
}

export const watchLoader = async ({params}) => {
    const {id} = params
    const animeData = await getAnimeById(id)
    return animeData.anime
}

export default WatchPage
