import React, {useState,createContext,useContext} from 'react'

export const AuthContext = createContext({loggedIn: false})

export const AuthContextProvider = ({children}) => {
    const [user,setUser] = useState({})
    //const [loggedIn,setLoggedIn] = useState(false)

  return (
    <AuthContext.Provider value = {{user,setUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export function UserAuth() {
  return useContext(AuthContext)
}
