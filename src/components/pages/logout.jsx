import React from 'react';
import auth from '../../services/auth';

class Logout extends React.Component{
    render = () => {
        return null
    };

    componentDidMount() {
        auth.logout();
        window.location = '/login';
    }
}

export default Logout;