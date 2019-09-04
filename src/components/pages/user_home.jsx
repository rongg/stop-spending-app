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

class UserHome extends React.Component {

    state = {
        currentNav: 'week',
        start: moment().startOf('week'),
        end: moment().endOf('week'),
        smallScreen: ExpenseDateRange.getScreenWidth() <= 576,
        expenses: [],
        habits: []
    };

    constructor(props) {
        super(props);
        this.setCurrentNav = this.setCurrentNav.bind(this);
        this.incrementPeriod = this.incrementPeriod.bind(this);
        this.getHabitsAndExpenses = this.getHabitsAndExpenses.bind(this);
        this.navigateTo = this.navigateTo.bind(this);
        this.sortExpensesBy = this.sortExpensesBy.bind(this);
        this.piggyParams = {
            width: 225,
            height: 150
        };
    }

    componentDidMount() {
        this.getHabitsAndExpenses();

        window.addEventListener("resize", e => {
            const screenWidth = ExpenseDateRange.getScreenWidth();
            this.setState({smallScreen: screenWidth <= 576});
        });
    }


    render() {

        this.sortExpensesBy('desc');
        const {expenses, start, end, smallScreen, currentNav, habits} = this.state;
        habits.sort((a, b) => {
            if(a.spent > b.spent) return -1;
            if(a.spent < b.spent) return 1;

            return 0;
        });

        const fHabits = habits.filter(h => h.spent && h.spent > 0);

        let datePrefix = 'Weekly';
        if(currentNav === 'month') datePrefix = 'Monthly';
        if(currentNav === 'day') datePrefix = 'Daily';

        return <div className="m-auto page">
            <h3 className={'text-left'}>My Spending Summary</h3>
            <br/>
            <div className={'row'}>
                <div className="col-sm-5 expenses-nav text-left">
                    <button
                        onClick={() => this.setCurrentNav('month', moment().startOf('month'), moment().endOf('month'))}
                        className={currentNav === 'month' ? 'active' : 'inactive'}>Month
                    </button>
                    <button
                        onClick={() => this.setCurrentNav('week', moment().startOf('week'), moment().endOf('week'))}
                        className={currentNav === 'week' ? 'active' : 'inactive'}>Week
                    </button>
                    <button
                        onClick={() => this.setCurrentNav('day', moment().startOf('day'), moment().endOf('day'))}
                        className={currentNav === 'day' ? 'active' : 'inactive'}>Day
                    </button>
                </div>

            </div>
            <br/>
            <div className={'piggy row'}>
                <div className="col-sm-4 angel">
                    <ExpenseCard height={224} expense={{name: 'Needs', amount: ExpenseDateRange.sumExpenseAmounts(expenses.filter(e => e.needWant && e.needWant.toLowerCase() === 'need'))}} icon={'app_icons/angel.svg'} />
                </div>

                <div className={'col-sm-4 card piggy'}>
                    <div className="spent-summary text-center">
                        <PiggySummary piggyWidth={this.piggyParams.width} piggyHeight={this.piggyParams.height}
                                      amount={ExpenseDateRange.sumExpenseAmounts(expenses)}
                                      predicate={ExpenseDateRange.getSpentStatementPredicate(start, currentNav)}/>
                    </div>
                </div>

                <div className="col-sm-4 devil">
                    <ExpenseCard height={224} expense={{name: 'Wants', amount: ExpenseDateRange.sumExpenseAmounts(expenses.filter(e => e.needWant && e.needWant.toLowerCase() === 'want'))}} icon={'app_icons/devil.svg'} />
                </div>

            </div>
            <br/>

            <div className={'row text-center'}>
                <div className={'col-sm-4'}><a
                    href={'habit/new'}
                    className='link'>Create a Spending Habit</a>
                </div>
                <div className={'col-sm-4'}><a
                    href={this.state.habitId ? '/habit/' + this.state.habitId + '/expense/new' : '/expense/new'}
                    className='link'>Log an Expense</a>
                </div>
                <div className={'col-sm-4'}><a
                    href={'urge/new'}
                    className='link'>Log an Urge</a>
                </div>
            </div>
            <br/>
            <div>
                {currentNav === 'week' && <Week expenses={expenses} start={start} end={end} smallScreen={smallScreen}
                                                navCallback={this.navigateTo}
                                                incrementPeriod={this.incrementPeriod}/>}
                {currentNav === 'month' && <Month expenses={expenses} start={start} end={end} smallScreen={smallScreen}
                                                  navCallback={this.navigateTo}
                                                  incrementPeriod={this.incrementPeriod}/>}
                {currentNav === 'day' && <Day expenses={expenses} start={start} end={end} smallScreen={smallScreen}
                                              navCallback={this.navigateTo} incrementPeriod={this.incrementPeriod}/>}
            </div>

            <br/>
            <br/>
            <h3>My {datePrefix} Spending Habits</h3>
            <br/>
            <div className={'row habits col-sm-12'}>
                {habits.map((habit, index) => (
                    <div className="col-lg-2 col-md-6 col-sm-12" key={'habit-card-' + index}>
                        <HabitCard text={habit.name} iconUrl={habit.icon || habitService.getDefaultIcon()}
                                   link={'/habit/' + habit._id}/>
                    </div>
                ))}
            </div>
            <br/>
            <div className={'row stats'} style={{height: '400px'}}>
                <div className="col-sm-6">
                    <MyChart type={'pie'} label={'Habits'} data={fHabits} valueKey={'spent'}/>
                </div>
                <div className="col-sm-6">
                    <MyChart type={'bar'} label={datePrefix + ' Expenses'} colors={'#5bca6a'} data={fHabits} valueKey={'spent'}/>
                </div>
            </div>
        </div>;
    }

    setCurrentNav(loc, start, end) {
        this.setState({currentNav: loc, start, end}, () => {
            this.getHabitsAndExpenses();
        });

    }

    navigateTo(date, unit) {
        console.log('navigate', date, unit);
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

    //  Gets all expenses for user in date range, then get habits
    getHabitsAndExpenses() {
        const {start, end} = this.state;

        axios.all([expenses.get(start, end), habitService.get()])
            .then(res => {
                let expenses = res[0].data;
                let habits = res[1].data;
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
}

export default UserHome;