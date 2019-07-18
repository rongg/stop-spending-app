import React from 'react';
import users from '../../services/users';

class VerifyAccount extends React.Component{
    render = () => {
        return null
    };

    componentDidMount() {
        const token = this.props.match.params.token;
        console.log('VERIFY THIS', token);
        window.location = '/logout';
        users.verifyAccount(token)
            .then(res => {
                console.log(res);
                alert('Your account has been confirmed!');
                window.location = '/logout';
            })
            .catch(err => {
                console.log(err);
                alert('There was a problem verifying you account!');
                window.location = '/'
            });
    }
}

export default VerifyAccount;