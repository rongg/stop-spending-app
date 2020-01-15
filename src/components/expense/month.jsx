import React from 'react';
import '../../styles/month.css';
import moment from 'moment';
import ExpenseDateRange from './expense_date_range';
import Icon from "../common/Icon";

class Month extends React.Component {



    render() {
        const {expenses, start, navCallback} = this.props;
        const filters = this.props.filters || {};
        let expenseDays = ExpenseDateRange.assignExpensesToDays(expenses, 'date');
        const calendarDays = Month.getCalendarDays(expenseDays, start);


        //  Average expense amount per day
        const daysInMonth = start.isSame(moment(), 'month') ? moment().date() + 1 : start.daysInMonth();
        const sumExpenseAmounts = ExpenseDateRange.sumExpenseAmounts(expenses);
        const avg = Math.round(sumExpenseAmounts / daysInMonth);
        let weeklySplurgeLimit = 200;
        const dailySplurgeLimit = 50;

        for (let i = 0; i < calendarDays.length; i++) {
            const exp = calendarDays[i].expenses;
            calendarDays[i].totalSpent = exp ? ExpenseDateRange.sumExpenseAmounts(exp) : 0;
            calendarDays[i].splurge = calendarDays[i].totalSpent > dailySplurgeLimit && calendarDays[i].totalSpent >= avg * 2;
        }


        let week = [];
        week[0] = calendarDays.slice(0, 7);
        week[1] = calendarDays.slice(7, 14);
        week[2] = calendarDays.slice(14, 21);
        week[3] = calendarDays.slice(21, 28);
        week[4] = calendarDays.slice(28, 35);
        week[5] = calendarDays.slice(35, calendarDays.length);


        const weekTotals = [];
        week.map((w, index) => weekTotals[index] = ExpenseDateRange.sumWeeklyExpenseAmounts(w));

        //  Avg week totals
        const weekAvg = Math.round(weekTotals.reduce((c, a) => c + a, 0) / (daysInMonth / 7)) * 1.25;
        if(weekAvg >= weeklySplurgeLimit) weeklySplurgeLimit = weekAvg;


        const calendarRows = week.map((w, index) => (
            <div className='week row' key={'week-' + (index + 1)}>

                {w.map((day, index) => (
                    <div
                        className={`col day ${day.date.isSame(moment(), 'day') ? 'today' : ''} ${day.date.day() === 0 || day.date.day() === 6 ? 'weekend' : ''} ${day.splurge && filters.splurges && 'splurge'}`}
                        key={'day-' + (index + 1)}>
                        <div className='num'>
                            <span
                                className={`date ${day.date.isSame(start, 'month') ? '' : 'unfocus'}`}>{day.date.date()}</span>
                        </div>
                        <div className={'spent'}>
                            {day.totalSpent > 0 && <button type={'button'} onClick={() => navCallback(day.date, 'day')}>
                                <span>${Math.round(day.totalSpent)}</span>
                            </button>}
                        </div>
                    </div>
                ))}
                <div className={`col day-totals d-none d-sm-inline ${weekTotals[index] >= weeklySplurgeLimit && 'splurge'}`} key={'total-' + index}>
                    {weekTotals[index] > 0 &&
                    <button className='btn btn-default text-center ' onClick={() => navCallback(w[0].date, 'week')}>
                        {weekTotals[index] >= weeklySplurgeLimit && <div><Icon path={'app_icons/broken_piggy.svg'} /></div>}
                        <div><span className={'money'}>${Math.round(weekTotals[index])}</span></div>
                    </button>}
                </div>
            </div>
        ));


        return <div className={'col-sm-12'}>
            <div className='month-container'>
                <div className='header row'>
                    <div className='col'>Sun</div>
                    <div className='col'>Mon</div>
                    <div className='col'>Tue</div>
                    <div className='col'>Wed</div>
                    <div className='col'>Thu</div>
                    <div className='col'>Fri</div>
                    <div className='col'>Sat</div>
                    <div className='col d-none d-sm-inline'/>
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

Month.defaultProps = {
    navCallback: () => {}
};

export default Month;