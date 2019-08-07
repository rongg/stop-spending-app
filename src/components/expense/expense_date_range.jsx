import React from 'react';
import habits from '../../services/habits';
import expenses from '../../services/expenses';
import ExpenseCard from '../expense/expense_card';
import axios from 'axios';
import moment from 'moment';

class ExpenseDateRange extends React.Component {
    state = {
        start: {},
        end: {},
        expenses: [],
        habits: [],
        smallScreen: ExpenseDateRange.getScreenWidth() <= 576
    };

    constructor(props) {
        super(props);
        this.getExpenses = this.getExpenses.bind(this);
        this.getExpensesForHabit = this.getExpensesForHabit.bind(this);
    }

    componentDidMount() {
        if (this.props.habitId) this.getExpensesForHabit();
        else this.getExpenses();

        window.addEventListener("resize", e => {
            const screenWidth = ExpenseDateRange.getScreenWidth();
            this.setState({smallScreen: screenWidth <= 576});
        });
    }

    static getScreenWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

    // Get expenses for a user's habit
    getExpensesForHabit() {
        let {start, end} = this.state;
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

                this.setState({
                    expenses
                })
            });
    }

    //  Gets all expenses for user
    getExpenses() {
        let {start, end} = this.state;

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


                this.setState({
                    expenses,
                    habits
                })
            })
            .catch(err => {
                console.error(err);
            });
    }


    static assignExpensesToDays(expenses, unit) {
        const days = [];
        for (let i = 0; i < expenses.length; i++) {
            const mDate = moment(expenses[i].date);
            const dayIndex = mDate.get(unit);
            if (!days[dayIndex]) days[dayIndex] = [];
            days[dayIndex].push(expenses[i]);
        }
        return days;
    }

    static sumExpenseAmounts(expenses){
        if(!expenses || !expenses.length) return 0;

        return expenses.reduce((acc, curr) => acc + curr.amount, 0);
    }

    static sumWeeklyExpenseAmounts(week){
        if(!week || !week.length) return 0;

        return week.reduce((acc, curr) => acc + ExpenseDateRange.sumExpenseAmounts(curr.expenses), 0);
    }

    incrementPeriod(num, unit) {
        let {start, end} = this.state;
        // if (num > 0 && end.isAfter(moment())) return;    // Don't go into the future
        this.setState({
            start: start.add(num, unit),
            end: end.add(num, unit)
        });
        this.props.habitId ? this.getExpensesForHabit() : this.getExpenses();
    }

    render() {
       return ({});
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
}

export default ExpenseDateRange;