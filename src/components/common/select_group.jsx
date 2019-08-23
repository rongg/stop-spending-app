import React from 'react';
import Select from 'react-select'
import Icon from "./Icon";

const SelectGroup = ({options, name, label, value, inputHelp, helpMessage, placeHolder, error, onChange, basicSelect}) => {

    if(!basicSelect) {
        for (let i = 0; i < options.length; i++) {
            const item = options[i];
            item.label = <div><Icon path={item.icon}/><span> {item.name}</span></div>;
            item.value = item._id
        }
    }

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <br/>
            {!basicSelect && <Select className={'img-select'} value={options.filter(i => i.value === value)} onChange={(data, elem) => {
                onChange(name, data._id);
            }} options={options} name={name} />}
            {basicSelect &&
            <select name={name} value={value} onChange={onChange} id={name} className='form-control'>
                {options.map((item, index) => (
                    <option value={item._id} key={'option=' + index}>{item.name}</option>
                ))}
            </select>}
            <small id={inputHelp} className={error ? 'red error-message' : 'hidden'}>{helpMessage}
            </small>
        </div>
    );
};

export default SelectGroup;