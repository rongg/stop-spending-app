import React from 'react';
import Form from '../common/form';
import habits from "../../services/habits";
import expenses from "../../services/expenses";
import axios from 'axios';
import moment from "moment";
import {Redirect} from "react-router-dom";
import Icon from "../common/Icon";
import ExpenseDateRange from "../expense/expense_date_range";
import Loader from "../common/loader";

class CreateGoal extends Form {
    minDate = moment().add(1, 'day').startOf('day').toDate();
    defaultType = 'Micro-Budget';
    defaultPeriod = 'custom';
    daysLeftInWeek = 7 - moment().day();
    daysLeftInMonth = moment().daysInMonth() - moment().date();

    schema = habits.goalSchema.main;

    constructor(props) {
        super(props);
        this.state = {
            redirectTo: false,
            wmdExpenses: {week: 0, month: 0, day: 0},
            data: {
                userId: props.user._id,
                habitId: '',
                type: this.defaultType,
                name: '',
                start: moment().toDate(),
                end: this.minDate,
                period: this.defaultPeriod,
                target: ''
            },
            habit: {
                _id: '',
                name: '',
                budget: 0,
                icon: ''
            },
            errors: {
                date: null
            },
            formHelp: this.state.formHelp,
            loading: false
        };
    }

    componentDidMount() {
        let habitId = this.props.match.params.id;
        this.setState({loading: true});
        if (habitId) {
            axios.all([habits.getForId(habitId), habits.get()])
                .then(res => {
                    const data = this.state.data;
                    data.habitId = res[0].data._id;

                    this.setState({
                        habit: res[0].data,
                        habits: res[1].data,
                        data
                    })
                }).finally(() => {
                    this.setState({loading: false});
            });
        } else {
            habits.get().then(res => {
                this.setState({
                    habits: res.data
                })
            }).finally(() => {
                this.setState({loading: false});
            });
        }
    }


    render() {
        if (this.state.redirectTo) {
            return <Redirect to={this.getRedirectLoc(this.state.redirectTo)}/>
        }
        if(this.state.loading){
            return <div className='m-auto page'>
                <div className="form">
                    <h2><Icon path={'app_icons/target.svg'}/> Set a Goal</h2>
                    <form aria-describedby="formHelp">
                        <Loader/>
                    </form>
                </div>
            </div>;
        }

        const {habits} = this.state;

        const {type} = this.state.data;
        const {wmdExpenses} = this.state;

        let habitOptions = [{_id: '', name: '- select a habit -'}];
        habitOptions = habitOptions.concat(habits || []);
        const timeOptions = {
            minDate: this.minDate,
            maxDate: null,
            minTime: this.minDate,
            maxTime: null,
        };

        let periodChoices = ['Week', 'Month', 'Day'];
        if (type === 'Abstain') {
            periodChoices = periodChoices.slice(0, 2);
            periodChoices[0] = {name: 'Week (' + this.daysLeftInWeek + ' days left)', value: 'Week'};
            periodChoices[1] = {name: 'Month (' + this.daysLeftInMonth + ' days left)', value: 'Month'};
        }
        if (type === 'Beat' && wmdExpenses) {
            const weekTotal = ExpenseDateRange.sumExpenseAmounts(wmdExpenses.week);
            const monthTotal = ExpenseDateRange.sumExpenseAmounts(wmdExpenses.month);
            const dayTotal = ExpenseDateRange.sumExpenseAmounts(wmdExpenses.day);
            periodChoices[0] = {name: 'Week - $' + weekTotal, value: 'Week'};
            periodChoices[1] = {name: 'Month - $' + monthTotal, value: 'Month'};
            periodChoices[2] = {name: 'Day - $' + dayTotal, value: 'Day'};
        }

        return <div className='m-auto page'>
            <div className="form">
                <h2><Icon path={'app_icons/target.svg'}/> Set a Goal</h2>
                <form aria-describedby="formHelp">
                    <div className="form-fields">
                        {this.renderInput("name", "Goal Name", "text", "name your goal", true)}
                        {this.renderSelect(habitOptions, 'habitId', 'Habit', 'Select a Habit!', this.onHabitChange.bind(this))}
                        {this.renderRadioGroup('type', ['Micro-Budget', 'Beat', 'Abstain'], 'Goal Type', this.onGoalTypeChange.bind(this))}
                        {type === 'Micro-Budget' && this.renderDollarInput('target', 'Can Spend', null, false)}
                        {type === 'Abstain' && this.renderInput("target", "Collect Total Days of Not Spending", 'number', "days", false, 'half')}
                        {type && type !== 'Micro-Budget' && type !== 'Beat' && this.renderRadioGroup('period', periodChoices, 'Until the End of the', this.onPeriodSet.bind(this))}
                        {type && type === 'Beat' && (this.renderRadioGroup('period', periodChoices, `Spend Less Than Last`, this.onPeriodSet.bind(this)))}
                        {type === 'Micro-Budget' && this.renderDatePicker('end', 'Until', timeOptions)}
                    </div>
                    {this.renderButton('Set It!')}
                    <div className={"form-group"}>
                        {this.renderHelp()}
                    </div>
                </form>
            </div>
        </div>
    }


    postForm() {
        const goal = this.state.data;
        if (goal.type === 'Abstain') goal.start = moment(goal.start).startOf('day');
        habits.createGoal(goal).then(response => {
            this.setState({
                errors: {
                    count: 0
                },
                formHelp: 'Success!',
                redirectTo: '/habit/' + goal.habitId
            });
        }).catch(err => {
            let helpMessage = 'There was a problem with your submission!';
            console.log(err.response);
            if (err.response && err.response.status === 400 && err.response.data.details) {
                const errorDetails = err.response.data.details;
                const error = errorDetails[0];
                this.setState({
                    errors: {
                        count: errorDetails.length,
                        date: error.path[0] === 'date' ? error.message : null
                    },
                    formHelp: helpMessage
                })
            } else {
                helpMessage = 'An unexpected problem occurred when submitting the request!';
                if (err.response && err.response.data) helpMessage = err.response.data;
                this.setState({
                    errors: {
                        count: 1
                    },
                    formHelp: helpMessage
                })

            }
        });
    }

    onPeriodSet() {
        const {wmdExpenses, data} = this.state;
        const {period, type} = data;
        switch (type) {
            case 'Beat':
                data.end = moment().endOf(period.toLowerCase()).toDate();
                data.target = ExpenseDateRange.sumExpenseAmounts(wmdExpenses[period.toLowerCase()]);
                if (data.target < 1) data.target = 1;
                this.setState({
                    data
                });
                break;
            case 'Abstain':
                data.end = moment().endOf(period.toLowerCase()).toDate();
                this.setState({
                    data
                });
                if (type === 'Abstain') {
                    const maxDays = (period === 'Month') ? this.daysLeftInMonth : this.daysLeftInWeek;
                    this.schema = habits.goalSchema.abstain(maxDays);
                }
                break;
            default:
                return;
        }
    }

    onHabitChange() {
        if (this.state.data.type === 'Beat') this.getExpenses();
    }

    onGoalTypeChange() {
        let {data} = this.state;
        data.target = '';

        switch (data.type) {
            case 'Beat':
                this.schema = habits.goalSchema.main;
                this.getExpenses();
                data.period = '';
                break;
            case 'Abstain':
                data.period = '';
                break;
            case 'Micro-Budget':
                this.schema = habits.goalSchema.main;
                data.period = 'custom';
                data.end = this.minDate;
                break;
            default:
                return;
        }

        this.setState({data});
    }

    getExpenses() {
        const end = moment();
        const start = moment().add('month', -1).startOf('month');
        //  Get expenses from now till the beginning of last month
        const habitId = this.state.data.habitId;
        axios.all([expenses.getForHabit(habitId, start, end)])
            .then(res => {
                let expenses = res[0].data;
                this.setState({
                    wmdExpenses: ExpenseDateRange.splitExpenses(expenses)
                });
            })
    }
}

export default CreateGoal;