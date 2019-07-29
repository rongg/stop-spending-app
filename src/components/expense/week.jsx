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
        week: [[], [], [], [], [], [], []],    //  [sunday: [], monday: [], ..., saturday: []]
        smallScreen: this.getScreenWidth() <= 576
    };

    constructor(props) {
        super(props);
        this.incrementWeek = this.incrementWeek.bind(this);
        this.getExpenses = this.getExpenses.bind(this);
        this.getExpensesForHabit = this.getExpensesForHabit.bind(this);
        this.getScreenWidth = this.getScreenWidth.bind(this);
    }

    componentDidMount() {
        if (this.props.habitId) this.getExpensesForHabit();
        else this.getExpenses();

        window.addEventListener("resize", e => {
            const screenWidth = this.getScreenWidth();
            this.setState({smallScreen: screenWidth <= 576});
        });
    }

    getScreenWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
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
            if (!currWeek[dayIndex]) currWeek[dayIndex] = [];
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
        const {week, expenses, start, smallScreen} = this.state;

        const leftNav = <button onClick={() => this.incrementWeek(-1)} style={{marginRight: '24px'}}>Prev</button>;
        const rightNav = <button onClick={() => this.incrementWeek(1)} style={{marginLeft: '24px'}}>Next</button>;
        return <div>
            <div className='text-center week-nav'>
                {leftNav}
                <span className="week-title">Week of <Moment format='MMMM Do'>{this.state.start}</Moment></span>
                {rightNav}
            </div>
            <div className="text-center spent-summary">
                <h4>${expenses.reduce((acc, curr) => acc + curr.amount, 0)} spent</h4>
                {smallScreen && leftNav}<a href='/expense/new' className='link'>Log an
                Expense</a>{smallScreen && rightNav}
            </div>
            <br/>
            <div className='row week-expenses'>
                <div className="col day-column">
                    <div className="day-title">Sun <br/><Moment className="day-date"
                                                           format={'M/D'}>{moment(start).day(0)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[0])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(week[0])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Mon <br/><Moment className="day-date"
                                                           format={'M/D'}>{moment(start).day(1)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[1])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(week[1])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Tue <br/><Moment className="day-date"
                                                           format={'M/D'}>{moment(start).day(2)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[2])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(week[2])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Wed <br/> <Moment className="day-date"
                                                           format={'M/D'}>{moment(start).day(3)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[3])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(week[3])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Thu<br/><Moment className="day-date"
                                                           format={'M/D'}>{moment(start).day(4)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[4])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(week[4])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Fri <br/> <Moment className="day-date"
                                                           format={'M/D'}>{moment(start).day(5)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[5])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(week[5])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Sat <br/> <Moment className="day-date"
                                                           format={'M/D'}>{moment(start).day(6)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(week[6])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(week[6])}</div>
                </div>
            </div>
        </div>
    }

    toDailyExpenses(day) {
        if (!day) return [];
        return day.map((expense, index) => (
            <ExpenseCard key={'mon-expense-' + index} expense={expense}
                         link={expense.habitId ? '/habit/' + expense.habitId + '/expense/' + expense._id : '/expense/' + expense._id}
                         icon={expense.habit && expense.habit.icon ? expense.habit.icon : expenses.getDefaultIcon()}
                         height={this.state.smallScreen ? '50px' : '80px'} hideName={this.state.smallScreen}/>
        ));
    }

    static toDailyTotal(day) {
        if (!day) return 0;
        return day.reduce((acc, curr) => acc + curr.amount, 0);
    }
}

export default Week;