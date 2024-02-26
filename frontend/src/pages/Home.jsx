import axios from 'axios'
import React,{useState,useEffect, useId} from 'react'
import Main from '../components/Main'
import Row from '../components/Row'
import requests from '../Requests'
import { useLoaderData } from 'react-router-dom'

function Home() {
  const genres = useLoaderData() 
  console.log(genres)
  //const id = useId()

  return (
    <>
      <Main/>
      {
        genres.map((genre) => (
          <Row rowId={genre.genre} title={genre.genre} fetchURL={requests.requestByGenre+genre.genre}/>
        ))
      }
      
    </>
  )
}

export const genreLoader = async () => {
  const response = await axios.get(requests.requestAllGenres)
  return response.data
}

export default Home

//<Row title='Romance' fetchURL={requests.requestByGenre+'Romance'}/>
