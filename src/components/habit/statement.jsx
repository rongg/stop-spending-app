'use strict';
const e = React.createElement;
class Statement extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            budgeted: props.budgeted,
            spent: props.spent,
            purchases: props.purchases
        }
    }

    render(){
        return <div>
            <h2>${this.state.budgeted} Budgeted</h2><br/>
            <h2>${this.state.spent} Spent</h2><br/>
            <h2>{this.state.purchases} Purchases</h2><br/>
        </div>
    }
}


let rootElem = document.querySelector('#statement-root');
if(rootElem) {
    ReactDOM.render(<Statement budgeted={75} spent={51} purchases={4}/>,
        rootElem);
}