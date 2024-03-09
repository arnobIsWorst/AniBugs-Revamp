import React, {useEffect, useState} from 'react'
import {  useLoaderData } from 'react-router-dom'
import { getCharacter } from '../api'
import AnimeCharacters from '../Components/Single/AnimeCharacters'

import Anime from '../Components/Anime'
import Titles from '../Components/Titles'
import { BsCollectionFill } from 'react-icons/bs'
import CharacterInfo from '../Components/Single/CharacterInfo'
import Characterrates from '../Components/Single/Characterrates'

function SingleCharacter() {
    const character = useLoaderData()
    const[characters, setCharacters] = useState([])
    

    // useEffect(() => {
    //     const fetchCharacters = async () => {
    //         const charactersData = await getCharactersOfAnime(anime.id)
    //         setCharacters(charactersData.characters)
    //     }

    //     const fetchRelatedAnimes = async () => {
    //         const relatedAnimesData = await getRelatedAnimes(anime.id)
    //         setRelatedAnimes(relatedAnimesData.animes)
    //     }
    //     fetchCharacters()
    //     fetchRelatedAnimes()
    // },[anime])
    
  return (
    <>
        <CharacterInfo character = {character}/>
        <div className='container  mx-auto min-h-screen px-2 my-6'>
            {/*<AnimeCharacters characters = {characters}/>*/}
            {/*ratings */}
            <Characterrates character = {character}/>
            {/*related */}
           {/* <div className='my-16'>
              <Titles title='Animes you may like' Icon = {BsCollectionFill}/>
                <div className='grid sm:mt-10 mt-6 xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
                 {
                    relatedAnimes.slice(0,5)?.map((anime,index) => (
                        <Anime key={index} anime={anime}/>))
                 }
                </div>
            </div>*/}
        </div>
    </>
  )
}

export const characterLoader = async ({params}) => {
    const {id} = params
    const characterData= await getCharacter(id)
    return characterData.character
}

export default SingleCharacter
