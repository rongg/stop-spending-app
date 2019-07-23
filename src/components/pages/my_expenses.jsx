import React from 'react';
import habits from '../../services/habits';
import expenses from '../../services/expenses';
import ExpenseCard from '../expense/expense_card';
import axios from 'axios';
import moment from 'moment';
import Moment from 'react-moment';

class MyExpenses extends React.Component {
    state = {
        start: moment().startOf('isoWeek'),
        end: moment().endOf('isoWeek'),
        expenses: [],
        habits: []
    };

    constructor(props) {
        super(props);
        this.incrementWeek = this.incrementWeek.bind(this);
        this.getExpenses = this.getExpenses.bind(this);
    }

    componentDidMount() {
        this.getExpenses();
    }


    getExpenses() {
        const {start, end} = this.state;
        axios.all([expenses.get(start, end), habits.get()])
            .then(res => {
                let expenses = res[0].data;
                let habits = res[1].data;
                expenses = expenses.map(expense => {
                    expense.habit = habits.filter(habit => {
                        return habit._id === expense.habitId;
                    })[0];

                    return expense;
                });

                this.setState({
                    expenses,
                    habits
                })
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        return <div className="m-auto page">
            <div className="text-center">
                <h1>My Expenses</h1>
                <a href='/expense/new'>Create New</a>
                <br/><br/>
                <div>
                    <button onClick={() => this.incrementWeek(-1)} style={{marginRight: '24px'}}>Prev</button>
                    Week of <Moment format='MMMM Do'>{this.state.start}</Moment>
                    <button onClick={() => this.incrementWeek(1)} style={{marginLeft: '24px'}}>Next</button>
                </div>
            </div>
            <br/>
            <div className='row'>
                {this.state.expenses.map((expense, index) => (
                    <div className="col-lg-4 col-md-6 col-sm-12" style={{margin: '15px 0'}} key={'habit-card-' + index}>
                        <ExpenseCard expense={expense}
                                     link={expense.habitId ? '/habit/' + expense.habitId + '/expense/' + expense._id : '/expense/' + expense._id}
                                     icon={expense.habit && expense.habit.icon ? expense.habit.icon : expenses.getDefaultIcon()}
                                     height='124px'/>
                    </div>
                ))}
            </div>
        </div>

    }

    incrementWeek(num) {
        const {start, end} = this.state;
        if(num > 0 && end.isAfter(moment())) return;    // Don't go into the future
        this.setState({
            start: start.add(num, 'week'),
            end: end.add(num, 'week'),
            expenses: [],
            habits: []
        });
        this.getExpenses();
    }

}

export default MyExpenses;