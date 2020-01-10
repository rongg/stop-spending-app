import React from 'react';
import Form from '../common/form';
import expenses from "../../services/expenses";
import habits from "../../services/habits";
import HabitCard from "../habit/habit_card";
import axios from 'axios';
import moment from "moment";
import {Redirect} from "react-router-dom";

class CreateExpense extends Form {
    constructor(props) {
        super(props);
        this.state = {
            redirectTo: false,
            data: {
                userId: props.user._id,
                name: '',
                amount: '',
                habitId: '',
                needWant: 'Want',
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
        let habitId = this.props.match.params.id;
        if(habitId) {
            axios.all([habits.getForId(habitId), habits.get()])
                .then(res => {
                    const data = this.state.data;
                    data.habitId = res[0].data._id;

                    this.setState({
                        habit: res[0].data,
                        habits: res[1].data,
                        data
                    })
                });
        }else{
            habits.get().then(res => {
                this.setState({
                    habits: res.data
                })
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
            <div className="form">
                <h2>Log an Expense</h2>
                <form aria-describedby="formHelp">
                    <div className="form-fields">
                        {this.renderDollarInput('amount', 'I spent', true)}
                        {this.renderInput('name', '...on', "text", 'description')}
                        {this.renderSelect(habitOptions, 'habitId', 'Spending Habit')}
                        {this.renderRadioGroup('needWant', ['Want', 'Need'], 'This was a...')}
                        {this.renderDatePicker('date', 'Date', {})}
                    </div>
                    {this.renderButton('Log It!')}
                    <div className={"form-group"}>
                        {this.renderHelp()}
                    </div>
                </form>
            </div>
        </div>
    }


    postForm() {
        const expense = this.state.data;

        expenses.create(expense).then(response => {
            this.setState({
                errors: {
                    count: 0
                },
                formHelp: 'Success!',
                redirectTo: expense.habitId ? '/habit/' + expense.habitId : '/'
            });
        }).catch(err => {
            let helpMessage = 'There was a problem with your submission!';
            if (err.response && err.response.status === 400 && err.response.data.details) {
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

export default CreateExpense;