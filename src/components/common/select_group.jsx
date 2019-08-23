import React from 'react';

const SelectGroup = ({options, name, label, value, inputHelp, helpMessage, placeHolder, error, onChange}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <br/>
            <select name={name} value={value} onChange={onChange} id={name} className='form-control'>
                {options.map((item, index) => (
                    <option value={item._id} key={'option=' + index}>{item.name}</option>
                ))}
            </select>
            <small id={inputHelp} className={error ? 'red error-message' : 'hidden'}>{helpMessage}
            </small>
        </div>
    );
};

export default SelectGroup;