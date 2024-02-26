import {Route, RouterProvider, Routes, createBrowserRouter, createRoutesFromElements} from "react-router-dom"
import Navbar from './components/Navbar'
import Home, { genreLoader } from './pages/Home';


const router = createBrowserRouter(
  createRoutesFromElements(
        <Route path='/' element={<Navbar/>}>
          <Route index element={<Home/>} loader={genreLoader}/>
        </Route>
  )
)

function App() {
  //console.log('Hello, World!')
 
  return (
    <RouterProvider router={router}/>
  );
}

export default App


{/* <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element= {<Home/>} loader = {genreLoader}/>
      </Routes>
    </BrowserRouter> */}