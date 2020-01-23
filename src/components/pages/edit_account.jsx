import React from 'react';
import Form from '../common/form';
import users from '../../services/users';

class EditAccount extends Form {
    state = {
        data: EditAccount.prepUser(this.props.user),
        errors: {
            name: null
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
                    {this.renderInput('name', 'Name', "text", "name", true)}
                </div>
                {this.renderButton('Save')}
                <div className={"form-group"}>
                    {this.renderHelp()}
                </div>
            </form>
        </div>

    }

    postForm() {
        users.update(this.state.data)
            .then(() => {
                this.setState({
                    errors: {
                        count: 0
                    },
                    formHelp: 'Success!'
                });
                window.location = '/logout';
            }).catch(err => {
            console.error(err);

        })
    }

}

export default EditAccount;