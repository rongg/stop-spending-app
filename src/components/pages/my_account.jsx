import React from 'react';

class MyAccount extends React.Component {
    state = {
        me: this.props.user
    };


    render() {
        console.log(this.state.me);
        const {name, email, isVerified} = this.state.me;
        return <div className="m-auto page">
            <div className="text-center">
                <h1>My Account</h1>
                <br/>
                <div className="col-sm-6 m-auto text-left">
                    <p><span className='font-weight-bold'> Name:</span> {name}</p>
                    <p><span className='font-weight-bold'> Email:</span> {email}</p>
                    <p><span className='font-weight-bold'> Verified:</span> {isVerified &&
                    <span>yes</span>}{!isVerified && <span>No<br/>
                    <a href={'/user/verify/resend'}>Resend Email</a></span>}</p>
                </div>
                <br/>
                <a href='/account/edit'>Edit</a>
            </div>
            <br/>
        </div>

    }

}

export default MyAccount;