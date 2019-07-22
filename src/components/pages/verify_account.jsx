import React from 'react';
import users from '../../services/users';

class VerifyAccount extends React.Component{
    render = () => {
        return null
    };

    componentDidMount() {
        const token = this.props.match.params.token;
        users.verifyAccount(token)
            .then(res => {
                alert('Your account has been confirmed! Please log in.');
                window.location = '/logout';
            })
            .catch(err => {
                if(err.response.data.msg) alert(`You're account has either already been verified or the link has expired!`);
                else alert('There was a problem verifying this account!');
                window.location = '/'
            });
    }
}

export default VerifyAccount;