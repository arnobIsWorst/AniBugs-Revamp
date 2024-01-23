import React from "react"
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom"

//Pages
import Home from "./pages/Home"
//import About from "./pages/About"
import Faq from "./pages/help/Faq"
import Contact, { contactAction } from "./pages/help/Contact"
import Careers, { careersLoader} from "./pages/careers/Careers"
import CareerDetails, { careerDetailsLoader } from "./pages/careers/CareerDetails"
import CareerError from "./pages/careers/CareerError"
import Login from "./pages/Login"
const LazyAbout = React.lazy(() => import("./pages/About"))

//Layouts
import RootLayout from "./layouts/RootLayout"
import HelpLayout from "./layouts/HelpLayout"
import NotFound from "./pages/NotFound"
import CareersLayout from "./layouts/CareersLayout"

//Dependencies
import { AuthProvider } from "./auth"
import { RequireAuth } from "./RequireAuth"
import Profile from "./pages/Profile"


const router = createBrowserRouter(
  createRoutesFromElements(
        <Route path="/" element={<RootLayout/>}>
          <Route index element={<Home />} />
          <Route path="about" element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <LazyAbout />
            </React.Suspense>
          } />
          <Route path="help" element={<HelpLayout/>}>
            <Route path = "faq" element={<Faq/>}/>
            <Route path = "contact" element={<Contact/>} action={contactAction}/>
        </Route>
        
        <Route path="profile" element={
          <RequireAuth>
            <Profile/>
          </RequireAuth>
        }/>
        
        <Route path="careers" element={
            <RequireAuth>
              <CareersLayout />
            </RequireAuth>
          } errorElement={<CareerError/>} >
            <Route 
              index 
              element={<Careers />} 
              loader={careersLoader} 
            />
            <Route 
              path=":id"
              element={<CareerDetails />}
              loader = {careerDetailsLoader}
            />
        </Route>
        <Route path="login" element={<Login/>} />
        <Route path="*" element={<NotFound/>} />
        </Route>
  )
)

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
    
  )
}
export default App