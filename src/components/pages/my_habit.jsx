import React from 'react';
import habits from '../../services/habits';
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
import PiggySummary from "../common/piggy_summary";
import SimpleBar from "../common/simple_bar";
import MyChart from "../common/my_chart";
import GoalProgress from "../goal/goal_progress";

class MyHabit extends React.Component {
    defaultNav = 'week';
    state = {
        currentNav: this.defaultNav,
        start: moment().startOf(this.defaultNav),
        end: moment().endOf(this.defaultNav),
        smallScreen: ExpenseDateRange.getScreenWidth() <= 576,
        habit: {
            name: '',
            budget: 0,
            budgetType: ''
        },
        expenses: [],
        goalExpenses: [],
        urges: [],
        goals: [],
        currentGoal: null,
        prevGoal: null
    };

    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.loadGoalData = this.loadGoalData.bind(this);
        this.incrementPeriod = this.incrementPeriod.bind(this);
        this.piggyParams = {
            width: 225,
            height: 150
        };
    }


    componentDidMount() {
        sessionStorage.returnPage = '/habit/' + this.props.match.params.id;
        this.loadData();
        this.loadGoalData();
    }

    //  Get Current Goal and Expenses between start/end
    loadGoalData() {
        const habitId = this.props.match.params.id;
        const getGoals = habits.getGoalsForHabit(habitId, {active: true});
        axios.all([getGoals])
            .then(res => {
                const goals = res[0].data;
                this.setState({goals: goals});
                if (goals[0]) {
                    axios.all([expenses.getForHabit(habitId, goals[0].start, goals[0].end)]).then(res => {
                        const goalExpenses = res[0].data;
                        this.setState({goalExpenses: goalExpenses});
                    });
                    this.setState({currentGoal: goals[0]});
                } else {
                    //  Get last active goal
                    axios.all([habits.getGoalsForHabit(habitId, {
                        active: false,
                        start: moment().add(-30, 'days'),
                        end: moment()
                    })])
                        .then(res => {
                            const goals = res[0].data;
                            if (goals && goals[0]) {
                                axios.all([expenses.getForHabit(habitId, goals[0].start, goals[0].end)]).then(res => {
                                    const goalExpenses = res[0].data;
                                    this.setState({goalExpenses: goalExpenses});
                                });
                                this.setState({prevGoal: goals[0]});
                            }
                        });
                }
            });
    }

    //  Get Urges, Expenses, and Habit data for start/end
    loadData() {
        const {start, end} = this.state;
        const habitId = this.props.match.params.id;

        axios.all([habits.getForId(habitId), expenses.getForHabit(habitId, start, end),
            habits.getUrgesForHabit(habitId, start, end)])
            .then(res => {
                this.setState({habit: res[0].data, expenses: res[1].data, urges: res[2].data});
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
        let {name, budget, icon, budgetType} = this.state.habit;
        const _id = this.props.match.params.id;

        const {currentNav, start, end, expenses, smallScreen, urges, goalExpenses} = this.state;
        let {currentGoal, prevGoal} = this.state;
        if (currentGoal && moment().isAfter(moment(currentGoal.end))) {
            currentGoal = null;
        }

        const spent = ExpenseDateRange.sumExpenseAmounts(expenses);

        let dateFormat = 'MMM D';

        urges.sort((u1, u2) => {
            if (moment(u1.date).isBefore(u2.date)) return 1;
            if (moment(u1.date).isAfter(u2.date)) return -1;
            return 0;
        });

        const budgets = ExpenseDateRange.calculateBudgets(budgetType, budget, start);

        const startEndSameMonth = start.isSame(end, 'month');
        let dateFormat2 = startEndSameMonth && currentNav === 'week' ? 'D' : null;

        if (currentNav === 'month') {
            dateFormat = start.isSame(moment(), 'year') ? 'MMMM' : 'MMMM YYYY';
        }
        if (currentNav === 'day') {
            dateFormat = 'dddd MMM D';
        }

        const averages = ExpenseDateRange.getAverages(expenses, start, currentNav);
        let budgetPct = 100, spentPct = Math.round((spent / budgets[currentNav]) * 100);
        if (spentPct > 100) {
            budgetPct = Math.round(budgets[currentNav] / spent * 100);
            spentPct = 100;
        }

        const pace = ExpenseDateRange.calculatePace(averages.projected, budgets[currentNav]);

        const leftNav = <button className='btn btn-default' onClick={() => this.incrementPeriod(-1, currentNav)}><Icon
            path={'app_icons/left.svg'}/></button>;
        const rightNav = <button className='btn btn-default' onClick={() => this.incrementPeriod(1, currentNav)}
                                 style={{float: 'right'}}><Icon path={'app_icons/right.svg'}/></button>;

        if (!budgetType) budgetType = 'week';
        const needExpAmt = ExpenseDateRange.sumExpenseAmounts(expenses.filter(e => e.needWant && e.needWant.toLowerCase() === 'need'));
        const wantExpAmt = ExpenseDateRange.sumExpenseAmounts(expenses.filter(e => e.needWant && e.needWant.toLowerCase() === 'want'));

        let showGoals = currentGoal || prevGoal;
        return <div className="m-auto page my-habit">
            <h2 className={'habit-title'}><Icon path={icon} habit={true}/>
                <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span> <a href={_id + '/edit'}><Icon path={'app_icons/glyph/edit.svg'}/></a></h2>
            <br/>
            <div className={`date-head`}>
                <div className={`date-nav row`}>
                    <div className="col-12 expenses-nav text-left">
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

                    <div className='col-12 date-control'>
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


            <div className="row habit-head section-head" style={{margin: '0'}}>
                <div className={'col-md-5 profile-pic'}>
                    <div className={'card piggy'}>
                        <div className="spent-summary text-center">
                            <PiggySummary isHabit={true} icon={icon} piggyWidth={this.piggyParams.width}
                                          piggyHeight={this.piggyParams.height}
                                          amount={spent}
                                          predicate={ExpenseDateRange.getSpentStatementPredicate(start, currentNav)}
                                          avgDaily={currentNav !== 'day' ? averages.daily : null}
                                          avgExpense={currentNav === 'day' ? averages.expense : null}
                                          numLogged={expenses.length}/>
                        </div>
                    </div>
                    <div className={'b-container'}>
                        <div className={'col-sm-12 text-center actions'}>
                            <a href={_id + '/expense/new'}
                               className="btn btn-block btn-primary btn-default">
                                <div className={'col-sm-12 col-xl-7 col-lg-10 m-auto'}><Icon
                                    path={'app_icons/log.svg'}/>
                                    Log an Expense
                                </div>

                            </a>
                            <a href={_id + '/urge/new'}
                               className="btn btn-block btn-primary btn-default">
                                <div className={'col-sm-12 col-xl-7 col-lg-10 m-auto'}><Icon
                                    path={'app_icons/devil.svg'}/>
                                    Log an Urge
                                </div>
                            </a>
                            <a href={_id + '/goal/new'}
                               className={`${currentGoal && 'disabled'} btn btn-block btn-primary btn-default`}>
                                <div className={'col-sm-12 col-xl-7 col-lg-10 m-auto'}><Icon
                                    path={'app_icons/target.svg'}/>
                                    Set a Goal
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                {!showGoals && <div className={'col-md-7 no-goals'}>
                    <div className={'row'}>
                        <div className={'col-sm-6 budgeted'}>
                            <div className={'card'}>
                                <div className={'card-header'}>
                                    <Icon path={'app_icons/budgeted.svg'}/> <span>Budgeted</span>
                                </div>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-12 text-center'}>
                                            <SimpleBar pct={budgetPct}/>
                                        </div>
                                        <div className={'col-12 text-center'}>
                                            <h4 className={'money'}>${Math.round(budgets[currentNav])}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'col-sm-6 spent'}>
                            <div className={'card'}>
                                <div className={'card-header'}>
                                    <Icon path={'app_icons/dollar_sign.svg'}/> <span>Spent</span>
                                </div>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-12 text-center'}>
                                            <SimpleBar pct={spentPct}/>
                                        </div>
                                        <div className={'col-12 text-center'}>
                                            <h4 className={'money'}>${Math.round(spent)}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className={'row'}>
                        <div className={'col-sm-4 projected'}>
                            <div className={'card'}>
                                <div className={'card-header'}>
                                    <Icon path={'app_icons/graph.svg'}/> <span>Projected</span>
                                </div>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-12 text-center'}>
                                            <Icon path={pace.icon}/>
                                        </div>
                                        <div className={'col-12 text-center'}>
                                            <h4 className={'money'}>${Math.round(averages.projected)}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'col-sm-4 urges'}>
                            <div className={'card'}>
                                <div className={'card-header'}>
                                    <Icon path={'app_icons/devil.svg'}/> <span>Urges</span>
                                </div>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-12 text-center urge-num'}>
                                            {urges.length ? <div>
                                                <h5 className={'money'}>{urges.length}</h5>
                                                <span>Last Urge <Moment
                                                    format={'ddd, MMM Do, h:mm a'}>{urges[0].date}</Moment></span>
                                            </div> : <div>
                                                <Icon path={'app_icons/checkmark.svg'}/>
                                                <h5 style={{marginTop: '24px'}}>No Urges!</h5>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'col-sm-4 need-want'}>
                            <div className={'card'}>
                                <div className={'card-header'}>
                                    <Icon path={'app_icons/angel.svg'}/><span> vs </span><Icon
                                    path={'app_icons/trident.svg'}/>
                                </div>
                                <div className={'card-body'}>
                                    <div className={'row text-center'}>
                                        <MyChart valueKey={'amount'}
                                                 data={[{amount: needExpAmt, name: 'needs'}, {
                                                     amount: wantExpAmt,
                                                     name: 'wants'
                                                 }]}
                                                 type={'pie'}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}


                {showGoals && <div className={'col-md-7 goal'}>
                    <div className={'row'}>
                        <div className={'col-sm-12'}>
                            <div className={'card'}>
                                <div className={'card-header'}>
                                    {!prevGoal &&
                                    <div><Icon path={'app_icons/target.svg'}/> <span>Current Goal</span></div>}
                                    {prevGoal &&
                                    <div><Icon path={'app_icons/target.svg'}/> <span>Last Goal</span></div>}
                                </div>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-12 text-center'}>
                                            {!currentGoal && !prevGoal &&
                                            <div><br/><h5 className={''}>No Goal Set!</h5></div>}
                                            {currentGoal && (currentGoal.type === 'Micro-Budget' || currentGoal.type === 'Beat' || currentGoal.type === 'Abstain') &&
                                            <GoalProgress goal={currentGoal} expenses={goalExpenses}/>}
                                            {prevGoal && (prevGoal.type === 'Micro-Budget' || prevGoal.type === 'Beat' || prevGoal.type === 'Abstain') &&
                                            <div>
                                                <br/>
                                                <GoalProgress goal={prevGoal} expenses={goalExpenses}/>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>}

                {showGoals && <div className={'col-12 key-figures'}>
                    <div className={'row'}>
                        <div className={'col-6 col-sm projected'} style={{paddingLeft: '0px'}}>
                            <div className={'card'}>
                                <div className={'card-header'}>
                                    <Icon path={'app_icons/graph.svg'}/> <span>Projected</span>
                                </div>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-12 text-center'}>
                                            <Icon path={pace.icon}/>
                                        </div>
                                        <div className={'col-12 text-center'}>
                                            <h4 className={'money'}>${Math.round(averages.projected)}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'col-6 col-sm urges'}>
                            <div className={'card'}>
                                <div className={'card-header'}>
                                    <Icon path={'app_icons/devil.svg'}/> <span>Urges</span>
                                </div>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-12 text-center urge-num'}>
                                            {urges.length ? <div>
                                                <h5 className={'money'}>{urges.length}</h5>
                                                <span>Last Urge <Moment
                                                    format={'ddd, MMM Do, h:mm a'}>{urges[0].date}</Moment></span>
                                            </div> : <div>
                                                <Icon path={'app_icons/checkmark.svg'}/>
                                                <h6 style={{marginTop: '20px'}}>No Urges!</h6>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'col-6 col-sm budgeted'}>
                            <div className={'card'}>
                                <div className={'card-header'}>
                                    <Icon path={'app_icons/budgeted.svg'}/> <span>Budgeted</span>
                                </div>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-12 text-center'}>
                                            <SimpleBar pct={budgetPct}/>
                                        </div>
                                        <div className={'col-12 text-center'}>
                                            <h4 className={'money'}>${Math.round(budgets[currentNav])}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'col-6 col-sm spent'}>
                            <div className={'card'}>
                                <div className={'card-header'}>
                                    <Icon path={'app_icons/dollar_sign.svg'}/> <span>Spent</span>
                                </div>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-12 text-center'}>
                                            <SimpleBar pct={spentPct}/>
                                        </div>
                                        <div className={'col-12 text-center'}>
                                            <h4 className={'money'}>${Math.round(spent)}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'col-6 col-sm need-want'}>
                            <div className={'card'}>
                                <div className={'card-header'}>
                                    <Icon path={'app_icons/angel.svg'}/><span> vs </span><Icon
                                    path={'app_icons/trident.svg'}/>
                                </div>
                                <div className={'card-body m-auto'}>
                                    <div className={'row text-center'}>
                                        <MyChart valueKey={'amount'}
                                                 data={[{amount: Math.round(needExpAmt), name: 'needs'}, {
                                                     amount: Math.round(wantExpAmt),
                                                     name: 'wants'
                                                 }]}
                                                 type={'pie'}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>}
            </div>
            <br/>
            <div className={'section-head'}>
                <div className={'col-sm-12'}>
                    < h3> Activity </h3>
                </div>
            </div>

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