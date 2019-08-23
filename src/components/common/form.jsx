import React from 'react';
import Joi from 'joi-browser';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/form.css";
import InputGroup from "../common/input_group";
import SelectGroup from "../common/select_group";
import IconSelect from "../common/icon_select";
import moment from 'moment';
import DollarInput from "./dollar_input";

class Form extends React.Component {
    state = {
        data: {},
        errors: {},
        formHelp: '* There was a problem with your submission!'
    };

    constructor(props) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
    }

    render() {
        return ({});
    }

    renderInput(name, label, type, placeholder, autoFocus) {
        const {data, errors} = this.state;
        return (
            <InputGroup autoFocus={autoFocus} name={name} label={label} value={data[name]} inputHelp={name + "Help"}
                        helpMessage={errors[name]} placeHolder={placeholder || name} error={errors[name]} type={type}
                        onChange={this.handleInputChange}/>
        );
    }

    renderSelect(options, name, label) {
        const {data} = this.state;

        return <SelectGroup options={options || []} name={name} label={label} value={data[name]}
                            onChange={this.handleDataChange} />
    }

    renderDatePicker(name, label) {
        const {data, errors} = this.state;
        return <div className="form-group">
            <label htmlFor={name}>{label}</label><br/>
            <DatePicker
                showTimeSelect
                className="form-control"
                maxDate={new Date()}
                dateFormat="EE MMM d, yyyy h:mm aa"
                selected={moment(data[name]).toDate()}
                onChange={(data) => this.handleDataChange('date', data)}
            />
            <small id={name + 'help'} className={errors[name] ? 'red error-message' : 'hidden'}>{errors[name]}
            </small>
        </div>
    }

    renderIconSelect(name, label) {
        const {data, errors} = this.state;
        return <div className="form-group">
            <label htmlFor={name}>{label}</label><br/>
            <IconSelect selected={data[name]} onChange={this.handleDataChange}/>
            <small id={name + 'help'} className={errors[name] ? 'red error-message' : 'hidden'}>{errors[name]}
            </small>
        </div>
    }

    renderRadioGroup(name, choices, label) {
        const {data, errors} = this.state;

        return <div className="form-group">
            {label && <label htmlFor={name}>{label}</label>}
            {choices.map((item, index) =>
                <div key={'radio-choice-' + index}>
                    <input type='radio' checked={(data[name] === item && 'checked')}
                           name={name} value={item} onChange={this.handleInputChange}/><span> {item}</span>
                </div>
            )}
            <small id={name + 'help'} className={errors[name] ? 'red error-message' : 'hidden'}>{errors[name]}
            </small>
        </div>
    }

    renderDollarInput(name, label, autofocus){
        const {data, errors} = this.state;
        return <div className="form-group">
            {label && <label htmlFor={name}>{label}</label>}
            <DollarInput name={name} value={data[name]} onChange={this.handleInputChange} autoFocus={autofocus} />
            <small id={name + 'help'} className={errors[name] ? 'red error-message' : 'hidden'}>{errors[name]}
            </small>
        </div>
    }

    renderHelp() {
        return <div>
            <small id={"formHelp"}
                   className={this.state.errors.count ? 'red error-message' : 'hidden'}>{this.state.formHelp}</small>
            <small id={"formHelp"}
                   className={!this.state.errors.count && this.state.formHelp === 'Success!' ? 'green success' : 'gone'}>{this.state.formHelp}</small>
        </div>
    }

    renderButton(label) {
        return <button className="btn btn-primary" onClick={this.handleCreate}>{label}</button>
    }

    validate() {
        const res = Joi.validate(this.state.data, this.schema, {abortEarly: false});
        if (!res.error) return null;
        const errors = {};

        console.error('Errors while validating', res.error);
        for (let e of res.error.details) {
            if (errors[e.path[0]]) continue;
            errors[e.path[0]] = e.message;
        }

        errors.count = res.error.details.length;
        return errors;
    }

    handleCreate(e) {
        e.preventDefault();
        let errors = this.validate();
        this.setState({
            errors: errors || {}
        });
        if (errors) return;

        this.postForm();
    }

    handleInputChange({currentTarget: input}) {
        const formData = {...this.state.data};
        formData[input.name] = input.value;
        this.setState({
            data: formData,
            errors: {...this.state.errors}
        });
    }

    handleDataChange(name, data) {
        const formData = this.state.data;
        formData[name] = data;
        this.setState({
            data: formData,
            errors: {...this.state.errors}
        })
    }

}

export default Form;