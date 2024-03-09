import React,{useState} from 'react'
import backgroundimg  from '../assets/bg.png'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [gender, setGender] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // try {
    //   const body = {firstname, lastname, email, gender, password}
    //   console.log(body)
    //   const response = await axios.post(requests.requestregister, body)
    //   console.log(response.data.message)
    //   navigate('/login')
    // } catch (error) {
    //     console.log(error)
    // }
  }


  return (
    <>
    <div className='w-full h-screen'>
        <img className="hidden sm:block absolute w-full h-full object-cover" src={backgroundimg} alt="/" />
        <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'></div>
        <div className='fixed w-full px-4 py-24 z-50'>
          <div className='max-w-[450px] h-[640px] mx-auto bg-black/75 text-white'>
            <div className='max-w-[320px] mx-auto py-16'>
              <h1 className='text-3xl font-bold'>Sign Up</h1>
              <form onSubmit = {handleSubmit} className='w-full flex flex-col py-4'>
                <input 
                 onChange = {(e) => setFirstname(e.target.value)}
                 className='p-3 my-2 bg-gray-700 rounded' type="firstname" placeholder='First Name' autoComplete='firstname'/>
                <input 
                 onChange = {(e) => setLastname(e.target.value)}
                 className='p-3 my-2 bg-gray-700 rounded' type="lastname" placeholder='Last Name' autoComplete='lastname'/> 
                <input
                 onChange={(e) => setEmail(e.target.value)}
                 className='p-3 my-2 bg-gray-700 rounded' type="email" placeholder='Email' autoComplete='email'/>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  className='p-3 my-2 bg-gray-700 rounded' 
                  type="password" 
                  placeholder='Password' 
                  autoComplete='current-password'/>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className='p-3 my-2 bg-gray-700 rounded text-gray-400'>
                    <option>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                </select>

                <button className='bg-red-600 py-3 my-6 rounded font-bold'>Sign Up</button>  
                <p className='py-3'><span className='text-gray-600'>Already Signed in?</span>{' '}
                <Link to='/login'> Click Here</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
    </div>
   </>
  )
}

export default Register
