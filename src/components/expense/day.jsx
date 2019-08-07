import React from 'react';
import '../../styles/day.css';
import PiggyBank from '../habit/piggy_bank';
import moment from 'moment';
import Moment from 'react-moment';
import ExpenseDateRange from "./expense_date_range";
import expenses from "../../services/expenses";
import ExpenseCard from "../expense/expense_card";

class Day extends ExpenseDateRange {
    state = {
        start: this.props.start || moment().startOf('day'),
        end: this.props.end || moment().endOf('day'),
        expenses: [],
        habits: [],
        smallScreen: ExpenseDateRange.getScreenWidth() <= 576
    };

    render() {
        const {expenses, start, smallScreen} = this.state;

        const {width: pWidth, height: pHeight} = this.piggyParams;

        const dateFormat = smallScreen ? 'ddd MMM D' : 'dddd, MMMM Do';

        const leftNav = <button onClick={() => this.incrementPeriod(-1, 'day')} style={{marginRight: '24px'}}>Prev</button>;
        const rightNav = <button onClick={() => this.incrementPeriod(1, 'day')} style={{marginLeft: '24px'}}>Next</button>;
        return <div className={'day-container'}>

            <div className="text-center spent-summary">
                <div className="piggy-container">
                    <PiggyBank budget={0} spent={0} width={pWidth} height={pHeight} animate={false}/>
                </div>
                <h4><span className='money'>${Day.sumExpenseAmounts(expenses)}</span> spent {Day.getSpentStatementPredicate(start)}
                </h4>
                <a href={this.props.habitId ? '/habit/' + this.props.habitId + '/expense/new' : '/expense/new'}
                   className='link'>Log an Expense</a>
            </div>
            <br/>
            <div className='text-center day-nav'>
                {leftNav}
                <span className="nav-title"><Moment format={dateFormat}>{start}</Moment></span>
                {rightNav}
            </div>

            <div className='row day-expenses'>
                <div className="m-auto col-md-6 col-lg-5 col-12 day-column">
                    <div className="day-expense-list">{this.toDailyExpenses(expenses)}</div>
                </div>
            </div>
        </div>
    }

    static getSpentStatementPredicate(start) {
        if (start.isSame(moment(), 'date')) return <span>today</span>;
        if (start.isSame(moment().add(-1, 'day'), 'date')) return <span>yesterday</span>;
    }

    toDailyExpenses(day) {
        if (!day) return [];
        return day.map((expense, index) => (
            <ExpenseCard key={'mon-expense-' + index} expense={expense}
                         link={expense.habitId ? '/habit/' + expense.habitId + '/expense/' + expense._id : '/expense/' + expense._id}
                         icon={expense.habit && expense.habit.icon ? expense.habit.icon : expenses.getDefaultIcon()}
                         height={this.state.smallScreen ? '50px' : '80px'} hideName={this.state.smallScreen} showTime={true}/>
        ));
    }

}

export default Day;