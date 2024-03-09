import React, {useEffect, useState} from 'react'
import { getAnimeByCharacter } from '../../api';
import { MdForum } from "react-icons/md";
import { Link } from 'react-router-dom';

function CharacterInfo({character}) {
    const [anime, setAnime] = useState(null)
        useEffect(() => {
            const fetchAnime = async () => {
                const animeData = await getAnimeByCharacter(character.id)
                setAnime(animeData[0])
            }
            fetchAnime()
        },[character])

       // console.log(anime)
  return (
    <div className='w-full xl:h-screen relative text-white'>
      <img 
        src={anime?.bannerlink? anime.bannerlink : anime?.imagelink}
        alt={anime?.romaji_title}     
        className='w-full h-hidden xl:inline-block h-full object-cover'
        />
        <div className='xl:bg-main bg-dry flex-colo xl:bg-opacity-90 xl:absolute top-0 left-0 right-0 bottom-0'>
          <div className='container px-3 mx-auto 2xl:px-32 xl:grid grid-cols-3 flex-colo py-10 lg:py-20 gap-8'>
            <div className='xl:col-span-1 w-full xl:order-none order-last h-header bg-dry border border-gray-800 rounded-lg overflow-hidden'>
                <img 
                    src={character?.imagelink} 
                    alt={character?.name} 
                    className='w-full h-full object-cover'
                />
            </div>
            <div className='col-span-2 md:grid grid-cols-5 gap-4 items-center'>
              <div className='col-span-3 flex flex-col gap-10'>
                {/* Title */}
                <h1 className='xl:text-4xl capitalize font-sans text-2xl font-bold'>
                    {character?.name}
                </h1>
                {/* Flex Items */}
                <div className='flex items-center gap-4 font-medium text-dryGray text-2xl'>
                   Description: 
                </div>
                {/* Description */}
                <p className='text-text text-sm leading-7'>
                  {character?.description}
                </p>

                <div className='flex flex-cols-2'>
                   <div className='gap-4 p-2 w-1/3 flex items-center justify-center'>
                     <span className='text-white font-semibold'> Alias: </span>
                   </div>
                   <div className='gap-4 p-2 flex-1 flex items-center justify-start font-semibold'>
                     <Link to={`/anime/${anime?.romaji_title}`}>
                        <span>{anime?.english_title ? anime.english_title : anime?.romaji_title}</span>
                     </Link>
                   </div>
                </div>
              </div>
              <div className='col-span-2 md:mt-0 mt-2 flex justify-end'>
                <button className='md:w-1/4 w-full relative flex-colo bg-subMain hover:bg-transparent border-2 border-subMain transitions md:h-64 h-20 rounded font-medium'>
                  <div className='flex-rows gap-6 text-md uppercase tracking-widest absolute md:rotate-90 '>
                    Forum <MdForum className="w-6 h-6"></MdForum>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default CharacterInfo
