import React from 'react';
import Week from '../expense/week';
import Month from '../expense/month';
import '../../styles/my_expenses.css';

class MyExpenses extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            currentNav: 'month'
        }
    }

    render() {
        const {currentNav} = this.state;
        return <div className="m-auto page">
            <div className="expenses-nav">
                <button onClick={() => this.setState({currentNav:'month'})} className={currentNav === 'month' ? 'active' : 'inactive'}>Month</button>
                <button onClick={() => this.setState({currentNav:'week'})} className={currentNav === 'week' ? 'active' : 'inactive'}>Week</button>
            </div>
            <div>
                {currentNav === 'week' && <Week/>}
                {currentNav === 'month' && <Month/>}
            </div>
        </div>

    }

}

export default MyExpenses;