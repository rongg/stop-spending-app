import React from 'react';
import Form from '../common/form';
import habits from "../../services/habits";
import axios from 'axios';
import moment from "moment";
import {Redirect} from "react-router-dom";
import Icon from "../common/Icon";
import Loader from "../common/loader";

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
                }).finally(() => this.setState({loading: false}));
        } else {
            habits.get().then(res => {
                this.setState({
                    habits: res.data
                })
            }).finally(() => this.setState({loading: false}));
        }
    }


    schema = habits.urgeSchema;

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={this.getRedirectLoc(this.state.redirectTo)}/>
        }
        if (this.state.loading) {
            return <div className='m-auto page'>
                <div className="form">
                    <h2><Icon path={'app_icons/devil.svg'}/> Log an Urge</h2>
                    <form aria-describedby="formHelp">
                        <Loader/>
                    </form>
                </div>
            </div>
        }

        let habitOptions = [{_id: '', name: '- select a habit -'}];
        habitOptions = habitOptions.concat(this.state.habits || []);

        return <div className='m-auto page'>
            <div className="form">
                <h2><Icon path={'app_icons/devil.svg'}/> Log an Urge</h2>
                <form aria-describedby="formHelp">
                    <div className="form-fields">
                        {this.renderSelect(habitOptions, 'habitId', 'I Resisted the Urge to Spend on...', 'Select a Habit!')}
                        {this.renderDatePicker('date', 'On')}
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