import React,{useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import backgroundimg from '../assets/bg.png'
import requests from '../Requests'
import axios from 'axios'
import { UserAuth } from '../Context/UserContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {user,setUser} = UserAuth()
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const body = {email, password}
      const res = await axios.post(requests.requestlogin, body)
      setUser(res.data.user)
      //console.log(res.data.user)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (error) {
      console.log(error.response.data.errors[0].msg)
      setError(error.response.data.errors[0].msg)
    }
  }

  return (
    <>
    <div className='w-full h-screen'>
        <img className="hidden sm:block absolute w-full h-full object-cover" src={backgroundimg} alt="/" />
        <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'></div>
        <div className='fixed w-full px-4 py-24 z-50'>
          <div className='max-w-[450px] h-[600px] mx-auto bg-black/75 text-white'>
            <div className='max-w-[320px] mx-auto py-16'>
              <h1 className='text-3xl font-bold'>Sign In</h1>
              <form onSubmit = {handleSubmit} className='w-full flex flex-col py-4'>
                <input
                 onChange={(e) => setEmail(e.target.value)}
                 className='p-3 my-2 bg-gray-700 rounded' type="email" placeholder='Email' autoComplete='email'/>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  className='p-3 my-2 bg-gray-700 rounded' 
                  type="password" 
                  placeholder='Password' 
                  autoComplete='current-password'/>
                <button className='bg-red-600 py-3 my-6 rounded font-bold'>
                  Sign In
                </button>  

                <p className='text-center text-border'>
                  Don't have an acount?{" "} 
                  <Link to="/register" className='text-dryGray font-semibold ml-2'>Sign Up</Link>
                </p>
                <p className='py-8 text-center text-border'>
                  <span className='text-gray-600'>Production House</span>{' '}
                  <Link to='/studiologin' className='text-dryGray font-semibold ml-2'> Click Here</Link>
                </p>
                {error && <p className='p-3 bg-red-400 my-2 font-bold '>{error}</p>}
              </form>
            </div>
          </div>
        </div>
    </div>
   </>
  )
}

export default Login
