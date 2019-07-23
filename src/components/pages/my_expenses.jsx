import React from 'react';
import Week from '../expense/week';

class MyExpenses extends React.Component {


    render() {
        return <div className="m-auto page">
            <div className="text-center">
                <h1>My Expenses</h1>
                <a href='/expense/new'>Create New</a>
                <br/><br/>
            </div>
            <br/>
            <Week />
        </div>

    }

}

export default MyExpenses;