import React from 'react';
import PiggyBank from "./piggy_bank";

class PiggySummary extends React.Component {

    render() {
        const {amount, predicate, piggyWidth, piggyHeight} = this.props;
        return <div>
            <div className="piggy-container">
                <PiggyBank budget={0} spent={0} width={piggyWidth} height={piggyHeight} animate={false}/>
            </div>
            <h4 className={'spent-statement'}><span className='money'>$ {amount}</span> spent {predicate}
            </h4>
        </div>
    }
}

export default PiggySummary;