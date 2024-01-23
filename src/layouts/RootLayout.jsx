import { NavLink,Outlet } from "react-router-dom"
import { useAuth } from "../auth"
import BreadCrumbs from "../components/BreadCrumbs"

export default function RootLayout() {
  const auth = useAuth()
  return (
    <div className='root-layout'>
       <header>
        <nav>
         <h1>AniBugs</h1>
         <NavLink to="/">Home</NavLink>
         <NavLink to="about">About</NavLink>
         <NavLink to="help">Rate</NavLink>
         <NavLink to="profile">Profile</NavLink>
         <NavLink to="careers">Cart</NavLink>
         {
          !auth.user && (
            <NavLink to="login">Login</NavLink>
          )
         } 
        </nav>
        <BreadCrumbs/>
       </header>

       <main>
        <Outlet/>
       </main>
    </div>
  )
}
