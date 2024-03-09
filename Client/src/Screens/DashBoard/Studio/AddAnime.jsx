import React,{useState} from 'react'
import Sidebar from '../Sidebar'
import { Input, Message } from '../../../Components/Usedinputs'
import Uploader from '../../../Components/Uploader'
import Uploader2 from '../../../Components/Uploader2'
import { ImUpload } from 'react-icons/im'
import Select from 'react-select'

const options = [
  { value: 'romance', label: 'Romance' },
  { value: 'action', label: 'Action' },
  { value: 'sci-fi', label: 'Sci-fi' },
  { value: 'shounen', label: 'Shounen' },
  { value: 'shoujo', label: 'Shoujo' },
  { value: 'horror', label: 'Horror' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'slice of life', label: 'Slice of Life' },
  { value: 'psychological', label: 'Psychological' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'superpower', label: 'Superpower' },
  { value: 'magic', label: 'Magic' },
  { value: 'sports', label: 'Sports' },
  { value: 'mecha', label: 'Mecha' },
  { value: 'historical', label: 'Historical' },
  { value: 'military', label: 'Military' },
  { value: 'music', label: 'Music' },
  { value: 'parody', label: 'Parody' },
  { value: 'game', label: 'Game' },
  { value: 'harem', label: 'Harem' },
]

function AddAnime() {
  const [selectedOption, setSelectedOption] = useState([])
  const handleChange = (e) => {
    setSelectedOption(e)
  }

  // const onFileChange = (files) => {
  //   console.log(files);
  // }

  const [inputs, setInputs] = useState([])
  const [inputs2, setInputs2] = useState([])

  const handleInputsChange = (e) => {
    setInputs(e)
  }

  const handleInputsChange2 = (e) => {
    setInputs2(e)
  }


  return (
    <Sidebar>
       <div className='flex flex-col gap-6'>
          <h2 className='text-xl font-bold '>Create Anime</h2>
          <div className='w-full grid md:grid-cols-2 gap-6'>
            <Input 
                label= "Anime Title"
                placeholder= "Type Anime Title"
                type= "text"
                bg={true}
            />
            <Input 
                label= "Duration"
                placeholder= "24 mins"
                type= "text"
                bg={true}
            />
          </div>

          <div className='w-full grid md:grid-cols-2 gap-6'>
            <Input 
                label= "Start Date"
                placeholder= "Type Start Date"
                type= "text"
                bg={true}
            />
            <Input 
                label= "End Date"
                placeholder= "Type End Date"
                type= "text"
                bg={true}
            />
          </div>

          <div className='w-full grid md:grid-cols-2 gap-6'>
            <Input 
                label= "Episodes"
                placeholder= "Type Episode Count"
                type= "text"
                bg={true}
            />
            <Input 
                label= "Season Premiered"
                placeholder= "SPRING"
                type= "text"
                bg={true}
            />
          </div>
          {/*images*/}

          <div className='w-full grid md:grid-cols-2 gap-6'>
            {/*image Banner*/}
            <div className='flex flex-col gap-2'>
              <p className='text-border font-semibold text-sm'>
                Image For Banner
              </p>
              <div className='px-6 pt-5 py-8 border-2 border-border border-dashed bg-main rounded-md cursor-pointer item-center'>
                <Uploader2 onInputsChange = {handleInputsChange}/>
              </div>
            </div>
            {/*image Poster*/}
            <div className='flex flex-col gap-2'>
              <p className='text-border font-semibold text-sm'>
                Image For Poster
              </p>
              <div className='px-6 pt-5 py-8 border-2 border-border border-dashed bg-main rounded-md cursor-pointer item-center'>
                <Uploader2 onInputsChange = {handleInputsChange2}/>
              </div>
            </div>
          </div> 
          {/*Description*/}
          <Message label= "Description" placeholder= "Type Description" />

          {/*Genre*/}
          <div className='text-md w-full text-main text-bold'>        
              <Select 
                options={options}
                value={selectedOption}
                onChange={handleChange}
                isMulti={true}
              />
          </div>
          {/*Anime videos make a separate page section for it*/}
          
          {/*Anime characters*/}
          <div className='w-full grid lg:grid-cols-2 gap-6 items-start'>
            <button className='w-full py-4 bg-main border border-subMain border-dashed text-white rounded'>
               Add Characters
            </button>
            <div>

            </div>
          </div>
          {/* submit */}
            <button className='bg-subMain w-full flex-rows gap-6 font-medium transitions hover:bg-dry border border-subMain text-white py-4 rounded'
            onClick={() => console.log(inputs2, inputs)}
            >
            <ImUpload/>  Publish Anime
            </button>
        </div> 
    </Sidebar>
  )
}

export default AddAnime


//onFileChange={(files) => onFileChange(files)}