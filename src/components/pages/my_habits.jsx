import React from 'react';
import habits from '../../services/habits';
import HabitCard from '../habit/habit_card';
import '../../styles/my_habits.css';
import Loader from "../common/loader";

class MyHabits extends React.Component {
    state = {
        habits: [],
        loading: false
    };

    componentDidMount() {
        this.setState({loading: true});
        habits.get().then(res => {
            this.setState({
                habits: res.data
            });
        }).catch(err => {
            console.error(err);
        }).finally(() => this.setState({loading: false}));
    }


    render() {
        if(this.state.loading){
            return <div className="m-auto page my-habits container">
                <div className="text-center">
                    <h2>My Spending Habits</h2>
                    <a className='link' href='/habit/new'>Create New</a>
                </div>
                <Loader/>
            </div>
        }
        return <div className="m-auto page my-habits container">
            <div className="text-center">
                <h2>My Spending Habits</h2>
                <a className='link' href='/habit/new'>Create New</a>
            </div>
            <br/>
            <div className='row'>
                {!this.state.habits.length && <h6 className={'m-auto'}>No Habits!</h6>}
                {this.state.habits.map((habit, index) => (
                    <div className="col-lg-3 col-md-6 col-sm-12 card-container" key={'habit-card-' + index}>
                        <HabitCard text={habit.name} budgeted={habit.budget} type={habit.budgetType} iconUrl={habit.icon || habits.getDefaultIcon()} link={'/habit/' + habit._id}
                                   height='164px'/>
                    </div>
                ))}
            </div>
        </div>

    }

}

export default MyHabits;