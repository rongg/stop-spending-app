import React from 'react';
import BudgetBar from './budget_bar';
import IconWithTitle from './icon_with_title';

// const expenses = [
//     {name: 'Fugazi - Repeater', amount: 9},
//     {name: 'NIN - The Fragile', amount: 20},
//     {name: 'Pink Floyd - The Dark Side of the Moon', amount: 15},
//     {name: 'Dinosaur Jr. - Give a Glimpse of What Yer Not', amount: 7}];
//
// const habits = [
//     {name: 'Vinyl Records', expenses: expenses, icon: 'https://cdn1.iconfinder.com/data/icons/audio-2/512/vinylrecord-512.png'},
//     {name: 'Beer', expenses: expenses, icon: 'https://image.flaticon.com/icons/svg/168/168557.svg'},
//     {name: 'Eating Out', expenses: expenses, icon: 'https://blacklabelagency.com/wp-content/uploads/2017/08/money-icon.png'},
//     {name: 'Starbucks', expenses: expenses, icon: 'https://cdn1.iconfinder.com/data/icons/hotel-and-restaurant-flat-3/128/105-512.png'},
//     {name: 'Cigarettes', expenses: expenses, icon: 'https://cdn0.iconfinder.com/data/icons/smoking-1/512/Smoking-09-512.png'}
// ];

const defaultIcon = 'https://blacklabelagency.com/wp-content/uploads/2017/08/money-icon.png';

class BudgetBarGrid extends React.Component {
    state = {
        habits: []
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            habits: nextProps.habits
        });
    }

    render() {
        console.log('render habits', this.state.habits);
        return <div className="container">
            <div className="row mt-2 mb-2">
                <div className="col-sm-12 text-center">

                    {this.state.habits.map((habit, index) => (
                        <div key={"d-"+ index} className="d-inline-block" style={{margin: '10px'}}>
                            <BudgetBar key={index} budget={habit.budget} spent={0} height={200} width={240} />
                            <br/>
                            <IconWithTitle style={iconTitleStyle} key={"i-" + index} title={habit.name} url={habit.icon || defaultIcon} />
                        </div>
                    ))}

                </div>
            </div>
        </div>
    }
}

const iconTitleStyle = {
    marginTop: '4px',
    img: {
        height: '40px',
        width: '40px'
    },
    title:{
        fontSize: '1.5rem',
        marginLeft: '5px',
        verticalAlign: 'middle'
    }
};


export default BudgetBarGrid;
