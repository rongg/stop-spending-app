import React from 'react';
import users from '../../services/users';

class ResendToken extends React.Component{
    render = () => {
        return null
    };

    componentDidMount() {
        const user = this.props.user;
        users.resendVerificationToken(user)
            .then(res => {
                alert('A confirmation email has been sent to ' + user.email);
                window.location = '/account';
            })
            .catch(err => {
                if(err.response.data.msg) alert(err.response.data.msg);
                else alert('There was a problem resending the email.');
                window.location = '/account'
            });
    }
}

export default ResendToken;