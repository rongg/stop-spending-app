import React from 'react';
import Joi from 'joi-browser';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import InputGroup from "../common/input_group";
import SelectGroup from "../common/select_group";
import moment from 'moment';

class Form extends React.Component {
    state = {
        data: {},
        errors: {},
        formHelp: '* There was a problem with your submission!'
    };

    constructor(props) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    render() {
        return ({});
    }

    renderInput(name, label, type, placeholder, autoFocus) {
        const {data, errors} = this.state;
        return (
            <InputGroup autoFocus={autoFocus} name={name} label={label} value={data[name]} inputHelp={name + "Help"}
                        helpMessage={errors[name]} placeHolder={placeholder || name} error={errors[name]} type={type}
                        onChange={this.handleChange}/>
        );
    }

    renderSelect(options, name, label) {
        const {data} = this.state;

        return <SelectGroup options={options || []} name={name} label={label} value={data[name]}
                            onChange={this.handleChange}/>
    }

    renderDatePicker(name, label) {
        const {data, errors} = this.state;
        return <div className="form-group">
            <label htmlFor={name}>{label}</label><br/>
            <DatePicker
                showTimeSelect
                maxDate={new Date()}
                dateFormat="MMMM d, yyyy h:mm aa"
                selected={moment(data[name]).toDate()}
                onChange={this.handleDateChange}
            />
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

    handleChange({currentTarget: input}) {
        const formData = {...this.state.data};
        formData[input.name] = input.value;
        this.setState({
            data: formData,
            errors: {...this.state.errors}
        });
    }

    handleDateChange(date){
        const formData = this.state.data;
        formData.date = date;
        this.setState({
            data: formData,
            errors: {...this.state.errors}
        })
    }
}

export default Form;