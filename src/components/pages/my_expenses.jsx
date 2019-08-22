import React from 'react';
import Week from '../expense/week';
import Month from '../expense/month';
import Day from '../expense/day';
import '../../styles/my_expenses.css';

class MyExpenses extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentNav: this.props.view || 'week',
            start: null,
            end: null
        };
        this.setCurrentNav = this.setCurrentNav.bind(this);
    }

    render() {
        const {currentNav} = this.state;
        return <div className="m-auto page">
            <div className="expenses-nav">
                <button onClick={() => this.setState({currentNav: 'month', start: null, end: null})}
                        className={currentNav === 'month' ? 'active' : 'inactive'}>Month
                </button>
                <button onClick={() => this.setState({currentNav: 'week', start: null, end: null})}
                        className={currentNav === 'week' ? 'active' : 'inactive'}>Week
                </button>
                <button onClick={() => this.setState({currentNav: 'day', start: null, end: null})}
                        className={currentNav === 'day' ? 'active' : 'inactive'}>Day
                </button>
            </div>
            <div>
                {currentNav === 'week' && <Week navCallback={this.setCurrentNav} start={this.state.start} end={this.state.end} />}
                {currentNav === 'month' && <Month navCallback={this.setCurrentNav}/>}
                {currentNav === 'day' && <Day navCallback={this.setCurrentNav} start={this.state.start} end={this.state.end} />}
            </div>
        </div>

    }

    setCurrentNav(loc, start, end) {
        this.setState({currentNav: loc, start, end})
    }

}

export default MyExpenses;