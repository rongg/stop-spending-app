import React from 'react';
import '../../styles/month.css';
import PiggyBank from '../habit/piggy_bank';
import moment from 'moment';
import Moment from 'react-moment';
import ExpenseDateRange from './expense_date_range';

class Month extends ExpenseDateRange {
    state = {
        start: moment().startOf('month'),
        end: moment().endOf('month'),
        expenses: [],
        habits: []
    };

    render() {
        const {expenses, start} = this.state;


        const expenseDays = ExpenseDateRange.assignExpensesToDays(expenses, 'date');
        const calendarDays = Month.getCalendarDays(expenseDays, start);

        let week = [];
        week[0] = calendarDays.slice(0, 7);
        week[1] = calendarDays.slice(7, 14);
        week[2] = calendarDays.slice(14, 21);
        week[3] = calendarDays.slice(21, 28);
        week[4] = calendarDays.slice(28, 35);
        week[5] = calendarDays.slice(35, calendarDays.length);


        const dateFormat = 'MMMM YYYY';


        const leftNav = <button onClick={() => this.incrementPeriod(-1, 'month')}
                                style={{marginRight: '24px'}}>Prev</button>;
        const rightNav = <button onClick={() => this.incrementPeriod(1, 'month')}
                                 style={{marginLeft: '24px'}}>Next</button>;

        // console.log(expenseDays);
        // console.log(calendarDays);

        const calendarRows = week.map((w, index) => (
            <div className='week row' key={'week-' + (index + 1)}>

                {w.map((day, index) => (
                    <div className={`col day ${day.date.isSame(moment(), 'day') ? 'today' : ''} ${day.date.day() === 0 || day.date.day() === 6 ? 'weekend' : ''}`} key={'day-' + (index + 1)}>
                        <div className='num'>
                            <span
                                className={`date ${day.date.isSame(start, 'month') ? '' : 'unfocus'}`}>{day.date.date()}</span>
                        </div>
                        <div className={'spent'}>
                            {day.expenses && day.expenses.length > 0 && <span>${ExpenseDateRange.sumExpenseAmounts(day.expenses)}</span>}
                        </div>
                    </div>
                ))}
            </div>
        ));


        return <div>
            <div className="text-center spent-summary">
                <div className="piggy-container">
                    <PiggyBank budget={0} spent={0} width={300} height={200} animate={false}/>
                </div>
                <h4>
                    <span
                        className='money'>${ExpenseDateRange.sumExpenseAmounts(expenses)}</span> spent {Month.getSpentStatementPredicate(start)}
                </h4>
                <a href='/expense/new' className='link'>Log an Expense</a>
            </div>
            <br/>
            <div className='text-center week-nav'>
                {leftNav}
                <span className="week-title"><Moment format={dateFormat}>{start}</Moment></span>
                {rightNav}
            </div>

            <div className='month-container'>
                <div className='header row'>
                    <div className='col'>Sun</div>
                    <div className='col'>Mon</div>
                    <div className='col'>Tue</div>
                    <div className='col'>Wed</div>
                    <div className='col'>Thu</div>
                    <div className='col'>Fri</div>
                    <div className='col'>Sat</div>
                </div>
                {calendarRows}
            </div>
        </div>
    }

    static getCalendarDays(expenseDays, start) {
        let calendarDays = [];
        let noExpenses = !expenseDays || !expenseDays.length;
        if (noExpenses) {
            return Month.generateEmptyMonth(start);
        }
        for (let i = 0; i <= start.daysInMonth(); i++) {
            calendarDays.push({
                date: moment(start).date(i),
                expenses: expenseDays[i] || []
            })
        }

        return Month.appendPreviousAndLastMonth(calendarDays);
    }

    static appendPreviousAndLastMonth(calendarDays) {
        let startIndex = 0;
        const prevMonth = [];
        let firstDay = calendarDays[0];
        if (firstDay) {
            let day = firstDay.date.day();
            startIndex = day - 1;  //  previous month dates are negative indexes
            for (let i = 0; i <= startIndex; i++) {
                let amount = -1 * (startIndex - i);
                let date1 = moment(firstDay.date).date(amount).month(firstDay.date.month());
                prevMonth.push({
                    expenses: [],
                    date: date1
                });
            }
        }

        calendarDays = prevMonth.concat(calendarDays);

        let endIndex = calendarDays.length > 0 ? calendarDays.length - 1 : 0;
        let lastDay = calendarDays[endIndex];
        endIndex = lastDay.date.day();
        let weekOverlap = 6 - endIndex;
        for (let i = 1; i <= weekOverlap; i++) {
            calendarDays.push({
                expenses: [],
                date: moment(lastDay.date).day(endIndex + i)
            })
        }

        endIndex = calendarDays.length - 1;
        lastDay = calendarDays[endIndex];

        if (calendarDays.length < 42) {
            for (let i = 1; i <= 7; i++) {
                let date = lastDay.date.date();
                calendarDays.push({
                    expenses: [],
                    date: moment(lastDay.date).date(date + i)
                })
            }
        }

        return calendarDays;
    }

    static generateEmptyMonth(start) {
        let calendarDays = [];
        for (let i = 1; i <= start.daysInMonth(); i++) {
            calendarDays.push({
                date: moment(start).date(i),
                expenses: []
            });
        }

        return Month.appendPreviousAndLastMonth(calendarDays);
    }

    static getSpentStatementPredicate(start) {
        if (start.month() === moment().month()) return <span>this month</span>;
        if (start.month() === moment().add(-1, 'month').month()) return <span>last month</span>;
    }

}

export default Month;