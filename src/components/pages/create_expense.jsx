import React from 'react';
import Form from '../common/form';
import expenses from "../../services/expenses";
import habits from "../../services/habits";
import HabitCard from "../habit/habit_card";
import axios from 'axios';
import moment from "moment";

class CreateExpense extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                userId: props.user._id,
                name: '',
                amount: '',
                habitId: '',
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
        const {name, icon, budget, _id} = this.state.habit;
        let habitOptions = [{_id: '', name: '- select a habit -'}];
        habitOptions = habitOptions.concat(this.state.habits || []);

        return <div className='m-auto page'>
            {_id ? <HabitCard text={name} iconUrl={icon} link={'/habit/' + _id} margin='0' iconHeight='56px'
                       height={name.length < 15 ? '172px' : '148px'}
                       class='col-sm-12'
                       key={'habit-card-' + _id} footerText={'$' + budget + ' / week'}/> : null}
            <div className="form">
                <h2>Log an Expense</h2>
                <form aria-describedby="formHelp">
                    <div className="form-fields">
                        {this.renderInput('amount', 'I Spent', "number", 'amount', true)}
                        {this.renderInput('name', '...on', "text", 'description')}
                        {this.renderSelect(habitOptions, 'habitId', 'Spending Habit')}
                        {this.renderDatePicker('date', 'Date')}
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
                formHelp: 'Success!'
            });
            window.location = expense.habitId ? '/habit/' + expense.habitId : '/expenses';
        }).catch(err => {
            console.log(err.response);
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