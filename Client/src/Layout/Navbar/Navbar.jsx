import React, {useState} from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logoImage from '../../assets/anibugs-logo.png'
import { FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa'
import { CgUser } from 'react-icons/cg'
import { MdLogin } from "react-icons/md"
import requests from '../../Requests'
import { UserAuth } from '../../Context/UserContext'
import axios from 'axios'
import { FiLogOut } from 'react-icons/fi'
import { searchAnime } from '../../api'

function Navbar() {
    const{user,setUser} = UserAuth()
    const hover = "hover:text-subMain transitions text-white"
    const Hover = ({isActive}) => (isActive ? 'text-subMain' : hover)
    const [searchItem, setSearchItem] = useState('')
    const navigate = useNavigate()
    const[results,setResults] = useState([])

    const handleChange = async (e) => {
      //e.preventDefault()
      //console.log(searchItem)
      setSearchItem(e.target.value)
      const foundAnimes = await searchAnime(searchItem)
      //console.log(foundAnimes)
      setResults(foundAnimes)
    }

    const isEmptyObject = (obj) => {
      return Object.keys(obj).length === 0;
    }

    const handleLogout = async () => {
       try {
          const response = await axios.get(requests.requestlogout)
          console.log(response.data.message)
          setUser({})
          localStorage.removeItem('user')
          navigate('/')
       } catch (error) {
          console.log(error)
       }
    }

    const handleBar = (e) => {
      e.preventDefault()
      setSearchItem('')
      setResults([])
    }

  return (
    <>
      <div className='bg-main shadow-md sticky top-0 z-20'>
        <div className='container mx-auto py-6 px-2 lg:grid gap-10 grid-cols-7 justify-between items-center'>
          {/* Logo */}
          <div className='col-span-1 lg:block hidden'>
            <Link to ='/'>
                <img src={logoImage} 
                     alt='logo' 
                     className='w-full h-12 object-contain'
                />
            </Link>
          </div>
          {/* Search form */}
          <div className='col-span-3'>
             <form className='w-full text-sm bg-dryGray rounded flex-btn gap-4' onSubmit={handleChange}>
               <button type ="submit" className='bg-subMain w-12 flex-colo h-12 rounded text-white'
               >
                <FaSearch/>
               </button>
               <input type='text' 
                      placeholder='Search Anime...' 
                      className='font-medium placeholder:text-border text-sm
                      w-11/12 h-12 bg-transparent border- none px-2 text-black'
                      value={searchItem}
                      onChange={(e) => handleChange(e)}
                />
             </form>
          </div>
          {/* Menus */}
          <div className='col-span-3 font-medium text-sm hidden xl:gap-14 2xl:gap-20 justify-between lg:flex xl:justify-end items-center'>
            <NavLink to='/animes' className={Hover}>
                Animes
            </NavLink>
          {!isEmptyObject(user) ? 
            <NavLink to='/bookmarks' className={`${Hover} relative`}>
              <FaHeart className='w-6 h-6'/> 
              <div className="w-5 h-5 flex-colo rounded-full text-xs bg-subMain 
                text-white absolute -top-5 -right-1">2
              </div>
            </NavLink>
            :
            <NavLink to='/dashboard' className={`${Hover} relative`}>
              <FaHeart className='w-6 h-6'/> 
              <div className="w-5 h-5 flex-colo rounded-full text-xs bg-subMain 
                text-white absolute -top-5 -right-1">2
              </div>
            </NavLink>
          }
          {
            !isEmptyObject(user) ? 
            <NavLink to='/profile' className={Hover}>
              <img src={user?.avatarlink} alt={user?.email} className='w-8 h-8 rounded-full '/>
            </NavLink>
            :
            <NavLink to='/login' className={Hover}>
                <CgUser className='w-8 h-8'/>
            </NavLink>
          }
            {
                !isEmptyObject(user) ? 
                <button onClick={handleLogout} className={Hover}>
                    <FiLogOut className='w-8 h-8'/>
                </button>
                :
                <NavLink to='/login' className={Hover}>
                    <MdLogin className='w-8 h-8'/>
                </NavLink>
            }
            
          </div>
         
            <div className='container'>
            {
                results.length > 0 && searchItem.length > 0 ? (
                  <div className='box absolute flex flex-col justify-center w-full max-w-2xl align-items-center translate-x-1/3 max-h-[300px] text-main bg-dryGray text-center p-2 overflow-y-scroll'>
                  {
                      results.slice(0,50).map((result,index) => (
                        <div key={index} className='flex gap-2 items-center hover:bg-gray-400' onClick={(e) => handleBar(e)}>
                          <Link to={`/anime/${result.romaji_title}`} className='flex gap-2 items-center'>
                            <img src={result.imagelink} alt={result.romaji_title} className='w-12 h-12'/>
                            <p className='text-sm'>{result.romaji_title}</p>
                          </Link>
                        </div>
                      ))
                  }
                  </div>
                ) : null
            }
            </div>
        </div>
      </div>
    </>
  )
}

export default Navbar


/*

<NavLink to='/login' className={Hover}>
                <CgUser className='w-8 h-8'/>
            </NavLink>
 */

            //<CgUser className='w-8 h-8'/>

           // col-span-3 w-100% bg-dryGray flex flex-col shadow-md border-r-10 mt-1rem max-h-50 overflow-y-scroll rounded-md

           



            // <NavLink to='/profile' className={Hover}>
                
            //     <img src={user?.avatarlink} alt={user?.email} className='w-8 h-8 rounded-full '/>
            // </NavLink>



            /* 
               <div className='bg-main shadow-md sticky top-0 z-20'>
        <div className='container mx-auto py-6 px-2 lg:grid gap-10 grid-cols-7 justify-between items-center'>
          <div className='col-span-1 lg:block hidden'>
          a
          </div>
          <div className='col-span-3'>B</div>
          <div className='col-span-3'>C</div>
          
        </div>
        
      </div>            
            
            */