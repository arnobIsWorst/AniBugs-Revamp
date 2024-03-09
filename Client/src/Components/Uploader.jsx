import React from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUploadCloud } from 'react-icons/fi'

function Uploader() {
    const {getRootProps, getInputProps} = useDropzone({
        multiple: false,
        maxSize: 5000000,
        onDrop: (acceptedFiles) => {
            //alert(acceptedFiles[0].name)
            console.log(acceptedFiles[0])
        }
    })
  return (
    <div className='w-full text-center'>
      <div {...getRootProps()}
        className='px-6 pt-5 py-8 border-2 border-border border-dashed bg-main rounded-md cursor-pointer'
      >
        <input {...getInputProps()} />
        <span className='mx-auto flex-colo text-subMain text-3xl'>
           <FiUploadCloud className='text-5xl mx-auto'/>
        </span>
        <p className='text-sm mt-2'>Drag your image here</p>
        <em className='text-xs text-border'>
            (only .jpg, .jpeg, .png files are allowed and size should be less than 5MB)
        </em>
      </div>
    </div>
  )
}

export default Uploader
