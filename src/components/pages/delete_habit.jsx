import React from 'react';
import habits from '../../services/habits';

class DeleteHabit extends React.Component {
    render = () => {
        return null
    };

    componentDidMount() {
        const habitId = this.props.match.params.id;
        const backToEdit = '/habit/' + habitId + '/edit';
        habits.deleteById(habitId)
            .then(res => {
                if (res.data.deletedCount === 1) {
                    window.location = '/habits';
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

export default DeleteHabit;