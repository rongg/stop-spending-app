import React from 'react';
import '../../styles/day.css';
import expenses from "../../services/expenses";
import ExpenseCard from "../expense/expense_card";

class Day extends React.Component {

    render() {

        const {expenses} = this.props;

        return <div className={'day-container'}>
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