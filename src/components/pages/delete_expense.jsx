import React from 'react';
import expenses from '../../services/expenses';

class DeleteExpense extends React.Component {
    render = () => {
        return null
    };

    componentDidMount() {
        const expenseId = this.props.match.params.id;
        const habitId = this.props.match.params.habitId;
        const backToEdit = '/habit/' + habitId + '/expense/' + expenseId + '/edit';

        expenses.deleteExpense(expenseId)
            .then(res => {
                if (res.data.deletedCount === 1) {
                    habitId !== 'none' ? window.location = '/habit/' + habitId : window.location = '/expenses';
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