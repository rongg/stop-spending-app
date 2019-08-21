import React from 'react';
import Form from '../common/form';
import habits from "../../services/habits";

class CreateHabit extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                userId: props.user._id,
                name: '',
                budget: '',
                budgetType: 'week',
                icon: ''
            },
            errors: {
                userId: null,
                name: null,
                budget: null,
                budgetType: null,
                icon: null
            },
            formHelp: this.state.formHelp
        };
    }


    schema = habits.schema;

    render() {
        return <div className="form">
            <h1>Create a Spending Habit</h1>
            <form aria-describedby="formHelp">
                <div className="form-fields">
                    {this.renderInput('name', 'Name', "text", "name",true)}
                    {this.renderIconSelect('icon', 'Icon')}
                    {this.renderDollarInput('budget', 'Budget')}
                    {this.renderRadioGroup('budgetType', ['week', 'month', 'day'], 'Per')}
                </div>
                <br/>
                {this.renderButton('Create')}
                <div className={"form-group"}>
                    {this.renderHelp()}
                </div>
            </form>
        </div>
    }


    postForm() {
        const habit = this.state.data;
        habits.create(habit).then(response => {
            this.setState({
                errors: {
                    count: 0
                },
                formHelp: 'Success!'
            });
            window.location = '/habits';
        }).catch(err => {
            let helpMessage = 'There was a problem with your submission!';
            if (err.response && err.response.status === 400) {
                // Expected errors
                let existingHabitMessage = `A habit with the name "${habit.name}" already exists!`;
                if (err.response.data === existingHabitMessage) {
                    this.setState({
                        errors: {
                            count: 1,
                            name: existingHabitMessage
                        },
                        formHelp: helpMessage
                    });
                    return;
                }

                const errorDetails = err.response.data.details;
                const error = errorDetails[0];
                this.setState({
                    errors: {
                        count: errorDetails.length,
                        name: error.path[0] === 'name' ? error.message : null,
                        email: error.path[0] === 'budget' ? error.message : null,
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

export default CreateHabit;