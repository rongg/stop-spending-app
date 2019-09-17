import React from 'react';
import habits from '../../services/habits';
import HabitCard from "../habit/habit_card";
import Week from "../expense/week";
import Month from "../expense/month";
import Day from "../expense/day";
import ExpenseDateRange from "../expense/expense_date_range";
import moment from "moment";
import expenses from "../../services/expenses";
import axios from "axios";

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
        expenses: []
    };

    constructor(props) {
        super(props);
        this.getExpenses = this.getExpenses.bind(this);
        this.incrementPeriod = this.incrementPeriod.bind(this);
    }


    componentDidMount() {
        sessionStorage.returnPage = '/habit/' + this.props.match.params.id;
        this.getExpenses();
    }


    getExpenses() {
        axios.all([habits.getForId(this.props.match.params.id), expenses.getForHabit(this.props.match.params.id, this.state.start, this.state.end)])
            .then(res => {
                this.setState({habit: res[0].data, expenses: res[1].data})
            });
    }

    setCurrentNav(loc, start, end) {
        this.setState({currentNav: loc, start, end}, () => {
            this.getExpenses();
        });

    }


    incrementPeriod(num, unit) {
        let {start, end} = this.state;
        // if (num > 0 && end.isAfter(moment())) return;    // Don't go into the future
        this.setState({
            start: start.add(num, unit),
            end: end.add(num, unit)
        });
        this.state.habitId ? this.getExpensesForHabit() : this.getExpenses();
    }

    render() {
        let {name, budget, icon, _id, budgetType} = this.state.habit;
        const {currentNav, start, end, expenses, smallScreen} = this.state;

        if (!budgetType) budgetType = 'week';
        return <div className="m-auto page">
            <div className="col-sm-12" style={{margin: '0'}}>
                <HabitCard text={name} iconUrl={icon || habits.getDefaultIcon()} link={'/habit/' + _id + '/edit'}
                           iconHeight='56px'
                           height='148px' class='col-sm-12'
                           key={'habit-card-' + _id} footerText={'$' + budget + ' / ' + budgetType}/>
            </div>
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
            <div className='col-sm-12 text-center'>
                {currentNav === 'week' && <Week expenses={expenses} start={start} end={end} smallScreen={smallScreen}
                                                navCallback={this.navigateTo}
                                                incrementPeriod={this.incrementPeriod}/>}
                {currentNav === 'month' && <Month expenses={expenses} start={start} end={end} smallScreen={smallScreen}
                                                  navCallback={this.navigateTo}
                                                  incrementPeriod={this.incrementPeriod}/>}
                {currentNav === 'day' && <Day expenses={expenses} start={start} end={end} smallScreen={smallScreen}
                                              navCallback={this.navigateTo} incrementPeriod={this.incrementPeriod}/>}
            </div>
        </div>
    }
}

export default MyHabit;