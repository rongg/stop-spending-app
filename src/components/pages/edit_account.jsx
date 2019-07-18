import React from 'react';
import Form from '../common/form';
import users from '../../services/users';

class EditAccount extends Form {
    state = {
        data: EditAccount.prepUser(this.props.user),
        errors: {
            name: null
            // email: null,
            // password: null
        },
        formHelp: this.state.formHelp
    };

    static prepUser(user) {
        delete user.iat;
        user.password = 'unchanged';

        return user;
    }

    schema = users.schema;

    render() {
        return <div className="form">
            <h1>Edit Account</h1>
            <form aria-describedby="formHelp">
                <div className="form-fields">
                    {this.renderInput('name', 'Name', "text", "name",true)}
                    {/*{this.renderInput('email', 'Email', "text")}*/}
                    {/*{this.renderInput('password', 'Password', "password")}*/}
                </div>
                {this.renderButton('Save')}
                <div className={"form-group"}>
                    {this.renderHelp()}
                </div>
            </form>
        </div>

    }

    postForm(){
        console.log('PUT', this.state.data);

        users.update(this.state.data)
            .then(res => {
                console.log(res);
            }).catch(err => {
                console.error(err);
        })
    }

}

export default EditAccount;