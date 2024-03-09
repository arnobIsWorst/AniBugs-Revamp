import React from 'react'
import { FaCloudDownloadAlt, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { GoEye } from 'react-icons/go'

const Head = 'text-xs text-left text-dryGray font-semibold px-6 py-2 uppercase'
const Text = 'text-sm text-left leading-6 whitespace-nowrap px-5 py-3'

//rows
const Rows = (obj,i,user,topic) => {
    return (
        <tr key={i} className='bg-main'>
            <td className={`${Text}`}>
                {topic}
            </td>
            <td className={`${Text}`}>
                <div className='w-12 p-1 bg-dry border border-border h-12 rounded overflow-hidden'>
                    <img 
                        className='h-ull w-full object-cover' 
                        src={obj?.imagelink} 
                        alt={obj?.name}
                    />
                </div>
            </td>
            <td className={`${Text} truncate`}>
                {obj?.name}
            </td>
            <td className={`${Text}`}>
                {obj?.rating}
            </td>
            <td className={`${Text}`}>
                {obj?.body}
            </td>
            <td className={`${Text}`}>
                {obj?.date_posted}
            </td>
            <td className={`${Text} float-right flex-rows gap-2`}>
                {
                    user ? (
                      <>
                        <button 
                            className='border border-border bg-dry flex-rows gap-2 text-border rounded py-1 px-2'
                        >
                            Edit <FaEdit className='text-green-500'/>
                        </button>
                        <button 
                            className='bg-subMain text-white rounded flex-colo w-6 h-6'
                        >
                            Delete <MdDelete />
                        </button>
                      </>
                    ) : (
                       <>
                         <button 
                            className='border border-border bg-dry flex-rows gap-2 text-border rounded py-1 px-2'
                          >
                            Edit <FaCloudDownloadAlt className='text-green-500'/>
                         </button>
                         <Link to={`/anime/${obj?.romaji_title}`} className='bg-subMain text-white rounded flex-colo w-6 h-6'>
                            <GoEye/>
                         </Link>
                       </>
                    )
                }
            </td>
        </tr>
    ) 
}


//table
function Table4({data,user}) {
  return (
    <div 
      className='overflow-x-scroll overflow-hidden relative w-full'
     >
      <table className='w-full table-auto border border-border divide-y divide-border '
      >
        <thead>
            <tr className='bg-main'>
                <th scope='col' className={`${Head}`}>
                    Topic
                </th>
                <th scope='col' className={`${Head}`}>
                    Logo
                </th>    
                <th scope='col' className={`${Head}`}>
                    Name
                </th>
                <th scope='col' className={`${Head}`}>
                    Rating
                </th>
                <th scope='col' className={`${Head}`}>
                    Review
                </th>
                <th scope='col' className={`${Head}`}>
                    Date Posted
                </th>
                <th scope='col' className={`${Head} text-end`}>
                    Actions
                </th>
            </tr>
        </thead>
        <tbody className='bg-main divide-y divide-gray-800'>
           {data.map((character,i) => Rows(character,i,user,'Character'))}
        </tbody>
      </table>
    </div>
  )
}

export default Table4
