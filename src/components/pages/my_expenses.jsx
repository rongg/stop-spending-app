import React from 'react';
import Week from '../expense/week';
import Month from '../expense/month';
import '../../styles/my_expenses.css';

class MyExpenses extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentNav: this.props.view || 'month',
            start: null,
            end: null
        };
        this.setCurrentNav = this.setCurrentNav.bind(this);
    }

    render() {
        const {currentNav} = this.state;
        return <div className="m-auto page">
            <div className="expenses-nav">
                <button onClick={() => this.setState({currentNav: 'month'})}
                        className={currentNav === 'month' ? 'active' : 'inactive'}>Month
                </button>
                <button onClick={() => this.setState({currentNav: 'week'})}
                        className={currentNav === 'week' ? 'active' : 'inactive'}>Week
                </button>
            </div>
            <div>
                {currentNav === 'week' && <Week start={this.state.start} end={this.state.end}/>}
                {currentNav === 'month' && <Month navCallback={this.setCurrentNav}/>}
            </div>
        </div>

    }

    setCurrentNav(loc, start, end) {
        console.log('set current nav', loc, start, end);
        this.setState({currentNav: loc, start, end})
    }

}

export default MyExpenses;