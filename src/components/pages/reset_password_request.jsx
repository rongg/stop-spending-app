import React from 'react';
import users from '../../services/users';
import Form from '../common/form';
import Joi from "joi-browser";

class ResetPasswordRequest extends Form{

    constructor(props) {
        super(props);
        this.state = {
            data: {
                email: ''
            },
            errors: {
                email: null
            },
            formHelp: this.state.formHelp
        };

        this.handleCreate = this.handleCreate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    schema = {
        email: Joi.string().min(5).max(50).required().email().label("Email")
    };

    render() {

        return <div className="form">
            <h1>Reset Password</h1>
            <form aria-describedby="formHelp">
                <div className="form-fields">
                    {this.renderInput('email', 'Email', "text", 'email',true)}
                </div>
                {this.renderButton('Submit')}
                <div className={"form-group"}>
                    {this.renderHelp()}
                </div>
            </form>
        </div>
    }

    postForm() {
        const {email} = this.state.data;
        users.requestPasswordReset(email).then(response => {
            console.log(response);
            this.setState({
                errors: {
                    count: 0
                },
                formHelp: 'Success!'
            });
            alert('A link to reset your password was sent to ' + email);
            window.location = '/login';
        }).catch(err => {
            let helpMessage = 'There was a problem with your submission!';
            if (err.response && err.response.status === 400) {
                // Expected errors
                const errorDetails = err.response.data;
                this.setState({
                    errors: {
                        count: errorDetails.length
                    },
                    formHelp: 'Email is invalid or does not exist!'
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

export default ResetPasswordRequest;