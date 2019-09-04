import React from 'react';
import '../../styles/month.css';
import moment from 'moment';
import ExpenseDateRange from './expense_date_range';

class Month extends React.Component {

    render() {
        const {expenses, start, navCallback} = this.props;
        let expenseDays = ExpenseDateRange.assignExpensesToDays(expenses, 'date');
        const calendarDays = Month.getCalendarDays(expenseDays, start);

        let week = [];
        week[0] = calendarDays.slice(0, 7);
        week[1] = calendarDays.slice(7, 14);
        week[2] = calendarDays.slice(14, 21);
        week[3] = calendarDays.slice(21, 28);
        week[4] = calendarDays.slice(28, 35);
        week[5] = calendarDays.slice(35, calendarDays.length);




        const weekTotals = [];
        week.map((w, index) => weekTotals[index] = ExpenseDateRange.sumWeeklyExpenseAmounts(w));

        const calendarRows = week.map((w, index) => (
            <div className='week row' key={'week-' + (index + 1)}>

                {w.map((day, index) => (
                    <div
                        className={`col day ${day.date.isSame(moment(), 'day') ? 'today' : ''} ${day.date.day() === 0 || day.date.day() === 6 ? 'weekend' : ''}`}
                        key={'day-' + (index + 1)}>
                        <div className='num'>
                            <span
                                className={`date ${day.date.isSame(start, 'month') ? '' : 'unfocus'}`}>{day.date.date()}</span>
                        </div>
                        <div className={'spent'}>
                            {day.expenses && day.expenses.length > 0 &&
                            <button type={'button'} onClick={() => navCallback(day.date, 'day')}>
                                <span>${ExpenseDateRange.sumExpenseAmounts(day.expenses)}</span>
                            </button>}
                        </div>
                    </div>
                ))}
                <div className={'col day-totals'} key={'total-' + index}>
                    {weekTotals[index] > 0 && <button type={'button'} onClick={() => navCallback(w[0].date, 'week')}>
                        <span className={'money'}>${weekTotals[index]}</span>
                    </button>}
                </div>
            </div>
        ));


        return <div>
            <div className='month-container'>
                <div className='header row'>
                    <div className='col'>Sun</div>
                    <div className='col'>Mon</div>
                    <div className='col'>Tue</div>
                    <div className='col'>Wed</div>
                    <div className='col'>Thu</div>
                    <div className='col'>Fri</div>
                    <div className='col'>Sat</div>
                    <div className='col'/>
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
        const prevMonth = [];
        let firstDay = calendarDays[0];
        if (firstDay) {
            let dayNum = moment(firstDay.date).day();
            for (let i = dayNum * -1; i < 0; i++) {
                let date1 = moment(firstDay.date).add(i, 'day');
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

}

export default Month;