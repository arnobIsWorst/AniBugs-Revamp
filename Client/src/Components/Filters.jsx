import React from 'react'
import { useState, Fragment } from "react" 
import { Listbox, Transition } from '@headlessui/react'
import { FaAngleDown, FaCheck } from "react-icons/fa"

const YearData = [
    {title:"Sort By Year"},
    {title:"1970-1980"},
    {title:"1980-1990"},
    {title:"1990-2000"},
    {title:"2000-2010"},
    {title:"2010-2020"},
    {title:"2020-2023"},
]

const RatesData = [
    {title:"Sort By Rates"},
    {title:"1 Star"},
    {title:"2 Star"},
    {title:"3 Star"},
    {title:"4 Star"},
    {title:"5 Star"}
]

const SeasonData = [
    {title:"Sort By Release Period"},
    {title:"WINTER"},
    {title:"SPRING"},
    {title:"SUMMER"},
    {title:"FALL"}
]

const NoofSeasons = [
    {title:"Sort By No of Seasons"},
    {title:"1 "},
    {title:"2 "},
    {title:"3 "},
    {title:"4 "},
    {title:"5 "},
    {title:"6 "},
]


function Filters(props) {
    const[genre, setGenre] = useState({title:'Genre'})
    const[year, setYear] = useState(YearData[0])
    const[rates, setRates] = useState(RatesData[0])
    const[season, setSeason] = useState(SeasonData[0])
    const[noofSeasons, setNoofSeasons] = useState(NoofSeasons[0])
    //console.log(props.data)

    const GenreData = props.data.map((item) =>{
      return {title:item.genre}
    })
    //console.log(GenreData)

    const Filter = [
        {
           value:genre,
           onChange:setGenre,
           items: GenreData
        },
        {
           value:year,
           onChange:setYear,
           items: YearData
        },
        {
           value:rates,
           onChange:setRates,
           items: RatesData
        },
        {
            value: season,
            onChange:setSeason,
            items: SeasonData
        },
        {
            value: noofSeasons,
            onChange:setNoofSeasons,
            items: NoofSeasons
        },
      ]   

  return (
    <div 
      className='my-6 bg-dry border text-dryGray border-gray-800 grid md:grid-cols-5 grid-cols-2 lg:gap-12 gap-2 rounded p-6'>
      {
        Filter.map((item, index) => (
          <Listbox key = {index} 
                   value = {item.value} 
                   onChange={item.onChange} > 
            <div className='relative'>
              <Listbox.Button 
                   className = 'relative border border-gray-800 w-full text-white bg-main rounded-lg cursor-default py-4 pl-6 pr-10 text-left text-xs'>
                <span className='block truncate'>{item.value.title}</span>
                <span className='absolute inset-y-0 right-0 flex items-center pointer-events-none pr-2'>
                  <FaAngleDown className="h-4 w-4 " aria-hidden="true" /> 
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" >
                <Listbox.Options 
                   className='absolute z-10 mt-1 w-full bg-white border border-gray-800 text-dryGray rounded-md shadow-lg max-h-60 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                {
                  item.items.map((iterm,i) => (
                    <Listbox.Option key={i} 
                      className = {({active}) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-subMain text-white" :  "text-main "}`} value = {iterm}>
                      {({selected}) => (
                        <>
                          <span className={`block truncated ${
                            selected ? 'font-semibold' : 'font-normal'
                          }`}>
                            {iterm.title}
                          </span>
                          {
                            selected ? (
                              <span className='absolute inset-y-0 left-0 flex-items-center pl-3 '>
                                <FaCheck className="h-5 w-5" aria-hidden="true"/>
                              </span>
                            ) : null
                          }
                        </>
                      )}
                    </Listbox.Option>
                  ))
                }
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        ))
      }
    </div>
  )
}

export default Filters
