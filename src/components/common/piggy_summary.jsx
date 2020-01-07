import React from 'react';
import PiggyBank from "./piggy_bank";

class PiggySummary extends React.Component {

    render() {
        const {icon, amount, predicate, piggyWidth, piggyHeight, avgDaily, numLogged, avgExpense, isHabit} = this.props;
        return <div>
            <div className="piggy-container">
                <PiggyBank isHabit={isHabit} icon={icon} budget={0} spent={0} width={piggyWidth} height={piggyHeight} animate={false}/>
            </div>
                <h4 className={'spent-statement'} style={{marginTop: '5px'}}><span className='money'>${Math.round(amount)}</span> spent {predicate}
                </h4>

            <div className={'col-sm-10 m-auto'}>
                {numLogged !== undefined && numLogged !== null && <h6><span className={'money'}>{numLogged}</span> expense{(numLogged === 0 || numLogged > 1) && <span>s</span>} logged</h6>}
                {avgDaily !== undefined && avgDaily !== null && <h6><span className={'money'}>${avgDaily}</span> / daily avg</h6>}
                {avgExpense !== undefined && avgExpense !== null && <h6><span className={'money'}>${avgExpense}</span> / avg expense</h6>}
            </div>
        </div>
    }
}

export default PiggySummary;