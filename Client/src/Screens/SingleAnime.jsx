import React, {useEffect, useState} from 'react'
import {  useLoaderData } from 'react-router-dom'
import { getAnimeById, getCharactersOfAnime, getRelatedAnimes} from '../api'
import AnimeInfo from '../Components/Single/AnimeInfo'
import AnimeCharacters from '../Components/Single/AnimeCharacters'
import Animerates from '../Components/Single/Animerates'
import Anime from '../Components/Anime'
import Titles from '../Components/Titles'
import { BsCollectionFill } from 'react-icons/bs'

function SingleAnime() {
    const anime = useLoaderData()
    const[characters, setCharacters] = useState([])
    const [relatedAnimes, setRelatedAnimes] = useState([])

    useEffect(() => {
        const fetchCharacters = async () => {
            const charactersData = await getCharactersOfAnime(anime.id)
            setCharacters(charactersData.characters)
        }

        const fetchRelatedAnimes = async () => {
            const relatedAnimesData = await getRelatedAnimes(anime.id)
            setRelatedAnimes(relatedAnimesData.animes)
        }
        fetchCharacters()
        fetchRelatedAnimes()
    },[anime])
    
  return (
    <>
        <AnimeInfo anime = {anime}/>
        <div className='container  mx-auto min-h-screen px-2 my-6'>
            <AnimeCharacters characters = {characters}/>
            {/*ratings */}
            <Animerates anime= {anime}/>
            {/*related */}
            <div className='my-16'>
              <Titles title='Animes you may like' Icon = {BsCollectionFill}/>
                <div className='grid sm:mt-10 mt-6 xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
                 {
                    relatedAnimes.slice(0,5)?.map((anime,index) => (
                        <Anime key={index} anime={anime}/>))
                 }
                </div>
            </div>
        </div>
    </>
  )
}

export const animeLoader = async ({params}) => {
    const {id} = params
    const animeData = await getAnimeById(id)
    return animeData.anime
}

export default SingleAnime
