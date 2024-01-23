import { Link, useLoaderData } from "react-router-dom"

export default function Careers() {
  const careers = useLoaderData()  //useLoaderData is a hook that resolves the promise & returns the data from the loader

  return (
    <div className="careers">
      {careers.map(career => (
        <Link to={career.id.toString()} key={career.id}>
          <p>{career.title}</p>
          <p>Based in {career.location}</p>
        </Link>
      ))}
    </div>
  )
}

// data loader
export const careersLoader = async () => {
  const res = await fetch('http://localhost:4000/careers') //irl, it will be another api

  if (!res.ok) {
    throw new Error("Could not fetch the data")
  }

  return res.json() //returning a promise
}