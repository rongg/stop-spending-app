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

    static calculateBudgets(budgetType, budget, startDate) {
        let budgetDay, budgetMonth, budgetWeek;
        if (budgetType === 'week') {
            budgetDay = budget / 7;
            if (!budgetDay) budgetDay = 1;
            budgetMonth = Math.round(budgetDay * startDate.daysInMonth());
            budgetWeek = Math.round(budget);
            budgetDay = Math.round(budgetDay);
        }
        if (budgetType === 'month') {
            budgetDay = budget / startDate.daysInMonth();
            if (!budgetDay) budgetDay = 1;
            budgetWeek = Math.round(budgetDay * 7);
            budgetMonth = Math.round(budget);
            budgetDay = Math.round(budgetDay);
            if (!budgetDay) budgetDay = 1;
        }
        if (budgetType === 'day') {
            budgetWeek = Math.round(budget * 7);
            budgetMonth = Math.round(budget * startDate.daysInMonth());
            budgetDay = Math.round(budget);
        }

        return {
            day: budgetDay, week: budgetWeek, month: budgetMonth
        };
    }

    static calculatePace(spent, budget) {
        let spentBudgetRatio = spent / budget;
        let pace = {icon: 'app_icons/traffic_green.svg', message: 'On Pace!'};

        if (spentBudgetRatio >= 1.0) {
            pace = {icon: 'app_icons/traffic_red.svg', message: 'Stop Spending!'}
        } else if (spentBudgetRatio > .5) {
            pace = {icon: 'app_icons/traffic_yellow.svg', message: 'Slow Down'};
        }
        return pace;
    }

    static getAverages(expenses, startDate, currentNav) {
        let daysDivisor = startDate.isSame(moment(), 'week') ? moment().day() + 1 : 7;
        let dateMultiplier = 7;
        if (currentNav === 'month') {
            daysDivisor = startDate.isSame(moment(), 'month') ? moment().date() : startDate.daysInMonth();
            dateMultiplier = startDate.daysInMonth();
        }
        if (currentNav === 'day') {
            daysDivisor = 1;
            dateMultiplier = 1;
        }

        const averages = {expense: 0, daily: 0, projected: 0};
        if (expenses.length) {
            const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
            averages.expense = Math.round(totalSpent / expenses.length);  //  Used in day view
            const dailyAverage = totalSpent / daysDivisor;
            averages.daily = Math.round(dailyAverage);
            averages.projected = Math.round(dailyAverage * dateMultiplier);
        }

        return averages;
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

    static splitExpenses(expenses) {
        if (!expenses || !expenses.length) return {week: 0, month: 0, day: 0};
        return {
            week: expenses.filter(e => moment(e.date).isSame(moment().add(-1, 'week'), 'week')),
            month: expenses.filter(e => moment(e.date).isSame(moment().add(-1, 'month'), 'month')),
            day: expenses.filter(e => moment(e.date).isSame(moment().add(-1, 'day'), 'day'))
        };
    }
}

export default ExpenseDateRange;