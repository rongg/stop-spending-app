import React from 'react';
import expenses from '../../services/expenses';
import ExpenseCard from '../expense/expense_card';
import moment from 'moment';

class ExpenseDateRange {

    static getScreenWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
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

    static sumExpenseAmounts(expenses) {
        if (!expenses || !expenses.length) return 0;

        return expenses.reduce((acc, curr) => acc + curr.amount, 0);
    }

    static sumWeeklyExpenseAmounts(week) {
        if (!week || !week.length) return 0;

        return week.reduce((acc, curr) => acc + ExpenseDateRange.sumExpenseAmounts(curr.expenses), 0);
    }


    static toDailyExpenses(day, smallScreen) {
        if (!day) return [];
        return day.map((expense, index) => (
            <ExpenseCard key={'mon-expense-' + index} expense={expense}
                         needWant={expense.needWant}
                         link={expense.habitId ? '/habit/' + expense.habitId + '/expense/' + expense._id : '/expense/' + expense._id}
                         icon={expense.habit && expense.habit.icon ? expense.habit.icon : expenses.getDefaultIcon()}
                         height={smallScreen ? '50px' : '80px'} hideName={smallScreen}/>
        ));
    }


    static getSpentStatementPredicate(start, currentNav) {
        if (currentNav === 'week') {
            if (start.day(0).dayOfYear() === moment().day(0).dayOfYear()) return <span>this week</span>;
            if (start.day(0).dayOfYear() === moment().add(-1, 'week').day(0).dayOfYear()) return <span>last week</span>;
        } else if (currentNav === 'month') {
            if (start.month() === moment().month()) return <span>this month</span>;
            if (start.month() === moment().add(-1, 'month').month()) return <span>last month</span>;
        } else if (currentNav === 'day') {
            if (start.isSame(moment(), 'date')) return <span>today</span>;
            if (start.isSame(moment().add(-1, 'day'), 'date')) return <span>yesterday</span>;
        }
    }
}

export default ExpenseDateRange;