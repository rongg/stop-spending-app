import React from 'react';
import PiggyBank from "./piggy_bank";

class PiggySummary extends React.Component {

    render() {
        const {amount, predicate, piggyWidth, piggyHeight, avgDaily, numLogged, avgExpense} = this.props;
        return <div>
            <div className="piggy-container">
                <PiggyBank budget={0} spent={0} width={piggyWidth} height={piggyHeight} animate={false}/>
            </div>
                <h4 className={'spent-statement'}><span className='money'>${amount}</span> spent {predicate}
                </h4>

            <div className={'col-sm-10 m-auto'}>
                {numLogged && <h6><span className={'money'}>{numLogged}</span> expense{numLogged > 1 && <span>s</span>} logged</h6>}
                {avgDaily && <h6><span className={'money'}>${avgDaily}</span> / daily avg</h6>}
                {avgExpense && <h6><span className={'money'}>${avgExpense}</span> / avg expense</h6>}
            </div>
        </div>
    }
}

export default PiggySummary;