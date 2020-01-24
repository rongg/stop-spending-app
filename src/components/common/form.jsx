import React from 'react';
import Joi from 'joi-browser';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/form.css";
import InputGroup from "../common/input_group";
import SelectGroup from "../common/select_group";
import IconSelect from "../common/icon_select";
import moment from 'moment';
import CurrencyInput from "./currency_input";

class Form extends React.Component {
    state = {
        data: {},
        errors: {},
        formHelp: '* There was a problem with your submission!'
    };

    customErrors = {
        'number.base': '* required',
        'any.empty': '* required'
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

    getRedirectLoc(to) {
        let loc = to;
        if (sessionStorage.returnPage) loc = sessionStorage.returnPage;
        sessionStorage.returnPage = null;

        return loc;
    }

    renderInput(name, label, type, placeholder, autoFocus, className, customErrors) {
        const {data, errors} = this.state;
        return (
            <InputGroup autoFocus={autoFocus} className={className} name={name} label={label} value={data[name]}
                        inputHelp={name + "Help"}
                        helpMessage={errors[name]} placeHolder={placeholder || name} error={errors[name]} type={type}
                        customErrors={customErrors}
                        onChange={this.handleInputChange}/>
        );
    }

    renderSelect(options, name, label, errorMessage, callback) {
        const {data, errors} = this.state;

        return <div><SelectGroup options={options || []} name={name} label={label} value={data[name]}
                                 onChange={(n, v) => this.handleDataChange(n, v, callback)}/>
            <small id={name + 'help'}
                   className={errors[name] ? 'red error-message' : 'hidden'}>{errorMessage || errors[name]}
            </small>
            <br/>
        </div>;
    }

    renderDatePicker(name, label, timeOptions = {}, hideTime) {
        // console.log(timeOptions);
        const {data, errors} = this.state;
        let {minDate, maxDate, minTime, maxTime} = timeOptions;
        if (!minDate) minDate = new Date(-864000000000000);
        if (!maxDate) maxDate = new Date(864000000000000);
        if (!minTime) minTime = moment(minDate).startOf('day').toDate();
        if (!maxTime) maxTime = moment(maxDate).endOf('day').toDate();


        return <div className="form-group">
            <label htmlFor={name}>{label}</label><br/>
            <DatePicker
                showTimeSelect={!hideTime}
                className="form-control"
                minDate={minDate}
                maxDate={maxDate}
                minTime={minTime}
                maxTime={maxTime}
                dateFormat="EE MMM d, yyyy h:mm aa"
                selected={moment(data[name]).toDate()}
                onChange={(data) => this.handleDataChange(name, data)}
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

    renderRadioGroup(name, choices, label, callback) {
        const {data, errors} = this.state;

        let radioGroup;
        if (typeof choices[0] === 'object') {
            radioGroup = <div>{choices.map((item, index) =>
                <div key={'radio-choice-' + index}>
                    <input type='radio' checked={(data[name] === item.value.toString() && 'checked')}
                           name={name} value={item.value}
                           onChange={e => this.handleInputChange(e, callback)}/><span> {item.name}</span>
                </div>
            )}</div>;
        } else {
            radioGroup = <div>{choices.map((item, index) =>
                <div key={'radio-choice-' + index}>
                    <input type='radio' checked={(data[name] === item && 'checked')}
                           name={name} value={item}
                           onChange={e => this.handleInputChange(e, callback)}/><span> {item}</span>
                </div>
            )}</div>;
        }

        return <div className="form-group">
            {label && <label htmlFor={name}>{label}</label>}
            {radioGroup}
            <small id={name + 'help'} className={errors[name] ? 'red error-message' : 'hidden'}>{errors[name]}
            </small>
        </div>
    }

    renderDollarInput(name, label, autofocus) {
        const {data, errors} = this.state;
        return <div className="form-group">
            {label && <label htmlFor={name}>{label}</label>}
            <CurrencyInput name={name} autofocus={autofocus} amount={data[name]} callback={(value) => {
                data[name] = value;
            }}/>
            <small id={name + 'help'} className={errors[name] ? 'red error-message' : 'hidden'}>{errors[name]}
            </small>
        </div>
    }

    renderHelp() {
        return <div>
            <small id={"formHelp"}
                   className={this.state.errors.count ? 'red error-message' : 'gone'}>{this.state.formHelp}</small>
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
            const customError = this.customErrors[e.type];
            if (customError) {
                errors[e.path[0]] = customError;
            } else {
                errors[e.path[0]] = e.message.replace(/"(.*?)"/, "");   //  don't show name of input
            }
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

    handleInputChange(e, callback = () => {
    }) {
        const input = e.currentTarget;
        const formData = {...this.state.data};
        formData[input.name] = input.value;
        this.setState({
            data: formData,
            errors: {...this.state.errors}
        }, () => callback(input.value));
    }

    handleDataChange(name, data, callback = () => {
    }) {
        const formData = this.state.data;
        formData[name] = data;
        this.setState({
            data: formData,
            errors: {...this.state.errors}
        }, () => callback(data))
    }

}

export default Form;