import React from 'react';
import '../../styles/currency_input.css';

class DollarInput extends React.Component {
    state = {
        centsActive: false
    };

    render() {
        return <div className='currency-input'>
            <div className={`d-inline input-container`}>
                <div className={`d-inline currency`}> $</div>
                <input name={this.props.name} type='number' autoFocus={this.props.autoFocus}
                       placeholder='amount' value={this.props.value} onChange={this.props.onChange}/>
                {this.props.predicate && <span> {this.props.predicate}</span>}
            </div>
            {this.state.centsActive && <div className={'d-inline'}>
                <div className={`d-inline separator`}> .</div>
                <div className='d-inline input-container'>
                    <input className='cents' type='number' min='1' max='99'/>
                </div>
            </div>}
        </div>
    }
}

export default DollarInput;