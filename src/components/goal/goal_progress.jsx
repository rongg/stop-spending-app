import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import "../../styles/goals.css";
import Moment from "react-moment";
import Icon from "../common/Icon";
import PiggyBank from "../common/piggy_bank";
import ExpenseDateRange from "../expense/expense_date_range";
import FuelLevel from "../common/fuel_level";


function GoalProgress({goal, expenses}) {
    const {_id, target, start, end, pass, type} = goal;
    let period = 'Day';

    const goalLength = moment(end).diff(moment(start), 'hours');
    if (goalLength > 24) {
        period = 'Week';
    }
    if (goalLength > 168) {
        period = 'Month';
    }

    let predicate = type === 'Beat' ? 'Last ' + period : '';

    let template;
    let spent = ExpenseDateRange.sumExpenseAmounts(expenses.filter(e => moment(e.date).isAfter(start) && moment(e.date).isBefore(end)));
    if (moment().isAfter(end, 'minute')) {
        template = passFailTemplate(pass);
    } else {
        switch (period) {
            case 'Day':
                template = dayTemplate(target, start.toString(), end.toString(), spent);
                break;
            case 'Month':
                template = monthTemplate(target, start.toString(), end.toString(), spent);
                break;
            case 'Week':
                template = weekTemplate(target, start.toString(), end.toString(), spent);
                break;
            default:
                throw new Error("Invalid period parameter!");
        }
    }
    return <div className={`goal-progress ` + period.toLowerCase() + '-prog'}>
        <h5>{type} {predicate} <a href={`/goal/${_id}/edit`}><Icon className={'glyph-action'}
                                                                   path={'app_icons/glyph/edit.svg'}/></a></h5>
        {period !== 'Month' && <FuelLevel target={target} spent={spent}/>}
        {template}
    </div>;
}

const passFailTemplate = (pass) => {
    return <div>
        <span>Goal Passed: {pass}</span>
    </div>;
};

const monthTemplate = (target, start, end, spent) => {
    const daysLeft = moment(end).diff(moment(), 'minutes') / (24 * 60);
    const startDayIndex = moment(start).day();
    const daysElapsed = moment().diff(moment(start), 'days');
    const budgetLeft = target - spent;
    const avgLeft = Math.floor((budgetLeft) / (daysLeft + 1));
    let dayZero = moment(start).add(-startDayIndex, 'days');

    /*  Construct Days Array */
    let days = [];
    const daysTotal = 34;
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

    for (i; i < todayIndex; i++) {
        days.push({date: moment(dayZero), info: <Icon path={'app_icons/check.svg'}/>});
        dayZero.add(1, 'day');
    }
    if (daysElapsed > 0) {
        days.push({date: moment(dayZero), info: <PiggyBank icon={null} flip/>});
    }else{
        days.push({date: moment(dayZero), info: null, className: 'date', avgLeft: '$' + avgLeft});
    }
    i++;

    dayZero.add(1, 'day');
    //  Find Finish
    const finishIndex = todayIndex + daysLeft - 1;
    for (i; i < finishIndex; i++) {
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


    return <div className={'m-month'}>
        <div className={'row'}>
            <div className={'col-sm-12'}>
                <FuelLevel target={target} spent={spent}/>
            </div>
        </div>
        <div className={'row status'}>
            <div className={'col-sm-12'}>
                <span><span className={'money'}>${budgetLeft}</span> until <Moment format={'M/D'}>{moment(end)}</Moment></span>
            </div>
        </div>
        <div className={'row'}>
            <div className={'col-sm-12'} style={{paddingLeft: '30px', paddingRight: '30px'}}>
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

const weekTemplate = (target, start, end, spent) => {
    const minutesInterval = Math.round(moment(end).diff(moment(start), 'seconds') / (60 * 6));
    let days = [
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
    const budgetLeft = target - spent;
    const periodAvgLeft = periodsLeft > 0 ? Math.floor(budgetLeft / periodsLeft) : 1;

    return <div className={'m-week'}>
        <div className={'week-container'} style={{backgroundColor: '#2f363d'}}>
            <div className={'row status'}>
                <div className={'col-sm-12'}>
                    <span><span className={'money'}>${budgetLeft}</span> until <Moment
                        format={'ddd h:mm a'}>{moment(end)}</Moment></span>
                </div>
            </div>
            <div className='row week-expenses col-sm-12 day-indicator'>
                <div className={'col day-column start'}>
                    {todayIndex > 0 && <Icon path={'app_icons/race_flag.svg'}/>}
                    {todayIndex === 0 && <span><PiggyBank icon={null} flip/></span>}
                </div>
                {Array.apply(null, Array(todayIndex > 0 ? todayIndex - 1 : 0)).map((e, i) =>
                    <div className={'col day-column check'} key={'left-' + i}>
                        <span><Icon path={'app_icons/checkmark.svg'}/></span>
                    </div>)}
                {todayIndex > 0 && <div className={'col day-column'}>}
                    <span><PiggyBank icon={null} flip/></span>
                </div>}
                {Array.apply(null, Array(periodsLeft > 0 ? periodsLeft - 1 : 0)).map((e, i) =>
                    <div className={'col day-column'} key={'left-' + i}>
                        <span className={`money ${periodAvgLeft <= 0 && 'red'}`}>${periodAvgLeft}</span>
                    </div>)}
                <div className={'col day-column finish'}>
                    <Icon path={'app_icons/race_finish.svg'}/>
                </div>
            </div>
            <div className='row week-expenses col-sm-12'>
                {days.map((day, index) =>
                    <div className={`col day-column`} key={'day-c-' + index}>
                        <button type={'button'}>
                            <div className="day-title">
                                {(index === 0 || day.isAfter(days[index - 1], 'day')) ?
                                    <div>
                                        <Moment style={{fontWeight: '500'}} format={'ddd'}>{days[index]}</Moment> <br/>
                                        <Moment style={{fontWeight: '500'}} className="day-date"
                                                format={'M/D'}>{days[index]}</Moment>
                                    </div> : <div><br/><br/></div>}
                                <Moment className="day-date" format={'h:mm a'}>{days[index]}</Moment>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>


    </div>;
};
const dayTemplate = (target, start, end, spent) => {
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
    const budgetLeft = target - spent;
    const colAvgLeft = Math.floor(budgetLeft / minuteColsLeft);

    return <div className={'m-day week-container'} style={{backgroundColor: '#2f363d'}}>
        <div className={'row status'}>
            <div className={'col-sm-12'}>
                <span><span className={'money'}>${budgetLeft}</span> until <Moment
                    format={'h:mm a'}>{moment(end)}</Moment></span>
            </div>
        </div>
        <div className='row week-expenses col-sm-12 day-indicator'>
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
        <div className='row week-expenses col-sm-12 periods'>
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