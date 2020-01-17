import React from 'react';
import expenses from '../../services/expenses';
import {Redirect} from "react-router-dom";

class DeleteExpense extends React.Component {
    state = {
        redirectTo: false
    };

    render = () => {
        if (this.state.redirectTo) {
            sessionStorage.returnPage = null;
            return <Redirect to={this.state.redirectTo}/>;
        }
        return null;
    };

    componentDidMount() {
        const expenseId = this.props.match.params.id;
        const habitId = this.props.match.params.habitId;
        const backToEdit = '/habit/' + habitId + '/expense/' + expenseId + '/edit';

        expenses.deleteExpense(expenseId)
            .then(res => {
                if (res.data.deletedCount === 1) {
                    this.setState({redirectTo: sessionStorage.returnPage || '/summary'});
                } else {
                    alert('There was a problem with your request!');
                    window.location = backToEdit;
                }
            })
            .catch(err => {
                alert('There was a problem with your request!');
                window.location = backToEdit;
            });

    }
}

export default DeleteExpense;