import React from 'react';
import habits from '../../services/habits';
import HabitCard from "../habit/habit_card";
import Week from "../expense/week";
import Month from "../expense/month";
import Day from "../expense/day";
import ExpenseDateRange from "../expense/expense_date_range";
import moment from "moment";
import expenses from "../../services/expenses";
import '../../styles/my_habit.css';
import axios from "axios";
import Moment from "react-moment";
import Icon from "../common/Icon";

class MyHabit extends React.Component {
    state = {
        currentNav: 'week',
        start: moment().startOf('week'),
        end: moment().endOf('week'),
        smallScreen: ExpenseDateRange.getScreenWidth() <= 576,
        habit: {
            name: '',
            budget: 0,
            budgetType: ''
        },
        expenses: [],
        urges: []
    };

    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.incrementPeriod = this.incrementPeriod.bind(this);
    }


    componentDidMount() {
        sessionStorage.returnPage = '/habit/' + this.props.match.params.id;
        this.loadData();
    }


    loadData() {
        const {start, end} = this.state;
        const habitId = this.props.match.params.id;

        axios.all([habits.getForId(habitId), expenses.getForHabit(habitId, start, end),
            habits.getUrgesForHabit(habitId, start, end)])
            .then(res => {
                console.log('urges', res[2].data);
                this.setState({habit: res[0].data, expenses: res[1].data, urges: res[2].data})
            });
    }

    setCurrentNav(loc, start, end) {
        this.setState({currentNav: loc, start, end}, () => {
            this.loadData();
        });

    }


    incrementPeriod(num, unit) {
        let {start, end} = this.state;
        // if (num > 0 && end.isAfter(moment())) return;    // Don't go into the future
        this.setState({
            start: start.add(num, unit),
            end: end.add(num, unit)
        });
        this.state.habitId ? this.getExpensesForHabit() : this.loadData();
    }

    render() {
        let {name, budget, icon, _id, budgetType} = this.state.habit;
        const {currentNav, start, end, expenses, smallScreen} = this.state;


        // let datePrefix = 'Weekly';
        let dateFormat = 'MMM D';
        // let totalBudgetKey = 'budgetWeek';

        const startEndSameMonth = start.isSame(end, 'month');
        let dateFormat2 = startEndSameMonth && currentNav === 'week' ? 'D' : null;


        if (currentNav === 'month') {
            // datePrefix = 'Monthly';
            dateFormat = start.isSame(moment(), 'year') ? 'MMMM' : 'MMMM YYYY';
            // totalBudgetKey = 'budgetMonth';
        }
        if (currentNav === 'day') {
            // datePrefix = 'Daily';
            dateFormat = 'dddd MMM D';
            // totalBudgetKey = 'budgetDay';
        }

        const leftNav = <a className='btn btn-default' onClick={() => this.incrementPeriod(-1, currentNav)}><Icon
            path={'app_icons/left.svg'}/></a>;
        const rightNav = <a className='btn btn-default' onClick={() => this.incrementPeriod(1, currentNav)}
                            style={{float: 'right'}}><Icon path={'app_icons/right.svg'}/></a>;

        if (!budgetType) budgetType = 'week';
        return <div className="m-auto page my-habit">
            <div className="row habit-head section-head" style={{margin: '0'}}>
                <div className={'col-sm-4 profile-pic'}>
                    <div>
                        <HabitCard text={name} iconUrl={icon} link={'/habit/' + _id + '/edit'}
                                   piggy={true}
                                   iconHeight='56px'
                                   height='148px'
                                   key={'habit-card-' + _id} footerText={'$' + budget + ' / ' + budgetType}/>
                    </div>
                    <div className={'b-container'}>
                        <div className={'col-sm-12 text-center'}>
                            <a href={''}
                               className="btn btn-block btn-primary btn-default">
                                <div className={'col-sm-12 col-xl-7 col-lg-10 m-auto'}><Icon path={'app_icons/log.svg'}/>
                                    Log an Expense
                                </div>

                            </a>
                            <a href={_id + '/urge/new'}
                               className="btn btn-block btn-primary btn-default">
                                <div className={'col-sm-12 col-xl-7 col-lg-10 m-auto'}><Icon path={'app_icons/devil.svg'}/>
                                    Log an Urge
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={'col-sm-8 key-figures'}>
                    <div className={'row'}>
                        <div className={'col-sm-4'}>
                            <div className={'card'}>

                            </div>
                        </div>
                        <div className={'col-sm-4'}>
                            <div className={'card'}>

                            </div>
                        </div>
                        <div className={'col-sm-4'}>
                            <div className={'card'}>

                            </div>
                        </div>
                    </div>
                    <div className={'row'} style={{marginTop: '16px'}}>
                        <div className={'col-sm-4'}>
                            <div className={'card'}>

                            </div>
                        </div>
                        <div className={'col-sm-4'}>
                            <div className={'card'}>

                            </div>
                        </div>
                        <div className={'col-sm-4'}>
                            <div className={'card'}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={'section-head'}>
                <div className={'col-sm-12'}>
                    <h3>Activity</h3>
                </div>
            </div>
            <div className={`date-head`}>
                <div className={`date-nav row`}>
                    <div className="col-sm-4 expenses-nav text-left">
                        <div className='btn-group' role='group'>
                            <button
                                onClick={() => this.setCurrentNav('month', moment().startOf('month'), moment().endOf('month'))}
                                className={`btn btn-secondary ${currentNav === 'month' ? 'active' : 'inactive'}`}>Month
                            </button>
                            <button
                                onClick={() => this.setCurrentNav('week', moment().startOf('week'), moment().endOf('week'))}
                                className={`btn btn-secondary ${currentNav === 'week' ? 'active' : 'inactive'}`}>Week
                            </button>
                            <button
                                onClick={() => this.setCurrentNav('day', moment().startOf('day'), moment().endOf('day'))}
                                className={`btn btn-secondary ${currentNav === 'day' ? 'active' : 'inactive'}`}>Day
                            </button>
                        </div>
                    </div>

                    <div className='col-sm-4 date-control'>
                        <div className={'row'}>
                            <div className={'col-3'}>
                                {leftNav}
                            </div>
                            <div className='col-6 text-center'>
                                <div style={{padding: '5px'}}>
                                    {currentNav === 'week' ?
                                        <span className="nav-title"><Moment
                                            format={dateFormat}>{start}</Moment> - <Moment
                                            format={dateFormat2 || dateFormat}>{end}</Moment></span> :
                                        <span className="nav-title"><Moment format={dateFormat}>{start}</Moment></span>}
                                </div>
                            </div>
                            <div className={'col-3'}>
                                {rightNav}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <br/>
            <div className='row text-center'>
                <div className={'col-sm-12'}>
                    <div className={'expense-range-container card'}>
                        {currentNav === 'week' &&
                        <Week expenses={expenses} start={start} end={end} smallScreen={smallScreen}
                              navCallback={this.navigateTo}
                              incrementPeriod={this.incrementPeriod}/>}
                        {currentNav === 'month' &&
                        <Month expenses={expenses} start={start} end={end} smallScreen={smallScreen}
                               navCallback={this.navigateTo}
                               incrementPeriod={this.incrementPeriod}/>}
                        {currentNav === 'day' &&
                        <Day expenses={expenses} start={start} end={end} smallScreen={smallScreen}
                             navCallback={this.navigateTo}
                             incrementPeriod={this.incrementPeriod}/>}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default MyHabit;