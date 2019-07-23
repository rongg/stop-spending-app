import React from 'react';
import habits from '../../services/habits';
import HabitCard from "../habit/habit_card";
import Week from "../expense/week";

class MyHabit extends React.Component {
    state = {
        habit: {
            name: '',
            budget: 0,
        }
    };

    componentDidMount() {
        habits.getForId(this.props.match.params.id)
            .then(res => {
                this.setState({habit: res.data})
            });
    }

    render() {
        const {name, budget, icon, _id} = this.state.habit;
        return <div className="m-auto page">
            <div className="col-sm-12" style={{margin: '0'}}>
                <HabitCard text={name} iconUrl={icon || habits.getDefaultIcon()} link={'/habit/' + _id + '/edit'}
                           iconHeight='56px'
                           height='148px' class='col-sm-12'
                           key={'habit-card-' + _id} footerText={'$' + budget + ' / week'}/>
            </div>
            <br/>
            <div className='col-sm-12 text-center'>
                <a href={'/habit/' + _id + '/expense/new'}>Log an Expense</a>
                <br/>
                <br/>
                <Week habit={this.state.habit}/>
            </div>
        </div>
    }
}

export default MyHabit;