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
        start: moment().startOf('week'),
        end: moment().endOf('week'),
        expenses: [],
        habits: [],
        week: [[], [], [], [], [], [], []]    //  [sunday: [], monday: [], ..., saturday: []]
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
        let {start, end, week} = this.state;
        const habitId = this.props.habitId;

        axios.all([expenses.getForHabit(habitId, start, end), habits.getForId(habitId)])
            .then(res => {
                let expenses = res[0].data;
                const habit = res[1].data;
                expenses = expenses.map(expense => {
                    expense.habit = habit;
                    expense.date = moment(expense.date).local().toDate();
                    return expense;
                });

                week = Week.assignExpensesToDays(expenses);

                this.setState({
                    expenses,
                    week
                })
            });
    }

    //  Gets all expenses for user
    getExpenses() {
        let {start, end, week} = this.state;

        axios.all([expenses.get(start, end), habits.get()])
            .then(res => {
                let expenses = res[0].data;
                let habits = res[1].data;
                expenses = expenses.map(expense => {
                    expense.habit = habits.filter(habit => {
                        return habit._id === expense.habitId;
                    })[0];

                    expense.date = moment(expense.date).local().toDate();

                    return expense;
                });

                week = Week.assignExpensesToDays(expenses);

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


    static assignExpensesToDays(expenses) {
        const currWeek = [[], [], [], [], [], []];
        for (let i = 0; i < expenses.length; i++) {
            const mDate = moment(expenses[i].date);
            const dayIndex = mDate.get('day');
            currWeek[dayIndex].push(expenses[i]);
        }
        return currWeek;
    }

    incrementWeek(num) {
        let {start, end} = this.state;
        if (num > 0 && end.isAfter(moment())) return;    // Don't go into the future
        this.setState({
            start: start.add(num, 'week'),
            end: end.add(num, 'week'),
            expenses: [],
            habits: []
        });
        this.getExpenses();
    }

    render() {
        const {week, expenses, start} = this.state;
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
                    <div className="day-title">Sunday <Moment className="day-date" format={'M/D'}>{moment(start).day(0)}</Moment></div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[0])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Monday <Moment className="day-date" format={'M/D'}>{moment(start).day(1)}</Moment></div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[1])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Tuesday <Moment className="day-date" format={'M/D'}>{moment(start).day(2)}</Moment></div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[2])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Wednesday <Moment className="day-date" format={'M/D'}>{moment(start).day(3)}</Moment></div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[3])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Thursday <Moment className="day-date" format={'M/D'}>{moment(start).day(4)}</Moment></div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[4])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Friday <Moment className="day-date" format={'M/D'}>{moment(start).day(5)}</Moment></div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[5])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Saturday <Moment className="day-date" format={'M/D'}>{moment(start).day(6)}</Moment></div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[6])}</div>
                </div>
            </div>
        </div>
    }

    toDailyExpenses(day) {
        if(!day) return [];
        return day.map((expense, index) => (
            <ExpenseCard key={'mon-expense-' + index} expense={expense}
                         link={expense.habitId ? '/habit/' + expense.habitId + '/expense/' + expense._id : '/expense/' + expense._id}
                         icon={expense.habit && expense.habit.icon ? expense.habit.icon : expenses.getDefaultIcon()}
                         height='96px'/>
        ));
    }
}

export default Week;