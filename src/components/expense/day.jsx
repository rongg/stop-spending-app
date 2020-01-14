import React from 'react';
import '../../styles/day.css';
import expenses from "../../services/expenses";
import ExpenseCard from "../expense/expense_card";
import PiggyBank from "../common/piggy_bank";

class Day extends React.Component {

    render() {

        const {expenses} = this.props;

        return <div className={'day-container'}>
            <div className='row day-expenses'>
                {expenses && expenses.length ? <div className="m-auto col-md-6 col-lg-5 col-12 day-column">
                        <div className="day-expense-list">
                            {this.toDailyExpenses(expenses)}
                        </div>
                    </div> :
                    <div style={{padding: '20px'}} className={'text-center col-sm-12 no-expense'}>
                        <PiggyBank height={48} width={64} icon={'check.svg'}/>
                        <br/>
                        <span>No Expenses for this Day!</span>
                    </div>}
            </div>
        </div>
    }

    toDailyExpenses(day) {
        if (!day) return [];
        const {smallScreen} = this.props;
        return day.map((expense, index) => (
            <ExpenseCard key={'mon-expense-' + index} expense={expense}
                         link={expense.habitId ? '/habit/' + expense.habitId + '/expense/' + expense._id + "/edit" : '/expense/' + expense._id + "/edit"}
                         icon={expense.habit && expense.habit.icon ? expense.habit.icon : expenses.getDefaultIcon()}
                         height={smallScreen ? '50px' : '80px'} hideName={smallScreen} showTime={true}/>
        ));
    }

}

export default Day;