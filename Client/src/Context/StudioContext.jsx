import React,{useState,createContext,useContext, Children} from 'react'

const StudioContext = createContext()

export const StudioContextProvider = ({children}) => {
  const[studio,setStudio] = useState({})
  return (
    <StudioContext.Provider value={{studio,setStudio}}>
      {children}
    </StudioContext.Provider>
  )
}

export function useStudioContext(){
  return useContext(StudioContext)
}
