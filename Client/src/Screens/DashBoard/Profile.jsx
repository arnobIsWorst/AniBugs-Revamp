import React,{useState} from 'react'
import UserSidebar from './UserSidebar'
import Uploader from '../../Components/Uploader'
import {Input} from '../../Components/Usedinputs'
import Uploader2 from '../../Components/Uploader2'

function Profile() {
  const[firstName, setFirstName] = useState('')
  const[lastName, setLastName] = useState('')
  const[email, setEmail] = useState('')

  const handlefNameChange = (e) => {
    setFirstName(e.target.value)
  }

  const handlelNameChange = (e) => {
    setLastName(e.target.value)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const[input, setInput] = useState()
  const handleInputChange = (e) => {
    setInput(e)
  }

  return (
    <>
      <UserSidebar>
        <div className='flex flex-col gap-6'>
          <h2 className='text-xl font-bold '>Profile</h2>
          <Uploader2 onInputsChange={handleInputChange}/>
          <Input 
            label= "First Name"
            placeholder= "xoxoxoxo"
            type= "text"
            onChange={handlefNameChange}
            bg={true}
          />
          
          <Input 
            label= "Last Name"
            placeholder= "xoxoxoxo"
            type= "text"
            onChange={handlelNameChange}
            bg={true}
          />

          <Input 
            label= "Email"
            placeholder= "email@gmail.com"
            type= "email"
            onChange={handleEmailChange}
            bg={true}
          />
          <div 
            className='flex gap-2 flex-wrap flex-col-reverse sm:flex-row justify-between items-center my-4'>
            <button className='bg-subMain font-medium transitions hover:bg-main border border-subMain text-white py-3 px-6 rounded w-full sm:w-auto'
            >
             Delete Account
            </button>

            <button className='bg-main font-medium transitions hover:bg-subMain border border-subMain text-white py-3 px-6 rounded w-full sm:w-auto'
            onClick={() => console.log(input,firstName,lastName,email)}
            >
             Update Profile
            </button>
          </div>
        </div>
      </UserSidebar>
    </>
  )
}

export default Profile
