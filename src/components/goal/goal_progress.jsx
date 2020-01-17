import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import "../../styles/goals.css";
import Moment from "react-moment";
import Icon from "../common/Icon";
import PiggyBank from "../common/piggy_bank";
import ExpenseDateRange from "../expense/expense_date_range";
import FuelLevel from "../common/fuel_level";
import Count from "../common/count";


function GoalProgress({goal, expenses}) {
    const {_id, name, target, start, end, type} = goal;
    let period = 'Day';

    const goalLength = moment(end).diff(moment(start), 'hours');
    if (goalLength > 24) {
        period = 'Week';
    }
    if (goalLength > 168) {
        period = 'Month';
    }

    let predicate = type === 'Beat' ? 'Last ' + period : '';
    let accumulated = ExpenseDateRange.sumExpenseAmounts(expenses.filter(e => moment(e.date).isAfter(start) && moment(e.date).isBefore(end)));

    let passed = false;
    let completed = moment().isAfter(end, 'hour') || (type !== 'Abstain' && accumulated > target);

    let progressDisplay;
    if (goal.type === 'Abstain') {
        let daysCollected = 0;

        let nStart = moment(start);
        let curr = moment(nStart);
        let mEnd = moment();
        if (mEnd.isAfter(moment(end))) {
            mEnd = moment(end);
        }
        const daysBetween = mEnd.diff(moment(nStart), 'day');
        for (let i = 0; i <= daysBetween; i++) {
            const dayFilter = function (curr) {
                return e => {
                    return moment(e.date).isSame(curr, 'date');
                }
            };

            let dayExpenses = expenses.filter(dayFilter(curr));
            if (dayExpenses.length < 1 && moment().isAfter(curr, 'date')) daysCollected++;
            curr = curr.add(1, 'day');

            passed = daysCollected >= target;
        }

        progressDisplay = <Count target={target} count={daysCollected}/>;

        accumulated = daysCollected;

    } else {
        passed = completed && accumulated <= target;
        progressDisplay = <FuelLevel target={target} spent={accumulated}/>;
    }

    let template;
    let showPassFail = false;
    if (completed || passed) {
        template = passFailTemplate(passed, target, accumulated, type, start, end);
        showPassFail = true;
    } else {
        switch (period) {
            case 'Day':
                template = dayTemplate(target, start.toString(), end.toString(), accumulated, type);
                break;
            case 'Month':
                template = monthTemplate(target, start.toString(), end.toString(), accumulated, type, progressDisplay, expenses);
                break;
            case 'Week':
                template = weekTemplate(target, start.toString(), end.toString(), accumulated, type, expenses);
                break;
            default:
                throw new Error("Invalid period parameter!");
        }
    }

    return <div className={`goal-progress ` + period.toLowerCase() + '-prog'}>
        <h5>{name} - {type} {predicate} <a href={`/goal/${_id}/edit`}><Icon className={'glyph-action'}
                                                                            path={'app_icons/glyph/edit.svg'}/></a></h5>
        {period !== 'Month' && !showPassFail && progressDisplay}
        {template}
    </div>;
}

const passFailTemplate = (passed, target, accumulated, type, start, end) => {
    let totalName = 'Spent: $';
    let targetName = 'Target: $';
    if (type === 'Abstain') {
        totalName = 'Days Collected: ';
        targetName = 'Target: ';
    }
    return <div>
        {passed && <div>
            <Icon path={'app_icons/checkmark.svg'}/><br/>
            <h5>Goal Passed!</h5>
            <span>{targetName}{target}</span><br/>
            <span>{totalName}{accumulated.toFixed(2)}</span><br/>
            <span>Start: <Moment format={'ddd MMM D h:mm a'}>{moment(start)}</Moment></span><br/>
            <span>End: <Moment format={'ddd MMM D h:mm a'}>{moment(end)}</Moment></span>
        </div>}
        {!passed && <div>
            <Icon path={'app_icons/broken_piggy.svg'}/><br/>
            <h5>Goal Failed!</h5>
            <span>{targetName}{target}</span><br/>
            <span>{totalName}{accumulated.toFixed(2)}</span><br/>
            <span>Start: <Moment format={'ddd MMM D h:mm a'}>{moment(start)}</Moment></span><br/>
            <span>End: <Moment format={'ddd MMM D h:mm a'}>{moment(end)}</Moment></span>
        </div>}
    </div>;
};

function monthTemplateAbstain(target, start, end, accumulated, progressDisplay, expenses) {
    const daysLeft = moment(end).startOf('day').diff(moment().startOf('day'), 'minutes') / (24 * 60);
    const startDayIndex = moment(start).day();
    const daysElapsed = moment().diff(moment(start).startOf('day'), 'days');
    const avgLeft = 0;//Math.floor((budgetLeft) / (daysLeft + 1));
    let dayZero = moment(start).add(-startDayIndex, 'days');

    /*  Construct Days Array */
    const dayFilter = function (date) {
        return expenses.filter(e => moment(e.date).isSame(date, 'date'));
    };
    let days = [];
    const daysTotal = 35;
    let i = 0;
    //  Find Start
    for (i; i < startDayIndex - 1; i++) {
        const dayOne = {date: moment(dayZero), info: null, className: 'inactive date', expenses: null};
        days.push(dayOne);
        dayZero.add(1, 'day');
    }
    daysElapsed > 0 ? days.push({
        date: moment(dayZero),
        info: <Icon path={'app_icons/race_flag.svg'}/>,
        expenses: dayFilter(moment(dayZero))
    }) : days.push({
        date: moment(dayZero),
        info: <PiggyBank icon={null} flip/>,
        expenses: dayFilter(moment(dayZero))
    });
    dayZero.add(1, 'day');

    //  Find Current Day
    const todayIndex = startDayIndex + daysElapsed;
    i++;

    for (i; i < todayIndex; i++) {
        const dExpenses = dayFilter(moment(dayZero));
        days.push({
            date: moment(dayZero),
            info: dExpenses.length ? <Icon path={'app_icons/trident.svg'}/> : <Icon path={'app_icons/checkmark.svg'}/>,
            expenses: dExpenses
        });
        dayZero.add(1, 'day');
    }
    if (daysElapsed > 0) {
        const dExpenses = dayFilter(moment(dayZero));
        days.push({
            date: moment(dayZero), info: <PiggyBank icon={null} flip/>,
            expenses: dExpenses
        });
    } else {
        const dExpenses = dayFilter(moment(dayZero));
        days.push({
            date: moment(dayZero), info: null, className: 'date', avgLeft: '$' + avgLeft,
            expenses: dExpenses
        });
    }
    i++;

    dayZero.add(1, 'day');
    //  Find Finish
    const finishIndex = todayIndex + daysLeft - 1;
    for (i; i <= finishIndex; i++) {
        days.push({
            date: moment(dayZero), info: null, className: 'date', avgLeft: '$' + avgLeft,
            expenses: null
        });
        dayZero.add(1, 'day');
    }
    days.push({
        date: moment(dayZero),
        info: <div><Icon path={'app_icons/race_finish.svg'}/></div>,
        expenses: null
    });
    i++;
    dayZero.add(1, 'day');
    for (i; i < daysTotal; i++) {
        days.push({date: moment(dayZero), info: null, className: 'inactive date'});
        dayZero.add(1, 'day');
    }


    //  Divide days into weeks
    let week = [[], [], [], [], []];
    let wIndex = 0;
    let dIndex = 0;
    for (let i = 0; i < days.length; i++) {
        if (i > 0 && i % 7 === 0) {
            wIndex++;
            dIndex = 0;
        }
        if (wIndex >= week.length) {
            wIndex = week.length - 1;
        }
        week[wIndex][dIndex] = days[i];
        dIndex++;
    }


    const progressMessage = <span><span className={'money'}>{accumulated} out of {target}</span> Days Collected</span>;

    return <div className={'m-month'}>
        <div className={'row'}>
            <div className={'col-12'}>
                {progressDisplay}
            </div>
        </div>
        <div className={'row status'}>
            <div className={'col-12'}>
                {progressMessage}
            </div>
        </div>
        <div className={'row time-frame'}>
            <div className={'col-12'}>
                <div className={'row day-labels'}>
                    <div className={'col day'}>
                        Sun
                    </div>
                    <div className={'col day'}>
                        Mon
                    </div>
                    <div className={'col day'}>
                        Tue
                    </div>
                    <div className={'col day'}>
                        Wed
                    </div>
                    <div className={'col day'}>
                        Thu
                    </div>
                    <div className={'col day'}>
                        Fri
                    </div>
                    <div className={'col day'}>
                        Sat
                    </div>
                </div>
                <div className={'row'}>
                    {week[0].map((d, i) => <div key={'w-0-' + i} className={'col day ' + d.className}>
                        {d.info && d.info}
                        {!d.info && <span>{d.date.date()}</span>}
                        {!d.info && <div className={'avg-left'}><span className={'money'}>{d.avgLeft}</span></div>}
                    </div>)}
                </div>
                <div className={'row'}>
                    {week[1].map((d, i) => <div key={'w-1-' + i} className={'col day ' + d.className}>
                        {d.info && d.info}
                        {!d.info && <span>{d.date.date()}</span>}
                        {d.avgLeft && <div className={'avg-left'}><span className={'money'}>{d.avgLeft}</span></div>}
                    </div>)}
                </div>
                <div className={'row'}>
                    {week[2].map((d, i) => <div key={'w-2-' + i} className={'col day ' + d.className}>
                        {d.info && d.info}
                        {!d.info && <span>{d.date.date()}</span>}
                        {d.avgLeft && <div className={'avg-left'}><span className={'money'}>{d.avgLeft}</span></div>}
                    </div>)}
                </div>
                <div className={'row'}>
                    {week[3].map((d, i) => <div key={'w-3-' + i} className={'col day ' + d.className}>
                        {d.info && d.info}
                        {!d.info && <span>{d.date.date()}</span>}
                        {d.avgLeft && <div className={'avg-left'}><span className={'money'}>{d.avgLeft}</span></div>}
                    </div>)}
                </div>
                <div className={'row'}>
                    {week[4].map((d, i) => <div key={'w-4-' + i} className={'col day ' + d.className}>
                        {d.info && d.info}
                        {!d.info && <span>{d.date.date()}</span>}
                        {d.avgLeft && <div className={'avg-left'}><span className={'money'}>{d.avgLeft}</span></div>}
                    </div>)}
                </div>
            </div>
        </div>
    </div>;
}

const monthTemplate = (target, start, end, accumulated, goalType, progressDisplay, expenses) => {
    if (goalType === 'Abstain') return monthTemplateAbstain(target, start, end, accumulated, progressDisplay, expenses);
    const daysLeft = moment(end).startOf('day').diff(moment().startOf('day'), 'minutes') / (24 * 60);
    const startDayIndex = moment(start).day();
    const daysElapsed = moment().diff(moment(start).startOf('day'), 'days');
    const budgetLeft = target - accumulated;
    const avgLeft = Math.floor((budgetLeft) / (daysLeft + 1));
    let dayZero = moment(start).add(-startDayIndex, 'days');

    /*  Construct Days Array */
    let days = [];
    const daysTotal = 35;
    let i = 0;
    //  Find Start
    for (i; i < startDayIndex; i++) {
        const dayOne = {date: moment(dayZero), info: null, className: 'inactive date'};
        days.push(dayOne);
        dayZero.add(1, 'day');
    }
    daysElapsed > 0 ? days.push({
        date: moment(dayZero),
        info: <Icon path={'app_icons/race_flag.svg'}/>
    }) : days.push({date: moment(dayZero), info: <PiggyBank icon={null} flip/>});
    dayZero.add(1, 'day');

    //  Find Current Day
    const todayIndex = startDayIndex + daysElapsed;
    i++;

    for (i; i < todayIndex; i++) {
        days.push({date: moment(dayZero), info: <Icon path={'app_icons/check.svg'}/>});
        dayZero.add(1, 'day');
    }
    if (daysElapsed > 0) {
        days.push({date: moment(dayZero), info: <PiggyBank icon={null} flip/>});
    } else {
        days.push({date: moment(dayZero), info: null, className: 'date', avgLeft: '$' + avgLeft});
    }
    i++;

    dayZero.add(1, 'day');
    //  Find Finish
    const finishIndex = todayIndex + daysLeft - 1;
    for (i; i <= finishIndex; i++) {
        days.push({date: moment(dayZero), info: null, className: 'date', avgLeft: '$' + avgLeft});
        dayZero.add(1, 'day');
    }
    days.push({
        date: moment(dayZero),
        info: <div><Icon path={'app_icons/race_finish.svg'}/></div>
    });
    i++;
    dayZero.add(1, 'day');
    for (i; i < daysTotal; i++) {
        days.push({date: moment(dayZero), info: null, className: 'inactive date'});
        dayZero.add(1, 'day');
    }

    //  Divide days into weeks
    let week = [[], [], [], [], []];
    let wIndex = 0;
    let dIndex = 0;
    for (let i = 0; i < days.length; i++) {
        if (i > 0 && i % 7 === 0) {
            wIndex++;
            dIndex = 0;
        }
        if (wIndex >= week.length) {
            wIndex = week.length - 1;
        }
        week[wIndex][dIndex] = days[i];
        dIndex++;
    }


    let progressMessage;
    if (goalType === 'Abstain') progressMessage =
        <span><span className={'money'}>{accumulated} out of {target}</span> Days Collected</span>;
    else progressMessage =
        <span><span className={'money'}>${budgetLeft.toFixed(2)}</span> until <Moment
            format={'ddd M/D'}>{moment(end)}</Moment></span>;


    return <div className={'m-month'}>
        <div className={'row'}>
            <div className={'col-12'}>
                {progressDisplay}
            </div>
        </div>
        <div className={'row status'}>
            <div className={'col-12'}>
                {progressMessage}
            </div>
        </div>
        <div className={'row time-frame'}>
            <div className={'col-12'}>
                <div className={'row day-labels'}>
                    <div className={'col day'}>
                        Sun
                    </div>
                    <div className={'col day'}>
                        Mon
                    </div>
                    <div className={'col day'}>
                        Tue
                    </div>
                    <div className={'col day'}>
                        Wed
                    </div>
                    <div className={'col day'}>
                        Thu
                    </div>
                    <div className={'col day'}>
                        Fri
                    </div>
                    <div className={'col day'}>
                        Sat
                    </div>
                </div>
                <div className={'row'}>
                    {week[0].map((d, i) => <div key={'w-0-' + i} className={'col day ' + d.className}>
                        {d.info && d.info}
                        {!d.info && <span>{d.date.date()}</span>}
                        {d.avgLeft && <div className={'avg-left'}><span className={'money'}>{d.avgLeft}</span></div>}
                    </div>)}
                </div>
                <div className={'row'}>
                    {week[1].map((d, i) => <div key={'w-1-' + i} className={'col day ' + d.className}>
                        {d.info && d.info}
                        {!d.info && <span>{d.date.date()}</span>}
                        {d.avgLeft && <div className={'avg-left'}><span className={'money'}>{d.avgLeft}</span></div>}
                    </div>)}
                </div>
                <div className={'row'}>
                    {week[2].map((d, i) => <div key={'w-2-' + i} className={'col day ' + d.className}>
                        {d.info && d.info}
                        {!d.info && <span>{d.date.date()}</span>}
                        {d.avgLeft && <div className={'avg-left'}><span className={'money'}>{d.avgLeft}</span></div>}
                    </div>)}
                </div>
                <div className={'row'}>
                    {week[3].map((d, i) => <div key={'w-3-' + i} className={'col day ' + d.className}>
                        {d.info && d.info}
                        {!d.info && <span>{d.date.date()}</span>}
                        {d.avgLeft && <div className={'avg-left'}><span className={'money'}>{d.avgLeft}</span></div>}
                    </div>)}
                </div>
                <div className={'row'}>
                    {week[4].map((d, i) => <div key={'w-4-' + i} className={'col day ' + d.className}>
                        {d.info && d.info}
                        {!d.info && <span>{d.date.date()}</span>}
                        {d.avgLeft && <div className={'avg-left'}><span className={'money'}>{d.avgLeft}</span></div>}
                    </div>)}
                </div>
            </div>
        </div>
    </div>;
};

function weekTemplateAbstain(target, start, end, accumulated, expenses) {
    const dayFilter = function (date) {
        return expenses.filter(e => moment(e.date).isSame(date, 'date'));
    };
    const days = [
        {date: moment(start).day(0), spent: ExpenseDateRange.sumExpenseAmounts(dayFilter(moment(start).day(0)))},
        {date: moment(start).day(1), spent: ExpenseDateRange.sumExpenseAmounts(dayFilter(moment(start).day(1)))},
        {date: moment(start).day(2), spent: ExpenseDateRange.sumExpenseAmounts(dayFilter(moment(start).day(2)))},
        {date: moment(start).day(3), spent: ExpenseDateRange.sumExpenseAmounts(dayFilter(moment(start).day(3)))},
        {date: moment(start).day(4), spent: ExpenseDateRange.sumExpenseAmounts(dayFilter(moment(start).day(4)))},
        {date: moment(start).day(5), spent: ExpenseDateRange.sumExpenseAmounts(dayFilter(moment(start).day(5)))},
        {date: moment(start).day(6), spent: ExpenseDateRange.sumExpenseAmounts(dayFilter(moment(start).day(6)))}
    ];


    const now = moment();
    let startIndex = moment(start).day();
    let todayIndex = now.day();


    const periodsLeft = 6 - todayIndex;
    const periodAvgLeft = 0;

    let progressMessage = <span><span className={'money'}>{accumulated} out of {target}</span> Days Collected</span>;

    return <div
        className={'m-week'}>
        <div className={'week-container'} style={{backgroundColor: '#2f363d'}}>
            <div className={'row status'}>
                <div className={'col-12'}>
                    {progressMessage}
                </div>
            </div>
            <div className='row time-frame week-expenses col-12 day-indicator'>
                {startIndex > 0 && Array.apply(null, Array(startIndex)).map((e, i) =>
                    <div className={'col day-column check inactive-day'} key={'left-' + i}>
                    </div>)}
                <div className={'col day-column start'}>
                    {todayIndex > 0 && startIndex !== todayIndex &&
                    <span><Icon path={'app_icons/race_flag.svg'}/></span>}
                    {todayIndex > 0 && startIndex === todayIndex && <PiggyBank icon={null} flip/>}
                    {todayIndex === 0 && <PiggyBank icon={null} flip/>}
                </div>
                {Array.apply(null, Array(todayIndex - startIndex > 0 ? todayIndex - startIndex - 1 : 0)).map((e, i) =>
                    <div className={'col day-column check'} key={'left-' + i}>
                        {days[i + startIndex + 1].spent === 0 && <span><Icon path={'app_icons/checkmark.svg'}/></span>}
                        {days[i + startIndex + 1].spent > 0 && <span><Icon path={'app_icons/trident.svg'}/></span>}
                    </div>)}
                {startIndex !== todayIndex && <div className={'col day-column'}>
                    <span><PiggyBank icon={null} flip/></span>
                </div>}
                {Array.apply(null, Array(periodsLeft > 0 ? periodsLeft - 1 : 0)).map((e, i) =>
                    <div className={'col day-column'} key={'left-' + i}>
                        <span className={`money ${periodAvgLeft <= 0 && 'red'}`}>${periodAvgLeft}</span>
                        {/*<span className={`money ${periodAvgLeft <= 0 && 'red'}`}>${days[i + startIndex + 1].spent}</span>*/}
                    </div>)}
                {todayIndex < 6 &&
                <div className={'col day-column finish'}>
                    <Icon path={'app_icons/race_finish.svg'}/>
                </div>}
            </div>
            <div className='row week-expenses col-12'>
                {days.map((day, index) =>
                    <div className={`col day-column`} key={'day-c-' + index}>
                        <button type={'button'}>
                            <div className="day-title">
                                {(index === 0 || day.date.isAfter(days[index - 1].date, 'day')) ?
                                    <div>
                                        <Moment style={{fontWeight: '500'}} format={'ddd'}>{days[index].date}</Moment>
                                        <br/>
                                        <Moment style={{fontWeight: '500'}} className="day-date"
                                                format={'M/D'}>{days[index].date}</Moment>
                                    </div> : <div><br/><br/></div>}
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>


    </div>;
}

const weekTemplate = (target, start, end, accumulated, goalType, expenses) => {
    if (goalType === 'Abstain') return weekTemplateAbstain(target, start, end, accumulated, expenses);
    const minutesInterval = Math.round(moment(end).diff(moment(start), 'seconds') / (60 * 6));
    const days = [
        moment(start),
        moment(start).add(minutesInterval, 'minutes'),
        moment(start).add(minutesInterval * 2, 'minutes'),
        moment(start).add(minutesInterval * 3, 'minutes'),
        moment(start).add(minutesInterval * 4, 'minutes'),
        moment(start).add(minutesInterval * 5, 'minutes'),
        moment(end),
    ];
    let todayIndex = 0;
    //  Round to nearest half-hour (down) & find today index
    days.map((d, i) => {
        const m = moment(d);
        if (m.minutes() <= 15) d.minutes(0);
        else if (m.minutes() <= 45) d.minutes(30);
        else {
            m.add(1, 'hours');
            m.minutes(0);
        }

        if (m.isBefore(moment())) todayIndex = i;

        return m;
    });

    const periodsLeft = 6 - todayIndex;
    const budgetLeft = target - accumulated;
    const periodAvgLeft = periodsLeft > 0 ? Math.floor(budgetLeft / periodsLeft) : 1;

    const progressMessage = <span><span className={'money'}>${budgetLeft.toFixed(2)}</span> until <Moment
        format={'ddd h:mm a'}>{moment(end)}</Moment></span>;

    return <div
        className={'m-week'}>
        <div className={'week-container'} style={{backgroundColor: '#2f363d'}}>
            <div className={'row status'}>
                <div className={'col-12'}>
                    {progressMessage}
                </div>
            </div>
            <div className='time-frame week-expenses day-indicator'>
                <div className={'row'}>
                    <div className={'col day-column start'}>
                        {todayIndex > 0 && <Icon path={'app_icons/race_flag.svg'}/>}
                        {todayIndex === 0 && <span><PiggyBank icon={null} flip/></span>}
                    </div>
                    {Array.apply(null, Array(todayIndex > 0 ? todayIndex - 1 : 0)).map((e, i) =>
                        <div className={'col day-column check'} key={'left-' + i}>
                            <span><Icon path={'app_icons/checkmark.svg'}/></span>
                        </div>)}
                    {todayIndex > 0 && <div className={'col day-column'}>
                        <span><PiggyBank icon={null} flip/></span>
                    </div>}
                    {Array.apply(null, Array(periodsLeft > 0 ? periodsLeft - 1 : 0)).map((e, i) =>
                        <div className={'col day-column'} key={'left-' + i}>
                            <span className={`money ${periodAvgLeft <= 0 && 'red'}`}>${periodAvgLeft}</span>
                        </div>)}
                    {todayIndex < 6 &&
                    <div className={'col day-column finish'}>
                        <Icon path={'app_icons/race_finish.svg'}/>
                    </div>}
                </div>
            </div>
            <div className='row week-expenses'>
                {days.map((day, index) =>
                    <div className={`col day-column`} key={'day-c-' + index}>
                        <button type={'button'}>
                            <div className="day-title">
                                {(index === 0 || day.isAfter(days[index - 1], 'day')) ?
                                    <div>
                                        <Moment style={{fontWeight: '500'}}
                                                format={'ddd'}>{days[index]}</Moment>
                                        <br/>
                                        <Moment style={{fontWeight: '500'}} className="day-date"
                                                format={'M/D'}>{days[index]}</Moment>
                                    </div> : <div><br/><br/></div>}
                                <Moment className="day-date" format={'h:mm a'}>{days[index]}</Moment>
                            </div>
                        </button>
                    </div>)}
            </div>
        </div>

    </div>;
};
const dayTemplate = (target, start, end, accumulated, goalType) => {
    const secondsBetween = moment(end).diff(moment(start), 'second');
    const secondsInterval = (secondsBetween / 5);

    let progressCols = [
        moment(start),
        moment(start).add(secondsInterval, 'second'),
        moment(start).add(2 * secondsInterval, 'second'),
        moment(start).add(3 * secondsInterval, 'second'),
        moment(start).add(4 * secondsInterval, 'second'),
        moment(end)
    ];

    //  Find current time index
    let nowIndex = -1;
    for (let i = 0; i < progressCols.length; i++) {
        if (moment().isAfter(progressCols[i])) nowIndex++;
    }
    if (nowIndex < 0) nowIndex = 0;

    let minuteColsLeft = progressCols.length - nowIndex - 2;
    if (minuteColsLeft < 0) minuteColsLeft = 0;
    const budgetLeft = target - accumulated;
    const colAvgLeft = Math.floor(budgetLeft / minuteColsLeft);


    let progressMessage;
    if (goalType === 'Abstain') progressMessage =
        <span><span className={'money'}>{accumulated} out of {target}</span> Days Collected</span>;
    else progressMessage =
        <span><span className={'money'}>${budgetLeft.toFixed(2)}</span> until <Moment format={'ddd h:mm a'}>{moment(end)}</Moment></span>;

    return <div className={'m-day week-container'} style={{backgroundColor: '#2f363d'}}>
        <div className={'row status'}>
            <div className={'col-12'}>
                {progressMessage}
            </div>
        </div>
        <div className='row time-frame week-expenses col-12 day-indicator'>
            <div className={'col day-column start'}>
                {nowIndex > 0 && <Icon path={'app_icons/race_flag.svg'}/>}
                {nowIndex <= 0 && <PiggyBank icon={null} flip/>}
            </div>
            {Array.apply(null, Array(nowIndex > 0 ? nowIndex - 1 : nowIndex)).map((e, i) =>
                <div className={'col day-column check'} key={'left-' + i}>
                    <span><Icon path={'app_icons/checkmark.svg'}/></span>
                </div>)}
            {nowIndex > 0 && <div className={'col day-column'}>
                <span><PiggyBank icon={null} flip/></span>
            </div>}
            {Array.apply(null, Array(minuteColsLeft)).map((e, i) =>
                <div className={'col day-column'} key={'left-' + i}>
                    <span className={`money ${colAvgLeft <= 0 && 'red'}`}>${colAvgLeft}</span>
                </div>)}
            <div className={'col day-column finish'}>
                <Icon path={'app_icons/race_finish.svg'}/>
            </div>
        </div>
        <div className='row week-expenses col-12 periods'>
            {progressCols.map((day, index) =>
                <div className={`col day-column`} key={'day-c-' + index}>
                    <button type={'button'}>
                        <div className="day-title">
                            <Moment className="day-date" format={'h:mm a'}>{progressCols[index]}</Moment>
                        </div>
                    </button>
                </div>
            )}
        </div>
    </div>
};

GoalProgress.propTypes = {
    goal: PropTypes.object.isRequired,
    expenses: PropTypes.array.isRequired
};

export default GoalProgress;