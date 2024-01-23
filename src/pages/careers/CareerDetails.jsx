import { useParams,useLoaderData } from "react-router-dom";

export default function CareerDetails() {
  const {id} = useParams()
  const career = useLoaderData()
  return (
    <div className="career-details">
      <h2>Career Details for {career.title}</h2>
      <p>Staring Salary : {career.salary}</p>
      <p>Location : {career.location}</p>
      <div className="details">
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta sed sunt ipsam quam assumenda quasi ipsa facilis laborum rerum voluptatem!</p>
      </div>
    </div>
  )
}

//loader function
export const careerDetailsLoader = async ({params}) => {
  const {id} = params
  const res = await fetch(`http://localhost:4000/careers/${params.id}`)
  if (!res.ok) {
    throw new Error("Something went wrong")
  }
  const data = await res.json()
  return data
}
