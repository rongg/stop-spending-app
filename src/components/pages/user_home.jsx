import React from 'react';
import Week from "../expense/week";
import Month from "../expense/month";
import Day from "../expense/day";
import ExpenseDateRange from "../expense/expense_date_range";
import PiggySummary from "../common/piggy_summary";
import moment from "moment";
import axios from "axios";
import expenses from "../../services/expenses";
import habitService from "../../services/habits";
import HabitCard from "../habit/habit_card";
import "../../styles/user_home.css";
import MyChart from "../common/my_chart";
import ExpenseCard from "../expense/expense_card";
import Moment from "react-moment";
import Icon from "../common/Icon";
import PiggyBank from "../common/piggy_bank";

class UserHome extends React.Component {
    defaultNav = 'week';
    state = {
        currentNav: this.defaultNav,
        start: moment().startOf(this.defaultNav),
        end: moment().endOf(this.defaultNav),
        smallScreen: ExpenseDateRange.getScreenWidth() <= 576,
        expenses: [],
        habits: [],
        filters: {
            splurges: true
        }
    };

    constructor(props) {
        super(props);
        this.setCurrentNav = this.setCurrentNav.bind(this);
        this.incrementPeriod = this.incrementPeriod.bind(this);
        this.getHabitsAndExpenses = this.getHabitsAndExpenses.bind(this);
        this.navigateTo = this.navigateTo.bind(this);
        this.sortExpensesBy = this.sortExpensesBy.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.scrollActive = false;
        this.piggyParams = {
            width: 225,
            height: 150
        };
    }

    componentDidMount() {

        sessionStorage.returnPage = '/';

        this.getHabitsAndExpenses();

        window.addEventListener("resize", e => {
            const screenWidth = ExpenseDateRange.getScreenWidth();
            this.setState({smallScreen: screenWidth <= 576});
        });

        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }


    render() {
        this.sortExpensesBy('desc');
        const {expenses, start, end, smallScreen, currentNav, habits, scrollActive, filters} = this.state;

        for (let i = 0; i < habits.length; i++) {
            habits[i].wantExpAmt = habits[i].expenses.filter(this.filterExp('want')).reduce((acc, e) => acc + e.amount, 0);
            habits[i].needExpAmt = habits[i].expenses.filter(this.filterExp('need')).reduce((acc, e) => acc + e.amount, 0);
        }

        habits.sort((a, b) => {
            if (a.spent > b.spent) return -1;
            if (a.spent < b.spent) return 1;

            return 0;
        });


        const expWants = expenses.filter(this.filterExp('want'));
        const expNeeds = expenses.filter(this.filterExp('need'));

        let worstHabits = [];
        if (habits.length) worstHabits = habits.slice(0, habits.length > 2 ? 3 : habits.length);

        const fHabits = habits.filter(h => h.spent && h.spent > 0);     // with expenses


        habits.map(h => {
            h.budgets = ExpenseDateRange.calculateBudgets(h.budgetType, h.budget, start);
            // if (h.budgetType === 'week') {
            //     h.budgetDay = Math.round(h.budget / 7);
            //     h.budgetMonth = Math.round(h.budgetDay * start.daysInMonth());
            //     h.budgetWeek = Math.round(h.budget);
            // }
            // if (h.budgetType === 'month') {
            //     h.budgetDay = Math.round(h.budget / start.daysInMonth());
            //     h.budgetWeek = Math.round(h.budgetDay * 7);
            //     h.budgetMonth = Math.round(h.budget);
            // }
            // if (h.budgetType === 'day') {
            //     h.budgetWeek = Math.round(h.budget * 7);
            //     h.budgetMonth = Math.round(h.budget * start.daysInMonth());
            //     h.budgetDay = Math.round(h.budget);
            // }
            return h;
        });


        let datePrefix = 'Weekly';
        let dateFormat = 'MMM D';
        // let totalBudgetKey = 'budgetWeek';

        const startEndSameMonth = start.isSame(end, 'month');
        let dateFormat2 = startEndSameMonth && currentNav === 'week' ? 'D' : null;


        if (currentNav === 'month') {
            datePrefix = 'Monthly';
            dateFormat = start.isSame(moment(), 'year') ? 'MMMM' : 'MMMM YYYY';
            // totalBudgetKey = 'budgetMonth';
        }
        if (currentNav === 'day') {
            datePrefix = 'Daily';
            dateFormat = 'dddd MMM D';
            // totalBudgetKey = 'budgetDay';
        }

        let totalBudget = habits.filter(h => h._id).reduce((acc, h) => acc + h.budgets[currentNav], 0);
        let totalSpentHabits = habits.filter(h => h._id).reduce((acc, h) => acc + h.spent, 0);
        let totalSpentOther = habits.filter(h => !h._id).reduce((acc, h) => acc + h.spent, 0);
        let pace = ExpenseDateRange.calculatePace(totalSpentHabits, totalBudget);

        const averages = ExpenseDateRange.getAverages(expenses, start, currentNav);

        const leftNav = <button className='btn btn-default' onClick={() => this.incrementPeriod(-1, currentNav)}><Icon
            path={'app_icons/left.svg'}/></button>;
        const rightNav = <button className='btn btn-default' onClick={() => this.incrementPeriod(1, currentNav)}
                            style={{float: 'right'}}><Icon path={'app_icons/right.svg'}/></button>;


        return <div className="m-auto page">
            <div className={`row ${scrollActive && 'red'}`}>
                <div className='col-sm-12'>
                    <h2 className={'text-left'}>My Spending Summary</h2>
                </div>
            </div>
            <br className={'d-none d-lg-inline'}/>
            <br/>
            <div className={`date-head ${scrollActive && 'fix-top col-sm-12'}`}>
                <div className={`date-nav row`}>
                    <div className="col-12 col-lg-4 expenses-nav text-left">
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

                    <div className='col-12 col-lg-4 date-control'>
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
            <br className={'d-none d-lg-inline'}/>
            <div className={'piggy row d-block d-lg-none'}>
                <div className={'col-12 col-lg-4 '} style={{marginBottom: '10px'}}>
                    <div className={'card piggy'}>
                        <div className="spent-summary text-center">
                            <PiggySummary piggyWidth={this.piggyParams.width} piggyHeight={this.piggyParams.height}
                                          amount={ExpenseDateRange.sumExpenseAmounts(expenses)}
                                          predicate={ExpenseDateRange.getSpentStatementPredicate(start, currentNav)}
                                          avgDaily={currentNav !== 'day' ? averages.daily : null}
                                          avgExpense={currentNav === 'day' ? averages.expense : null}
                                          numLogged={expenses.length}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className={'row actions d-block d-md-none'}>

                <div className={'col-md-4 col-12'} style={{padding: 0}}>
                    <a href={this.state.habitId ? '/habit/' + this.state.habitId + '/expense/new' : '/expense/new'}
                       className="btn btn-block btn-primary btn-default text-left">
                        <div className={'col-10'}>
                            <Icon path={'app_icons/log.svg'}/>
                            Log an Expense
                        </div>
                    </a>

                </div>

                <div className={'col-md-4 col-12'}>
                    <a href={'urge/new'}
                       className="btn btn-block btn-primary btn-default text-left">
                        <div className={'col-10'}>
                            <Icon path={'app_icons/devil.svg'}/>Log an
                            Urge
                        </div>
                    </a>
                </div>

                <div className={'col-md-4 col-12'}>
                    <a href={'goal/new'}
                       className="btn btn-block btn-primary btn-default text-left">
                        <div className={'col-10'}>
                            <Icon path={'app_icons/target.svg'}/>
                            Set a Goal
                        </div>
                    </a>
                </div>
                <br/>
            </div>

            <div className={'piggy row'}>
                <div className="col-lg-4 col-md-6 col-12 goal-summary">
                    <div className={'card'}>
                        <div className={'card-header text-center'}>
                            <Icon path={'app_icons/target.svg'}/>
                            <span>Current Goal</span>
                        </div>
                        <div className={'card-body text-center'}>
                            <Icon path={'alcohol/beer_bottle.svg'}/>
                            <br/>
                            <div className={'statement'}>
                                <span>Abstain</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'d-lg-inline d-none col-lg-4 col-md-6 col-12  card piggy'}>
                    <div className="spent-summary text-center">
                        <PiggySummary piggyWidth={this.piggyParams.width} piggyHeight={this.piggyParams.height}
                                      amount={ExpenseDateRange.sumExpenseAmounts(expenses)}
                                      predicate={ExpenseDateRange.getSpentStatementPredicate(start, currentNav)}
                                      avgDaily={currentNav !== 'day' ? averages.daily : null}
                                      avgExpense={currentNav === 'day' ? averages.expense : null}
                                      numLogged={expenses.length}
                        />
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 urges-summary">
                    <div className={'card'}>
                        <div className={'card-header text-center'}>
                            <Icon path={'app_icons/devil.svg'}/>
                            <span>Worst Habits</span>
                        </div>
                        <div className={'card-body text-center'}>
                            <div className={'row'}>
                                {worstHabits.map((h, index) =>
                                    <div className={'col-4 w-habit'} key={'w-habit-' + index}>
                                        <Icon path={h.icon}/>
                                        <div className={'statement'}>
                                            <div className={'col-12 text-right'}>
                                                <span className={'stat'}><span
                                                    className={'money'}>${Math.round(h.needExpAmt)}</span> <Icon
                                                    path={'app_icons/angel.svg'}/></span><br/>
                                                <span className={'stat'}><span
                                                    className={'money'}>${Math.round(h.wantExpAmt)}</span> <Icon
                                                    path={'app_icons/trident.svg'}/></span><br/>
                                                {h.urges && <span className={'stat'}><span className={'money'}>{h.urges.length}</span> <Icon path={'app_icons/devil.svg'}/></span>}
                                            </div>
                                        </div>
                                    </div>)}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <br/>
            <div className={'row actions text-center d-none d-md-flex'}>

                <div className={'col-sm-4'}>
                    <a href={'goal/new'}
                       className="btn btn-block btn-primary btn-default"><Icon path={'app_icons/target.svg'}/>Set a
                        Goal</a>
                </div>

                <div className={'col-sm-4'} style={{padding: 0}}>
                    <a href={this.state.habitId ? '/habit/' + this.state.habitId + '/expense/new' : '/expense/new'}
                       className="btn btn-block btn-primary btn-default"><Icon path={'app_icons/log.svg'}/>Log an
                        Expense</a>
                </div>
                <div className={'col-sm-4'}>
                    <a href={'urge/new'}
                       className="btn btn-block btn-primary btn-default"><Icon path={'app_icons/devil.svg'}/>Log an
                        Urge</a>
                </div>
            </div>

            <br className={'d-none d-sm-block'}/>

            <div className={'expenses-range-container card'}>
                {currentNav === 'week' &&
                <Week expenses={expenses} start={start} end={end} smallScreen={smallScreen}
                      navCallback={this.navigateTo}
                      incrementPeriod={this.incrementPeriod}/>}
                {currentNav === 'month' &&
                <Month expenses={expenses} start={start} end={end} smallScreen={smallScreen} filters={filters}
                       navCallback={this.navigateTo}
                       incrementPeriod={this.incrementPeriod}/>}
                {currentNav === 'day' && <Day expenses={expenses} start={start} end={end} smallScreen={smallScreen}
                                              navCallback={this.navigateTo}
                                              incrementPeriod={this.incrementPeriod}/>}
            </div>

            <br/>

            <div className={'row habit-statement'}>
                <div className={'col-md-7'}>
                    <div className={'row'}>
                        <div className={'col-sm-12'}>
                            <div className={'card'}>
                                <div className={'row'}>
                                    <div className={'col-md-4 col-3 signal m-auto text-center'}>

                                        <Icon path={pace.icon}/>
                                        <br/>
                                        <span>{pace.message}</span>
                                    </div>
                                    <div className={'col-md-5 col-7 m-auto'}>
                                        <span className={'money'}>${Math.round(totalSpentHabits)}</span> Spent on Habits
                                        <hr/>
                                        <span className={'money'}>${totalBudget}</span> <span>Budgeted</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className={'row'}>
                        <div className="col-sm-6 angel">
                            <ExpenseCard height={148} expense={{
                                name: 'Needs',
                                amount: ExpenseDateRange.sumExpenseAmounts(expNeeds)
                            }} icon={'app_icons/angel.svg'}/>
                        </div>
                        <div className="col-sm-6 devil">
                            <ExpenseCard height={148} expense={{
                                name: 'Wants',
                                amount: ExpenseDateRange.sumExpenseAmounts(expWants)
                            }} icon={'app_icons/trident.svg'}/>
                        </div>
                    </div>
                </div>

                <div className={'col-md-5 unbudgeted'}>
                    <div className={'card'} style={{padding: '0'}}>
                        <div className={'col-sm-12 text-center'} style={{padding: 0}}>
                            <div className={'card-body'}>
                                <PiggyBank height={this.piggyParams.height} width={this.piggyParams.width}
                                           icon={'question_mark.svg'}/>
                                <div className={'statement'}>
                                    <span className={'money'}>${totalSpentOther}</span>
                                    <span> in Unbudgeted Expenses</span>
                                </div>
                            </div>
                            <div className={'card-footer'}>
                                <a href={'habit/new'}
                                   className="btn btn-block btn-primary btn-default"><Icon
                                    path={'money_default.svg'}/>Track
                                    a New
                                    Habit</a>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            <br/>
            <br/>

            <div className='row'>
                <div className='col-sm-12'>
                    <h3>My {datePrefix} Spending Habits</h3>
                </div>
            </div>
            <br/>

            <div className={'row habits col-sm-12'}>
                {habits.filter(h => h._id).map((h, index) => (
                    <div className="col-4 col-lg-2 col-md-6 col-sm-12" key={'habit-card-' + index}>
                        <HabitCard text={h.name}
                                   spent={h.spent}
                                   budgeted={h.budgets[currentNav]}
                                   iconUrl={h.icon || habitService.getDefaultIcon()}
                                   link={'/habit/' + h._id}/>
                    </div>
                ))}
            </div>
            <br/>

            <div className={'row stats'}>
                <div className="col-sm-6">
                    <div className='card chart'>
                        <MyChart type={'bar'} label={datePrefix + ' Expenses ($)'} colors={'#5bca6a'} data={fHabits}
                                 valueKey={'spent'}/>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className='card chart'>
                        <MyChart type={'pie'} label={'Habits'} data={fHabits} valueKey={'spent'}/>
                    </div>
                </div>
            </div>

            <br/>


            <br/>

        </div>;
    }

    filterExp(needWant) {
        return e => e.needWant && e.needWant.toLowerCase() === needWant;
    }

    setCurrentNav(loc, start, end) {
        this.setState({currentNav: loc, start, end}, () => {
            this.getHabitsAndExpenses();
        });

    }

    navigateTo(date, unit) {
        const start = moment(date).startOf(unit);
        const end = moment(date).endOf(unit);
        this.setCurrentNav(unit, start, end);
    }


    sortExpensesBy(direction) {
        if (!this.state.expenses || !this.state.expenses.length) return;

        const compareFn = (a, b) => {
            if (moment(a.date).isBefore(moment(b.date))) {
                return direction === 'desc' ? -1 : 1;
            }
            if (moment(a.date).isAfter(moment(b.date))) {
                return direction === 'desc' ? 1 : -1;
            }
            return 0;
        };


        this.state.expenses.sort(compareFn);
    }


    incrementPeriod(num, unit) {
        let {start, end} = this.state;
        // if (num > 0 && end.isAfter(moment())) return;    // Don't go into the future
        this.setState({
            start: start.add(num, unit),
            end: end.add(num, unit)
        });
        this.getHabitsAndExpenses();
    }

    // Gets all expenses and urges for user in date range, then get habits
    getHabitsAndExpenses() {
        const {start, end} = this.state;

        axios.all([expenses.get(start, end), habitService.getAllUrges(start, end), habitService.get()])
            .then(res => {
                let expenses = res[0].data;
                let urges = res[1].data;
                let habits = res[2].data;

                const unassignedHabit = {
                    _id: '',
                    name: 'other',
                    expenses: [],
                    spent: 0,
                    budget: 0
                };
                habits = habits.map(h => {
                    h.spent = 0;
                    h.expenses = [];
                    h.urges = urges.filter(u => u.habitId === h._id);
                    return h;
                });
                expenses = expenses.map(expense => {

                    if (!expense.habitId) {
                        unassignedHabit.expenses.push(expense);
                        unassignedHabit.spent += expense.amount;
                    } else {
                        for (let i = 0; i < habits.length; i++) {
                            if (habits[i]._id === expense.habitId) {
                                expense.habit = habits[i];
                                habits[i].expenses.push(expense);
                                habits[i].spent += expense.amount;
                                break;
                            }
                        }
                    }

                    expense.date = moment(expense.date).local().toDate();

                    return expense;
                });

                habits.push(unassignedHabit);

                this.setState({
                    expenses,
                    habits
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    handleScroll(e) {
        // console.log('scroll', window.scrollY);
        const scrollActive = window.scrollY > 175;
        if (scrollActive !== this.scrollActive) {
            this.scrollActive = scrollActive;
            this.setState({
                scrollActive
            })
        }
    }
}

export default UserHome;