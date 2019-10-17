import React from 'react';
import Form from '../common/form';
import expenses from "../../services/expenses";
import habits from "../../services/habits";
import HabitCard from "../habit/habit_card";
import axios from 'axios';
import moment from 'moment';
import {Redirect} from "react-router-dom";

class EditExpense extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                _id: '',
                userId: props.user._id,
                name: '',
                amount: '',
                habitId: '',
                needWant: '',
                date: moment().toDate()
            },
            habit: {
                _id: '',
                name: '',
                budget: 0,
                icon: ''
            },
            habits: [],
            errors: {
                userId: null,
                name: null,
                amount: null,
                needWant: null,
                date: null
            },
            formHelp: this.state.formHelp
        };
    }

    componentDidMount() {
        if(this.props.match.params.habitId) {
            axios.all([expenses.getForId(this.props.match.params.id), habits.getForId(this.props.match.params.habitId), habits.get()])
                .then(axios.spread((expenseRes, habitRes, allHabitsRes) => {
                    const expense = expenseRes.data;
                    expense.date = moment(expense.date).local().toDate();
                    delete expense.__v;

                    this.setState({
                        habit: habitRes.data,
                        data: expense,
                        habits: allHabitsRes.data
                    })
                }));
        }else{
            axios.all([expenses.getForId(this.props.match.params.id), habits.get()]).then(res => {
                const expense = res[0].data;
                expense.date = moment(expense.date).local().toDate();
                delete expense.__v;

                this.setState({
                    data: expense,
                    habits: res[1].data
                })
            }).catch(err => {
                console.error(err);
            });
        }
    }

    schema = expenses.schema;

    render() {
        if(this.state.redirectTo){
            return <Redirect to={this.getRedirectLoc(this.state.redirectTo)} />
        }

        const {name, icon, budget, _id} = this.state.habit;
        let habitOptions = [{_id: '', name: '- select a habit -'}];
        habitOptions = habitOptions.concat(this.state.habits || []);

        return <div className='m-auto page'>
            {this.props.match.params.habitId ? <HabitCard text={name} iconUrl={icon} link={'/habit/' + _id} margin='0' iconHeight='56px'
                       height={name.length < 15 ? '172px' : '148px'}
                       class='col-sm-12'
                       key={'habit-card-' + _id} footerText={'$' + budget + ' / week'}/> : null}
            <div className="form">
                <h2>Edit Expense</h2>
                <form aria-describedby="formHelp">
                    <div className="form-fields">
                        {this.renderDollarInput('amount', 'I spent', null, true)}
                        {this.renderInput('name', '...on', 'text', 'description')}
                        {this.renderSelect(habitOptions, 'habitId', 'Spending Habit')}
                        {this.renderRadioGroup('needWant', ['Want', 'Need'], 'This was a...')}
                        {this.renderDatePicker('date', 'Date')}
                    </div>
                    {this.renderButton('Save')}
                    <div className={"form-group"}>
                        {this.renderHelp()}
                    </div>

                    <br/>
                    <a href={'/habit/' + (_id || 'none') + '/expense/' + this.state.data._id + '/delete'}>Delete</a>
                </form>
            </div>
        </div>
    }


    postForm() {
        const expense = this.state.data;
        expenses.update(expense).then(response => {
            this.setState({
                errors: {
                    count: 0
                },
                formHelp: 'Success!',
                redirectTo: expense.habitId ?  '/habit/' + expense.habitId : '/'
            });

        }).catch(err => {
            let helpMessage = 'There was a problem with your submission!';
            if (err.response && err.response.status === 400) {
                const errorDetails = err.response.data.details;
                const error = errorDetails[0];
                this.setState({
                    errors: {
                        count: errorDetails.length,
                        name: error.path[0] === 'name' ? error.message : null,
                        amount: error.path[0] === 'amount' ? error.message : null,
                        date: error.path[0] === 'date' ? error.message : null
                    },
                    formHelp: helpMessage
                })
            } else {
                helpMessage = 'An unexpected problem occurred when submitting the request!';
                this.setState({
                    errors: {
                        count: 1
                    },
                    formHelp: helpMessage
                })

            }
        });
    }
}

export default EditExpense;