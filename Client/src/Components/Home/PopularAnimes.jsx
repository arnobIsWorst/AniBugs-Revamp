import React from 'react'
import Titles from '../Titles'
import { BsCollectionFill } from 'react-icons/bs'
import Anime from '../Anime'
import { getAllAnimes } from '../../api'

function PopularAnimes() {
  const [animes, setAnimes] = React.useState([])

  React.useEffect(() => {
    const fetchAnimes = async () => {
      const data = await getAllAnimes()
      setAnimes(data.animes)
    }
    fetchAnimes()
  }, [])

  return (
    <div className='my-16'>
      <Titles title="Popular Animes" Icon = {BsCollectionFill}/>
      <div 
        className='grid sm:mt-12 mt-6 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10'>
        {
          animes.slice(0,8).map((anime, index) => (
            <Anime key={index} anime={anime}/>
          ))
        }
      </div>
    </div>
  )
}

export default PopularAnimes
