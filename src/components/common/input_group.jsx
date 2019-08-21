import React from 'react';

const InputGroup = ({name, label, value, inputHelp, helpMessage, placeHolder, error, onChange, type, autoFocus}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>

            <input autoFocus={autoFocus} value={value} type={type} id={name} aria-describedby={inputHelp}
                   onChange={onChange} className="form-control" name={name} placeholder={placeHolder}/>
            <small id={inputHelp} className={error ? 'red error-message' : 'hidden'}>{helpMessage}
            </small>
        </div>
    );
};

export default InputGroup;