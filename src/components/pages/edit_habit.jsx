import React from 'react';
import Form from '../common/form';
import habits from "../../services/habits";
import Icon from "../common/Icon";
import Loader from "../common/loader";

class EditHabit extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                _id: '',
                userId: props.user._id,
                name: '',
                budget: '',
                budgetType: '',
                icon: ''
            },
            errors: {
                userId: null,
                name: null,
                budget: null,
                budgetType: null,
                icon: null
            },
            formHelp: this.state.formHelp,
            loading: false
        };
    }

    componentDidMount() {
        this.setState({loading: true});
        habits.getForId(this.props.match.params.id).then(res => {
            delete res.data.__v;
            this.setState({
                data: res.data
            });
        }).catch(err => {
            console.error(err);
        }).finally(() => this.setState({loading: false}));
    }

    schema = habits.schema;

    render() {
        if(this.state.loading){
            return <div className='m-auto page'>
                <div className="form">
                    <h2><Icon path={'app_icons/dollar_sign.svg'} /> Edit Spending Habit</h2>
                    <form aria-describedby="formHelp">
                        <Loader/>
                    </form>
                </div>
            </div>;
        }
        return <div className="form">
            <h2><Icon path={'app_icons/dollar_sign.svg'} /> Edit Spending Habit</h2>
            <form aria-describedby="formHelp">
                <div className="form-fields">
                    {this.renderInput('name', 'Name', "text", "name",true)}
                    {this.renderIconSelect('icon', 'Icon')}
                    {this.renderDollarInput('budget', 'Budget')}
                    {this.renderRadioGroup('budgetType', ['week', 'month', 'day'], 'Per')}
                </div>
                {this.renderButton('Save')}
                <div className={"form-group"}>
                    {this.renderHelp()}
                </div>
                <br/>
                <button type={'button'} className={'btn btn-link'} onClick={e => {
                    if(window.confirm('Delete this Habit?')) window.location = '/habit/' + this.props.match.params.id + '/delete';
                }}>Delete</button>
            </form>
        </div>
    }


    postForm() {
        const habit = this.state.data;
        habits.update(habit).then(response => {
            this.setState({
                errors: {
                    count: 0
                },
                formHelp: 'Success!'
            });

            window.location = '/habit/' + response.data._id;
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

export default EditHabit;