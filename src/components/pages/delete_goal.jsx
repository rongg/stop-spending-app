import React from 'react';
import habits from '../../services/habits';
import {Redirect} from "react-router-dom";

class DeleteGoal extends React.Component {
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
        const goalId = this.props.match.params.id;
        const habitId = this.props.match.params.habitId;
        const backNav = '/habit/' + habitId;

        habits.deleteGoal(goalId)
            .then(res => {
                if (res.data.deletedCount === 1) {
                    this.setState({redirectTo: sessionStorage.returnPage || '/'});
                } else {
                    alert('There was a problem with your request!');
                    window.location = backNav;
                }
            })
            .catch(err => {
                alert('There was a problem with your request!');
                window.location = backNav;
            });

    }
}

export default DeleteGoal;