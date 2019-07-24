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
        if (this.props.habitId) this.getExpensesForHabit();
        else this.getExpenses();
    }

    // Get expenses for a user's habit
    getExpensesForHabit() {
        const {start, end, week} = this.state;
        const habitId = this.props.habitId;

        axios.all([expenses.getForHabit(habitId, start, end), habits.getForId(habitId)])
            .then(res => {
                let expenses = res[0].data;
                const habit = res[1].data;
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
        const {week, expenses} = this.state;
        return <div>
            <div className='text-center week-nav'>
                <button onClick={() => this.incrementWeek(-1)} style={{marginRight: '24px'}}>Prev</button>
                <span className="week-title">Week of <Moment format='MMMM Do'>{this.state.start}</Moment></span>
                <button onClick={() => this.incrementWeek(1)} style={{marginLeft: '24px'}}>Next</button>
            </div>
            <div className="text-center spent-summary">
                <h4>${expenses.reduce((acc, curr) => acc + curr.amount, 0)} spent</h4>
                <a href='/expense/new' className='link'>Log an Expense</a>
            </div>
            <br/>
            <div className='row'>
                <div className="col day-column">
                    <div className="day-title">Monday</div>
                    {this.toDailyExpenses(week[0])}
                </div>
                <div className="col day-column">
                    <div className="day-title">Tuesday</div>
                    {this.toDailyExpenses(week[1])}
                </div>
                <div className="col day-column">
                    <div className="day-title">Wednesday</div>
                    {this.toDailyExpenses(week[2])}
                </div>
                <div className="col day-column">
                    <div className="day-title">Thursday</div>
                    {this.toDailyExpenses(week[3])}
                </div>
                <div className="col day-column">
                    <div className="day-title">Friday</div>
                    {this.toDailyExpenses(week[4])}
                </div>
                <div className="col day-column">
                    <div className="day-title">Saturday</div>
                    {this.toDailyExpenses(week[5])}
                </div>
                <div className="col day-column">
                    <div className="day-title">Sunday</div>
                    {this.toDailyExpenses(week[6])}
                </div>
            </div>
        </div>
    }

    toDailyExpenses(day) {
        return day.map((expense, index) => (
            <ExpenseCard key={'mon-expense-' + index} expense={expense}
                         link={expense.habitId ? '/habit/' + expense.habitId + '/expense/' + expense._id : '/expense/' + expense._id}
                         icon={expense.habit && expense.habit.icon ? expense.habit.icon : expenses.getDefaultIcon()}
                         height='96px'/>
        ));
    }
}

export default Week;