import { useState, useEffect } from 'react'
import {
        createBrowserRouter, 
        createRoutesFromElements, 
        Route, RouterProvider
      } from 'react-router-dom'
import axios from 'axios'
import HomeScreen from './Screens/HomeScreen'
import NotFound from './Screens/NotFound'
import Layout from './Layout/Layout'
import AnimesPage, { genreLoader } from './Screens/Animes'
import SingleAnime, { animeLoader } from './Screens/SingleAnime'
import WatchPage, { watchLoader } from './Screens/WatchPage'
import Login from './Screens/Login'
import Register from './Screens/Register'
import StudioLogin from './Screens/StudioLogin'
import Profile from './Screens/DashBoard/Profile'
import Aos from 'aos'
import Password from './Screens/DashBoard/Password'
import FavouriteAnimes from './Screens/DashBoard/FavouriteAnimes'
import AnimeList from './Screens/DashBoard/Studio/AnimeList'
import Dashboard from './Screens/DashBoard/Studio/Dashboard'
import AddAnime from './Screens/DashBoard/Studio/AddAnime'
import SingleCharacter, { characterLoader } from './Screens/SingleCharacter'
import Sales from './Screens/DashBoard/Studio/Sales'
import Users from './Screens/DashBoard/Studio/Users'
import CreatedForums from './Screens/DashBoard/Users/CreatedForums'
import ReviewsOfUser from './Screens/DashBoard/Users/ReviewsOfUser'
import AddForum from './Screens/DashBoard/Users/AddForum'
import Following from './Screens/DashBoard/Users/Following'
import PurchaseHistory from './Screens/DashBoard/Users/PurchaseHistory'
import Profiles from './Screens/DashBoard/Users/Profiles'
import { UserAuth } from './Context/UserContext'
import ProtectedRoute from './Components/ProtectedRoute'

axios.defaults.withCredentials = true

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route index element={<HomeScreen/>}/>
      <Route 
        path="/animes" 
        element = {<AnimesPage/>}
        loader= {genreLoader}  
      />
      <Route 
        path='/anime/:id' 
        element={<SingleAnime/>}
        loader= {animeLoader}
      />
      <Route
        path='/character/:id'
        element={<SingleCharacter/>}
        loader= {characterLoader}
      />
      <Route 
        path='/watch/:id'
        element={<ProtectedRoute><WatchPage/></ProtectedRoute>}
        loader= {watchLoader}
      />
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/studiologin' element={<StudioLogin/>}/>
      <Route path='/updateprofile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
      <Route path='/password' element={<Password/>}/>
      <Route 
         path='/bookmarks' 
         element={<ProtectedRoute><FavouriteAnimes/></ProtectedRoute>}
      />
      <Route path='/animeslist' element={<AnimeList/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/sales' element = {<Sales/>}/>
      <Route path='/users' element = {<Users/>}/>
      <Route path='/addanime' element = {<AddAnime/>}/>
      <Route path='/myforums' element={<CreatedForums />}/>
      <Route path='/profile' element={<ProtectedRoute><Profiles/></ProtectedRoute>}/>
      <Route path='/reviews' element={<ProtectedRoute><ReviewsOfUser/></ProtectedRoute>}/>
      <Route path='/addforum' element={<ProtectedRoute><AddForum/></ProtectedRoute>}/>
      <Route path='/following' element={<ProtectedRoute><Following/></ProtectedRoute>}/>
      <Route path='/purchasehistory' element={<ProtectedRoute><PurchaseHistory/></ProtectedRoute>}/>
      <Route path='*' element={<NotFound/>}/>
    </Route>  
  )
)

function App() {
  const {user,setUser} = UserAuth()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if(user) {
      setUser(user)
    }
  }, [])
  Aos.init()
  return (
    <RouterProvider router={router}/>
  )
}

export default App
