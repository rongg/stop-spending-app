import React from 'react';
import '../../styles/week.css';
import moment from 'moment';
import Moment from 'react-moment';
import ExpenseDateRange from "./expense_date_range";

class Week extends React.Component {


    render() {

        const {smallScreen, expenses, start, navCallback} = this.props;
        // const filters = this.props.filters || {};

        const days = ExpenseDateRange.assignExpensesToDays(expenses, 'day');

        //  Average expense amount per day
        const daysInWeek  = start.isSame(moment(), 'week') ? moment().day() + 1 : 7;
        const sumExpenseAmounts = ExpenseDateRange.sumExpenseAmounts(expenses);
        const avg = Math.round(sumExpenseAmounts / daysInWeek);


        for (let i = 0; i < days.length; i++) {
            const exp = days[i];
            if(days[i]) {
                days[i].totalSpent = exp ? ExpenseDateRange.sumExpenseAmounts(exp) : 0;
                days[i].splurge = days[i].totalSpent > 10 && days[i].totalSpent >= avg * 2;
            }
        }

        return <div className={'week-container'}>

            <div className='row week-expenses col-sm-12'>
                <div className={`col day-column ${(days[0] && days[0].splurge) && 'splurge'}`}>
                    <button type={'button'} onClick={() => navCallback(moment(start).day(0), 'day')}>
                        <div className="day-title">Sun <br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(0)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[0], smallScreen)}</div>
                    <div className="day-total text-center">${(days[0] && days[0].totalSpent) || 0}</div>
                </div>
                <div className={`col day-column ${(days[1] && days[1].splurge) && 'splurge'}`}>
                    <button type={'button'} onClick={() => navCallback(moment(start).day(1), 'day')}>
                        <div className="day-title">Mon <br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(1)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[1], smallScreen)}</div>
                    <div className="day-total text-center">${(days[1] && days[1].totalSpent) || 0}</div>
                </div>
                <div className={`col day-column ${(days[2] && days[2].splurge) && 'splurge'}`}>
                    <button type={'button'} onClick={() => navCallback(moment(start).day(2), 'day')}>
                        <div className="day-title">Tue <br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(2)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[2], smallScreen)}</div>
                    <div className="day-total text-center">${(days[2] && days[2].totalSpent) || 0}</div>
                </div>
                <div className={`col day-column ${(days[3] && days[3].splurge) && 'splurge'}`}>
                    <button type={'button'} onClick={() => navCallback(moment(start).day(3), 'day')}>
                        <div className="day-title">Wed <br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(3)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[3], smallScreen)}</div>
                    <div className="day-total text-center">${(days[3] && days[3].totalSpent) || 0}</div>
                </div>
                <div className={`col day-column ${(days[4] && days[4].splurge) && 'splurge'}`}>
                    <button type={'button'} onClick={() => navCallback(moment(start).day(4), 'day')}>
                        <div className="day-title">Thu<br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(4)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[4], smallScreen)}</div>
                    <div className="day-total text-center">${(days[4] && days[4].totalSpent) || 0}</div>
                </div>
                <div className={`col day-column ${(days[5] && days[5].splurge) && 'splurge'}`}>
                    <button type={'button'} onClick={() => navCallback(moment(start).day(5), 'day')}>
                        <div className="day-title">Fri <br/> <Moment className="day-date"
                                                                     format={'M/D'}>{moment(start).day(5)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[5], smallScreen)}</div>
                    <div className="day-total text-center">${(days[5] && days[5].totalSpent) || 0}</div>
                </div>
                <div className={`col day-column ${(days[6] && days[6].splurge) && 'splurge'}`}>
                    <button type={'button'} onClick={() => navCallback(moment(start).day(6), 'day')}>
                        <div className="day-title">Sat <br/>
                            <Moment className="day-date" format={'M/D'}>{moment(start).day(6)}</Moment>
                        </div>
                    </button>
                    <div className="day-expense-list">{ExpenseDateRange.toDailyExpenses(days[6], smallScreen)}</div>
                    <div className="day-total text-center">${(days[6] && days[6].totalSpent) || 0}</div>
                </div>
            </div>
        </div>
    }

}

export default Week;