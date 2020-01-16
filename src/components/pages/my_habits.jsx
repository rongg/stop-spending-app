import React from 'react';
import habits from '../../services/habits';
import HabitCard from '../habit/habit_card';
import '../../styles/habit.css';

class MyHabits extends React.Component {
    state = {
        habits: []
    };

    componentDidMount() {
        habits.get().then(res => {
            this.setState({
                habits: res.data
            });
        }).catch(err => {
            console.error(err);
        });
    }


    render() {
        return <div className="m-auto page">
            <div className="text-center">
                <h2>My Spending Habits</h2>
                <a className='link' href='/habit/new'>Create New</a>
            </div>
            <br/>
            <div className='row'>
                {this.state.habits.map((habit, index) => (
                    <div className="col-lg-3 col-md-6 col-sm-12" style={{margin: '15px 0'}} key={'habit-card-' + index}>
                        <HabitCard text={habit.name} budgeted={habit.budget} type={habit.budgetType} iconUrl={habit.icon || habits.getDefaultIcon()} link={'/habit/' + habit._id}
                                   height='164px'/>
                    </div>
                ))}
            </div>
        </div>

    }

}

export default MyHabits;