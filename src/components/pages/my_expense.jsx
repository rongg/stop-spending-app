import React from 'react';
import expenses from '../../services/expenses';
import habits from '../../services/habits';
import axios from 'axios';
import HabitCard from "../habit/habit_card";
import moment from "moment";

class MyExpense extends React.Component {
    state = {
        habit: {
            name: '',
            budget: 0,
            icon: ''
        },
        expense: {
            name: '',
            amount: 0
        }
    };

    componentDidMount() {
        if (this.props.match.params.habitId) {
            axios.all([expenses.getForId(this.props.match.params.id), habits.getForId(this.props.match.params.habitId)])
                .then(axios.spread((expenseRes, habitRes) => {
                    const expense = expenseRes.data;
                    expense.date = moment(expense.date).local();
                    this.setState({
                        habit: habitRes.data,
                        expense
                    })
                }));
        } else {
            expenses.getForId(this.props.match.params.id).then(res => {
                const expense = res.data;
                expense.date = moment(expense.date).local();
                this.setState({
                    expense
                })
            }).catch(err => {
                console.error(err);
            });
        }
    }

    render() {
        const {name: habitName, budget, icon, _id: habitId} = this.state.habit;
        const {name: expenseName, amount} = this.state.expense;
        const expenseId = this.props.match.params.id;
        return <div className="m-auto page">
            <div className="col-sm-12" style={{margin: '0'}}>
                <HabitCard text={habitName || 'No habit for this expense!'} iconUrl={icon || expenses.getDefaultIcon()}
                           link={habitId ? '/habit/' + habitId : '/expense/' + expenseId + '/edit'} iconHeight='56px'
                           height={budget ? '148px' : '124px'} class='col-sm-12'
                           key={habitId ? 'habit-card-' + habitId : 'habit-card-none'} footerText={budget ? '$' + budget + ' / week' : null}/>
            </div>
            <br/>
            <div className='col-sm-12 text-center'>
                <h4 className='text-center'>I spent ${amount} on {expenseName}</h4>
                <a href={habitId ? '/habit/' + habitId + '/expense/' + expenseId + '/edit' : '/expense/' + expenseId + '/edit'}>Edit</a>
            </div>
        </div>
    }
}

export default MyExpense;