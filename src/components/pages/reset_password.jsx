import React from 'react';
import users from '../../services/users';
import Form from '../common/form';
import Joi from "joi-browser";

class ResetPassword extends Form{

    constructor(props) {
        super(props);
        this.state = {
            data: {
                password: '',
                password2: ''
            },
            errors: {
                password: null,
                password2: null
            },
            formHelp: this.state.formHelp
        };

        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    schema = {
        password: Joi.string().min(5).max(25).required().label("Password"),
        password2: Joi.string().min(5).max(25).required().label("Password2")
    };

    render() {

        return <div className="form">
            <h1>Reset Your Password</h1>
            <form aria-describedby="formHelp">
                <div className="form-fields">
                    {this.renderInput('password', 'New Password', "password", 'password',true)}
                    {this.renderInput('password2', 'Confirm', "password", 're-enter password',false)}
                </div>
                {this.renderButton('Submit')}
                <div className={"form-group"}>
                    {this.renderHelp()}
                </div>
            </form>
        </div>
    }

    postForm() {
        const {password, password2} = this.state.data;
        if(password !== password2){
            this.setState({
                errors: {
                    count: 1,
                    password2: 'Passwords do not match!'
                },
                formHelp: 'There was a problem with your submission.'
            });
            return;
        }
        const userId = this.props.match.params.id;
        users.resetPassword(userId, password, this.props.match.params.token).then(response => {
            this.setState({
                errors: {
                    count: 0
                },
                formHelp: 'Success!'
            });
            alert('Your password has been reset! Please log in.');
            window.location = '/logout';
        }).catch(err => {
            let helpMessage = 'There was a problem with your submission!';
            if (err.response && err.response.status === 400) {
                // Expected errors
                const errorDetails = err.response.data.details;
                if(errorDetails) {
                    const error = errorDetails[0];
                    let errorType = error.type.split('.');
                    if (errorType[0] === "passwordComplexity") {
                        this.setState({
                            errors: {
                                count: errorDetails.length,
                                password: 'Passwords are case-sensitive, be at least 5 characters in length, and must contain at least one lowercase letter and one number.'
                            },
                            formHelp: helpMessage
                        })
                    } else {
                        this.setState({
                            errors: {
                                count: errorDetails.length,
                                password: error.path[0] === 'password' ? error.message : null
                            },
                            formHelp: helpMessage
                        })
                    }
                }else{
                    //  issue with token
                    if(err.response.data.result && err.response.data.result === 'not-verified'){
                        alert('You\'re password has either been reset already or the link has expired!');
                        window.location = '/login';
                    }
                }
            } else {
                helpMessage = 'An unexpected problem occurred when submitting the request!';
                this.setState({
                    errors: {
                        count: 1
                    },
                    formHelp: helpMessage
                })

            }
        });

    }
}

export default ResetPassword;