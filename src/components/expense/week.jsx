import React from 'react';
import '../../styles/week.css';
import PiggyBank from '../habit/piggy_bank';
import moment from 'moment';
import Moment from 'react-moment';
import ExpenseDateRange from "./expense_date_range";

class Week extends ExpenseDateRange {
    state = {
        start: this.props.start || moment().startOf('week'),
        end: this.props.end || moment().endOf('week'),
        expenses: [],
        habits: []
    };

    render() {
        const {expenses, start, end, smallScreen} = this.state;

        const days = ExpenseDateRange.assignExpensesToDays(expenses, 'day');

        const dateFormat = smallScreen ? 'MMM D' : 'MMMM D';

        const leftNav = <button onClick={() => this.incrementPeriod(-1, 'week')} style={{marginRight: '24px'}}>Prev</button>;
        const rightNav = <button onClick={() => this.incrementPeriod(1, 'week')} style={{marginLeft: '24px'}}>Next</button>;
        return <div>

            <div className="text-center spent-summary">
                <div className="piggy-container">
                    <PiggyBank budget={0} spent={0} width={300} height={200} animate={false}/>
                </div>
                <h4><span className='money'>${expenses.reduce((acc, curr) => acc + curr.amount, 0)}</span> spent {Week.getSpentStatementPredicate(start)}
                </h4>
                <a href={this.props.habitId ? '/habit/' + this.props.habitId + '/expense/new' : '/expense/new'}
                   className='link'>Log an Expense</a>
            </div>
            <br/>
            <div className='text-center week-nav'>
                {leftNav}
                <span className="week-title"><Moment format={dateFormat}>{start}</Moment> - <Moment format={dateFormat}>{end}</Moment></span>
                {rightNav}
            </div>

            <div className='row week-expenses'>
                <div className="col day-column">
                    <div className="day-title">Sun <br/><Moment className="day-date"
                                                                format={'M/D'}>{moment(start).day(0)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(days[0])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(days[0])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Mon <br/><Moment className="day-date"
                                                                format={'M/D'}>{moment(start).day(1)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(days[1])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(days[1])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Tue <br/><Moment className="day-date"
                                                                format={'M/D'}>{moment(start).day(2)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(days[2])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(days[2])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Wed <br/> <Moment className="day-date"
                                                                 format={'M/D'}>{moment(start).day(3)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(days[3])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(days[3])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Thu<br/><Moment className="day-date"
                                                               format={'M/D'}>{moment(start).day(4)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(days[4])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(days[4])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Fri <br/> <Moment className="day-date"
                                                                 format={'M/D'}>{moment(start).day(5)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(days[5])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(days[5])}</div>
                </div>
                <div className="col day-column">
                    <div className="day-title">Sat <br/> <Moment className="day-date"
                                                                 format={'M/D'}>{moment(start).day(6)}</Moment>
                    </div>
                    <div className="day-expense-list">{this.toDailyExpenses(days[6])}</div>
                    <div className="day-total text-center">${Week.toDailyTotal(days[6])}</div>
                </div>
            </div>
        </div>
    }

    static getSpentStatementPredicate(start) {
        if (start.day(0).dayOfYear() === moment().day(0).dayOfYear()) return <span>this week</span>;
        if (start.day(0).dayOfYear() === moment().add(-1, 'week').day(0).dayOfYear()) return <span>last week</span>;
    }

}

export default Week;