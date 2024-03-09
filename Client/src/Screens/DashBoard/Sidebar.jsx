import React from 'react'
import { NavLink } from 'react-router-dom'
import { BsFillGridFill, BsCurrencyDollar } from 'react-icons/bs'
import { FaListAlt, FaUsers, FaHeart } from 'react-icons/fa'
import { RiLockPasswordLine, RiMovie2Fill } from 'react-icons/ri'
import { HiViewGridAdd } from 'react-icons/hi'
import { FiSettings } from 'react-icons/fi'

function Sidebar({children}) {
    const Sidelinks= [
        {
          name: "Dashboard",
          link: "/dashboard",
          icon: BsFillGridFill,
        },
        {
          name: "Sales",
          link: "/sales",
          icon: BsCurrencyDollar,
        },
        {
          name: "Animes List",
          link: "/animeslist",
          icon:  FaListAlt,
        },
        {
          name: "Add Anime",
          link: "/addanime",
          icon: RiMovie2Fill,  
        },       
        {
            name: "Users",
            link: "/users",
            icon: FaUsers,  
        },
   ]
   
   const active = "bg-dryGray text-subMain"
   const hover = "hover:text-white hover:bg-main"
   const inActive = "rounded font-medium text-sm transitions flex gap-3 items-center p-4"
   const Hover = ({isActive}) => 
     isActive ? `${active} ${inActive}` : `${inActive} ${hover}`; 
   

  return (
    <>
        <div className='min-h-screen container mx-auto px-2'>
            <div className='xl:grid grid-cols-8 gap-10 items-start md:py-12 py-6'>
               <div className='col-span-2 sticky bg-dry border border-gray-800 p-6 rounded-md xl:mb-0 mb-5'>
                {
                    Sidelinks.map((link, index) => (
                        <NavLink to={link.link} key={index} className={Hover}>
                            <link.icon className='text-2xl mr-2'/>
                            <p className='text-lg'>{link.name}</p>
                        </NavLink>
                    ))
                }
               </div>
               <div 
                 data-aos="fade-up"
                 data-aos-duration="1000"
                 data-aos-delay="10"
                 data-aos-offset="200"
                 className='col-span-6 rounded-md bg-dry border border-gray-800 p-6'>
                    {children}
               </div>
            </div>
        </div>
    </>
  )
}

export default Sidebar


/**
 {
           name: "Genres",
           link: "/genres",
           icon: HiViewGridAdd, 
        },
 */

/*
{
            name: "Change Password",
            link: "/password",
            icon: RiLockPasswordLine,
        }
*/

/*
{
            name: "Bookmarks",
            link: "/bookmarks",
            icon: FaHeart,
        },

*/

/*
{
            name: "Update Profile",
            link: "/profile",
            icon: FiSettings,
        },

*/