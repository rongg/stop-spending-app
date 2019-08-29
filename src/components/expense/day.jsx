import React from 'react';
import '../../styles/day.css';
import Moment from 'react-moment';
import expenses from "../../services/expenses";
import ExpenseCard from "../expense/expense_card";

class Day extends React.Component {

    render() {

        const {expenses, start, incrementPeriod, smallScreen} = this.props;

        const dateFormat = smallScreen ? 'ddd MMM D' : 'dddd, MMMM Do';

        const leftNav = <button onClick={() => incrementPeriod(-1, 'day')} style={{marginRight: '24px'}}>Prev</button>;
        const rightNav = <button onClick={() => incrementPeriod(1, 'day')} style={{marginLeft: '24px'}}>Next</button>;
        return <div className={'day-container'}>

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

    toDailyExpenses(day) {
        if (!day) return [];
        const {smallScreen} = this.props;
        return day.map((expense, index) => (
            <ExpenseCard key={'mon-expense-' + index} expense={expense}
                         link={expense.habitId ? '/habit/' + expense.habitId + '/expense/' + expense._id : '/expense/' + expense._id}
                         icon={expense.habit && expense.habit.icon ? expense.habit.icon : expenses.getDefaultIcon()}
                         height={smallScreen ? '50px' : '80px'} hideName={smallScreen} showTime={true}/>
        ));
    }

}

export default Day;