import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { FiUploadCloud } from 'react-icons/fi'
import { ImageConfig } from './ImageConfig'
import './Uploader2.css'

const Uploader2 = props => {

    const wrapperRef = useRef(null);

    const [fileList, setFileList] = useState([]);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            const updatedList = [...fileList, newFile];
            setFileList(updatedList);
            //props.onFileChange(updatedList);
            props.onInputsChange(updatedList);
        }
    }

    const fileRemove = (file) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
        //props.onFileChange(updatedList);
        props.onInputsChange(updatedList);
    }

  return (
    <>
        <div
            ref={wrapperRef}
            className="drop-file-input"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className="drop-file-input__label">
              <span 
                className='mx-auto flex-colo text-subMain text-3xl'>
                <FiUploadCloud className='text-5xl mx-auto'/>
              </span>  
                <p>Drag & Drop your files here</p>
            </div>
            <input type="file" value="" onChange={onFileDrop} className='object-contain'/>
        </div>
        {
            fileList.length > 0 ? (
                <div className="drop-file-preview">
                    <p className="drop-file-preview__title">
                        Ready to upload
                    </p>
                    {
                        fileList.map((item, index) => (
                            <div key={index} className="drop-file-preview__item">
                                <img src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} alt="" />
                                <div className="drop-file-preview__item__info">
                                    <p>{item.name}</p>
                                    <p>{item.size}B</p>
                                </div>
                                <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>x</span>
                            </div>
                        ))
                    }
                </div>
            ) : null
        }
    </>
  )
}

// Uploader2.propTypes = {
//     onFileChange: PropTypes.func
// }

Uploader2.propTypes = {
    onInputsChange: PropTypes.func,
}

export default Uploader2
