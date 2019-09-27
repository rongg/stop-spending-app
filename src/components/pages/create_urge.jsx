import React from 'react';
import Form from '../common/form';
import habits from "../../services/habits";
import axios from 'axios';
import moment from "moment";
import {Redirect} from "react-router-dom";

class CreateUrge extends Form {
    constructor(props) {
        super(props);
        this.state = {
            redirectTo: false,
            data: {
                userId: props.user._id,
                habitId: props.match.params.id,
                date: moment().toDate()
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
            formHelp: this.state.formHelp
        };
    }

    componentDidMount() {
        let habitId = this.props.match.params.id;
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
                });
        } else {
            habits.get().then(res => {
                this.setState({
                    habits: res.data
                })
            });
        }
    }


    schema = habits.urgeSchema;

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={this.getRedirectLoc(this.state.redirectTo)}/>
        }

        let habitOptions = [{_id: '', name: '- select a habit -'}];
        habitOptions = habitOptions.concat(this.state.habits || []);

        return <div className='m-auto page'>
            <div className="form">
                <h2>Log an Urge</h2>
                <form aria-describedby="formHelp">
                    <div className="form-fields">
                        {this.renderSelect(habitOptions, 'habitId', 'Spending Habit', 'Select a Habit!')}
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
        const urge = this.state.data;

        habits.createUrge(urge).then(response => {
            this.setState({
                errors: {
                    count: 0
                },
                formHelp: 'Success!',
                redirectTo: '/habit/' + urge.habitId
            });
        }).catch(err => {
            let helpMessage = 'There was a problem with your submission!';
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

export default CreateUrge;