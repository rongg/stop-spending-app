import React from 'react';
import expenses from '../../services/expenses';
import habits from '../../services/habits';
import axios from 'axios';
import HabitCard from "../habit/habit_card";
import ExpenseCard from "../expense/expense_card";

class MyHabit extends React.Component {
    state = {
        habit: {
            name: '',
            budget: 0,
            icon: ''
        },
        expenses: []
    };

    componentDidMount() {
        axios.all([habits.getForId(this.props.match.params.id), expenses.getForHabit(this.props.match.params.id)])
            .then(axios.spread((habitRes, expenseRes) => {
                this.setState({
                    habit: habitRes.data,
                    expenses: expenseRes.data,
                    spent: expenseRes.data.reduce((acc, curr) => {
                        return acc + curr.amount;
                    }, 0)
                })
            }));
    }

    render() {
        const {name, budget, icon, _id} = this.state.habit;
        return <div className="m-auto page">
            <div className="col-sm-12" style={{margin: '0'}}>
                <HabitCard text={name} iconUrl={icon || habits.getDefaultIcon()} link={'/habit/' + _id + '/edit'} iconHeight='56px'
                           height='148px' class='col-sm-12'
                           key={'habit-card-' + _id} footerText={'$' + budget + ' / week'}/>
            </div>
            <br/>
            <div className='col-sm-12 text-center'>
                <h4 className='text-center'>${this.state.spent} Spent</h4>
                <a href={'/habit/' + _id + '/expense/new'}>Log an Expense</a>
                <div className='row' style={{marginTop: '32px'}}>
                    {this.state.expenses.map((expense, index) => (
                        <div className="col-lg-3 col-md-4 col-sm-12" style={{margin: '15px 0'}}
                             key={'expense-card-' + index}>
                            <ExpenseCard expense={expense} link={'/habit/' + _id + '/expense/' + expense._id} height='124px'/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    }
}

export default MyHabit;