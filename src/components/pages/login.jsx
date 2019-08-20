import React from 'react';
import Joi from 'joi-browser';
import Form from '../common/form';
import auth from '../../services/auth';

class LoginForm extends Form {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                email: '',
                password: ''
            },
            errors: {
                email: null,
                password: null
            },
            formHelp: this.state.formHelp
        };

        this.handleCreate = this.handleCreate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    schema = {
        email: Joi.string().min(5).max(50).required().email().label("Email"),
        password: Joi.string().min(5).max(25).required().label("Password")
    };

    render() {

        return <div className="form">
            <h1>Login</h1>
            <form aria-describedby="formHelp">
                <div className="form-fields">
                    {this.renderInput('email', 'Email', "text", 'email',true)}
                    {this.renderInput('password', 'Password', "password")}
                </div>
                {this.renderButton('Login')}
                <div>
                    <a href='/account/reset/password'>Forgot Password?</a>
                </div>
                <div className={"form-group"}>
                    {this.renderHelp()}
                </div>
            </form>
        </div>
    }

    postForm() {
        const {email, password} = this.state.data;
        auth.login(email, password).then(response => {
            auth.loginWithJwt(response.data);
            this.setState({
                errors: {
                    count: 0
                },
                formHelp: 'Success!'
            });
            window.location = '/habits';
        }).catch(err => {
            let helpMessage = 'There was a problem with your submission!';
            if (err.response && err.response.status === 400) {
                // Expected errors
                const errorDetails = err.response.data;
                this.setState({
                    errors: {
                        count: errorDetails.length
                    },
                    formHelp: 'Invalid username or password!'
                });
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

export default LoginForm;