export const Message = ({label,value,onChange, placeholder}) => {
    return (
        <div className='text-sm w-full'>
          <label className="text-border font-semibold">{label}</label>
          <textarea 
            placeholder={placeholder}
            className='w-full h-40 mt-2 p-6 bg-main border border-border rounded'
            value={value}
            onChange={onChange}
            >
            </textarea>
        </div>
    )
}

export const Select = ({label, options,value, onChange}) => {
    //console.log(options)
    return (
        <>
            <label className="text-border font-semibold">{label}</label>
            <select 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className='w-full mt-2 px-6 py-4 text-text bg-main border border-border rounded'
            >
              {options.map((o, index) => (
                <option key={index} value={o.value}>
                    {o.title}
                </option>
              ))}
            </select>
        </>
    )
}

export const Input = ({label,placeholder,type,onChange,bg}) => {
    return (
        <div className="text-sm w-full">
            <label className="text-border font-semibold">{label}</label>
            <input 
              required type={type} 
              placeholder={placeholder} 
              onChange={onChange}
              className={`w-full text-sm mt-2 p-4 border border-border rounded text-white ${bg ? "bg-main": "bg-dry"
             }`}
            />
        </div>
    )
}

//onChange