import React from 'react';
import '../../styles/week.css';
import habits from '../../services/habits';
import expenses from '../../services/expenses';
import ExpenseCard from '../expense/expense_card';
import axios from 'axios';
import moment from 'moment';
import Moment from 'react-moment';

class Week extends React.Component {
    state = {
        start: moment().startOf('isoWeek'),
        end: moment().endOf('isoWeek'),
        habit: this.props.habit,
        expenses: [],
        habits: [],
        week: [[], [], [], [], [], [], []]    //  [monday: [], tuesday: [], ..., sunday: []]
    };

    constructor(props) {
        super(props);
        this.incrementWeek = this.incrementWeek.bind(this);
        this.getExpenses = this.getExpenses.bind(this);
        this.getExpensesForHabit = this.getExpensesForHabit.bind(this);
    }

    componentDidMount() {
        if (this.state.habit) this.getExpensesForHabit();
        else this.getExpenses();
    }

    // Get expenses for a user's habit
    getExpensesForHabit() {
        const {start, end, week, habit} = this.state;

        expenses.getForHabit(habit._id, start, end)
            .then(res => {
                let expenses = res.data;
                expenses = expenses.map(expense => {
                    expense.habit = habit;
                    return expense;
                });

                Week.assignExpensesToDays(expenses, week);

                this.setState({
                    expenses,
                    week
                })
            });
    }

    //  Gets all expenses for user
    getExpenses() {
        const {start, end, week} = this.state;

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

                Week.assignExpensesToDays(expenses, week);

                this.setState({
                    expenses,
                    habits,
                    week
                })
            })
            .catch(err => {
                console.error(err);
            });
    }


    static assignExpensesToDays(expenses, week) {
        for (let i = 0; i < expenses.length; i++) {
            let mDate = moment(expenses[i].date);
            week[mDate.get('day') - 1].push(expenses[i]);   //  - 1 is for converting back from iso day value
        }

        console.log(week);
    }

    incrementWeek(num) {
        const {start, end} = this.state;
        if (num > 0 && end.isAfter(moment())) return;    // Don't go into the future
        this.setState({
            start: start.add(num, 'week'),
            end: end.add(num, 'week'),
            expenses: [],
            habits: [],
            week: [[], [], [], [], [], [], []]
        });
        this.getExpenses();
    }

    render() {
        const {week} = this.state;

        return <div>
            <div className='text-center'>
                <button onClick={() => this.incrementWeek(-1)} style={{marginRight: '24px'}}>Prev</button>
                Week of <Moment format='MMMM Do'>{this.state.start}</Moment>
                <button onClick={() => this.incrementWeek(1)} style={{marginLeft: '24px'}}>Next</button>
            </div>
            <div className='row'>
                <div className="col day-column">
                    <div className="day-title">Monday</div>
                    {week[0].map((expense, index) => (
                        <ExpenseCard key={'mon-expense-' + index} expense={expense}
                                     link={expense.habitId ? '/habit/' + expense.habitId + '/expense/' + expense._id : '/expense/' + expense._id}
                                     icon={expense.habit && expense.habit.icon ? expense.habit.icon : expenses.getDefaultIcon()}
                                     height='124px'/>
                    ))}
                </div>
                <div className="col day-column">
                    <div className="day-title">Tuesday</div>
                    {week[1].map((expense, index) => (
                        <ExpenseCard key={'mon-expense-' + index} expense={expense}
                                     link={expense.habitId ? '/habit/' + expense.habitId + '/expense/' + expense._id : '/expense/' + expense._id}
                                     icon={expense.habit && expense.habit.icon ? expense.habit.icon : expenses.getDefaultIcon()}
                                     height='124px'/>
                    ))}
                </div>
                <div className="col day-column">
                    <div className="day-title">Wednesday</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Thursday</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Friday</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Saturday</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Sunday</div>
                </div>
                {/*{this.state.expenses.map((expense, index) => (*/}
                {/*<div className="col-lg-4 col-md-6 col-sm-12" style={{margin: '15px 0'}} key={'habit-card-' + index}>*/}
                {/*<ExpenseCard expense={expense}*/}
                {/*link={expense.habitId ? '/habit/' + expense.habitId + '/expense/' + expense._id : '/expense/' + expense._id}*/}
                {/*icon={expense.habit && expense.habit.icon ? expense.habit.icon : expenses.getDefaultIcon()}*/}
                {/*height='124px'/>*/}
                {/*</div>*/}
                {/*))}*/}
            </div>
        </div>
    }
}

export default Week;