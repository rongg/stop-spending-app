import React from 'react';
import Form from '../common/form'
import * as userService from '../../services/users';
import auth from '../../services/auth';

class CreateAccountForm extends Form {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                name: '',
                email: '',
                password: ''
            },
            errors: {
                name: null,
                email: null,
                password: null
            },
            formHelp: this.state.formHelp
        };
    }

    schema = userService.schema;

    render() {

        return <div className="form">
            <h1>Register</h1>
            <form aria-describedby="formHelp">
                <div className="form-fields">
                    {this.renderInput('name', 'Name', "text", "name", true)}
                    {this.renderInput('email', 'Email', "text")}
                    {this.renderInput('password', 'Password', "password")}
                </div>
                {this.renderButton('Create')}
                <div className={"form-group"}>
                    {this.renderHelp()}
                </div>
            </form>
        </div>
    }

    postForm() {
        userService.register(this.state.data).then(response => {
            auth.loginWithJwt(response.headers['x-auth-token']);
            this.setState({
                errors: {
                    count: 0
                },
                formHelp: 'Success!'
            });
            window.location = '/summary';
        }).catch(err => {
            let helpMessage = 'There was a problem with creating your account!';
            if (err.response && err.response.status === 400) {
                // Expected errors
                if (err.response.data === 'User already registered.') {
                    this.setState({
                        errors: {
                            count: 1,
                            email: 'An account already exists for this email address.'
                        },
                        formHelp: helpMessage
                    });
                    return;
                }
                const errorDetails = err.response.data.details;
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
                            name: error.path[0] === 'name' ? error.message : null,
                            email: error.path[0] === 'email' ? error.message : null,
                            password: error.path[0] === 'password' ? error.message : null
                        },
                        formHelp: helpMessage
                    })
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

export default CreateAccountForm;