import React from 'react'
import Banner from '../Components/Home/Banner'
import PopularAnimes from '../Components/Home/PopularAnimes'
import LatestAnimes from '../Components/Home/LatestAnimes'
import Promos from '../Components/Home/Promos'

function HomeScreen() {
  return (
    <div className='container mx-auto min-h-screen px-2 mb-6'>
      <Banner />
      <PopularAnimes />
      <Promos />
      <LatestAnimes />
    </div>
  )
}

export default HomeScreen
