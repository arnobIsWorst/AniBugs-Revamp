import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthContextProvider } from './Context/UserContext'
import './index.css'
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "aos"
import "aos/dist/aos.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
)
