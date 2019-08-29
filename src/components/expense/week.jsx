import React from 'react';
import '../../styles/week.css';
import moment from 'moment';
import Moment from 'react-moment';
import ExpenseDateRange from "./expense_date_range";

class Week extends React.Component{


    render() {

        const {smallScreen, expenses, start, end, incrementPeriod, navCallback} = this.props;

        const days = ExpenseDateRange.assignExpensesToDays(expenses, 'day');

        const dateFormat = smallScreen ? 'MMM D' : 'MMM D';

        const leftNav = <button onClick={() => incrementPeriod(-1, 'week')}
                                style={{marginRight: '24px'}}>Prev</button>;
        const rightNav = <button onClick={() => incrementPeriod(1, 'week')}
                                 style={{marginLeft: '24px'}}>Next</button>;
        return <div className={'week-container'}>
            <div className='text-center date-nav'>
                {leftNav}
                <span className="nav-title"><Moment format={dateFormat}>{start}</Moment> - <Moment
                    format={dateFormat}>{end}</Moment></span>
                {rightNav}
            </div>

            <div className='row week-expenses'>
                <div className="col day-column">

                    <button type={'button'} onClick={() => navCallback(moment(start).day(0), 'day')}>
                        <div className="day-title">Sun <br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(0)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[0], smallScreen)}</div>
                    <div className="day-total text-center">${ExpenseDateRange.sumExpenseAmounts(days[0])}</div>
                </div>
                <div className="col day-column">
                    <button type={'button'} onClick={() => navCallback(moment(start).day(1), 'day')}>
                        <div className="day-title">Mon <br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(1)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[1], smallScreen)}</div>
                    <div className="day-total text-center">${ExpenseDateRange.sumExpenseAmounts(days[1])}</div>
                </div>
                <div className="col day-column">
                    <button type={'button'} onClick={() => navCallback(moment(start).day(2), 'day')}>
                        <div className="day-title">Tue <br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(2)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[2], smallScreen)}</div>
                    <div className="day-total text-center">${ExpenseDateRange.sumExpenseAmounts(days[2])}</div>
                </div>
                <div className="col day-column">
                    <button type={'button'} onClick={() => navCallback(moment(start).day(3), 'day')}>
                        <div className="day-title">Wed <br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(3)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[3], smallScreen)}</div>
                    <div className="day-total text-center">${ExpenseDateRange.sumExpenseAmounts(days[3])}</div>
                </div>
                <div className="col day-column">
                    <button type={'button'} onClick={() => navCallback(moment(start).day(4), 'day')}>
                        <div className="day-title">Thu<br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(4)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[4], smallScreen)}</div>
                    <div className="day-total text-center">${ExpenseDateRange.sumExpenseAmounts(days[4])}</div>
                </div>
                <div className="col day-column">
                    <button type={'button'} onClick={() => navCallback(moment(start).day(5), 'day')}>
                        <div className="day-title">Fri <br/> <Moment className="day-date"
                                                                     format={'M/D'}>{moment(start).day(5)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[5], smallScreen)}</div>
                    <div className="day-total text-center">${ExpenseDateRange.sumExpenseAmounts(days[5])}</div>
                </div>
                <div className="col day-column">
                    <button type={'button'} onClick={() => navCallback(moment(start).day(6), 'day')}>
                        <div className="day-title">Sat <br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(6)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[6], smallScreen)}</div>
                    <div className="day-total text-center">${ExpenseDateRange.sumExpenseAmounts(days[6])}</div>
                </div>
            </div>
        </div>
    }

}

export default Week;