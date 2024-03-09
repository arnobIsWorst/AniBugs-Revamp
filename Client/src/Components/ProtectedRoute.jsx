import React from "react" 
import { Navigate } from "react-router-dom"
import { UserAuth } from "../Context/UserContext"

const ProtectedRoute = ({children}) => {
    const {user} = UserAuth()
    if(user?.email === undefined){
        return <Navigate to='/login'/>
    }
    return children
}

export default ProtectedRoute