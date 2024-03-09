import React, {useState, useEffect} from 'react'
import Titles from '../Titles'
import { BsBookmarkStarFill } from 'react-icons/bs'
import { Message, Select } from '../Usedinputs'
import { getReviewsOfAnime } from '../../api'
import Rating from '../Stars'

function Animerates({anime}) {
  const Ratings = [
    {
      title:"0 - Poor",
      value:0,
    },
    {
      title:"1 - Bad",
      value:1,
    },
    {
      title:"2 - Not Bad",
      value:2,
    },
    {
      title:"3 - Good",
      value:3,
    },
    {
      title:"4 - Excellent",
      value:4,
    },
    {
      title:"5 - Masterpiece",
      value:5,
    },
  ]

  const [reviews, setReviews] = useState([])
  const [writeReview, setWriteReview] = useState('')
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsOfAnime(anime.id)
        setReviews(data.reviews)
      } catch (error) {
        console.log(error)
      }
    }
    fetchReviews()
  },[reviews.length])

  const [rating, setRating] = useState('')
 // const [rate, setRate] = useState(null)

 const handleRatingChange = (value) => {
  setRating(value)
 }

const handlePrintRating = () => {
  console.log(rating)
  console.log(writeReview)
 }

  return (
    <div className='my-12'>
      <Titles title='Reviews' Icon={BsBookmarkStarFill}/>
      <div className='mt-10 xl:grid flex-colo grid-cols-5 gap-12 bg-dry xs:p-10 py-10 px-2 sm:p-20 rounded'>
        {/* Write reviews */}
        <div className='xl:col-span-2 w-full flex flex-col gap-8'>
          <h3 className='text-xl text-text font-semibold '>Review "{anime?.english_title ? anime.english_title : anime?.romaji_title}"
          </h3>
          <p className='text-sm leading-7 font-medium text-border'>
            Write a review for this anime.
          </p>
          <div className='text-sm w-full'>
            <Select 
                  label='Select Rating' 
                  options={Ratings} 
                  value={rating}
                  onChange={handleRatingChange}
                />
            <div className='flex mt-4 text-lg gap-2 text-star'>
              <Rating value = {rating}/>
            </div>    
          </div>
          {/*message */}
          <Message 
            label = "Message" 
            value = {writeReview}
            onChange = {(e) => setWriteReview(e.target.value)}
            placeholder="Write your review here. Make it short & sweet..."
          />
          {/*submit */}
          <button 
            className='bg-subMain text-white py-3 w-full flex-colo rounded'
            onClick={handlePrintRating}>
            Submit
          </button>
        </div>
        {/*Reviewrs */}
        <div className='col-span-3 flex flex-col gap-6'>
         <h3 className='text-xl text-text font-semibold'> Reviews {reviews.length}</h3>
         <div className='w-full flex flex-col bg-main gap-6 rounded-lg md:p-12 p-6 h-header overflow-y-scroll'>
           {
             reviews.map((review, i) => (
              <div key = {i} className='md:grid flex flex-col w-full grid-cols-12 gap-6 bg-dry p-4 border border-gray-800 rounded-lg'>
                <div className='col-span-2 bg-main hidden md:block'>
                  <img src={review?.avatarlink} 
                       alt={review?.user_name} 
                       className='w-full h-24 rounded-lg object-cover'
                  />
                </div>
                <div className='col-span-7 flex flex-col gap-2'>
                  <h2>{review?.user_name}</h2>
                  <p className='text-xs leading-6 font-medium text-text '>
                    {review?.body}
                  </p>
                </div>
                {/*Rating */}
                <div className='col-span-3 flex-rows border-l border-border text-xs gap-1 text-star'>
                   <Rating value = {review?.rating}/>
                </div>
              </div>
             ))
           }
         </div>
        </div>
      </div>
    </div>
  )
}

export default Animerates
