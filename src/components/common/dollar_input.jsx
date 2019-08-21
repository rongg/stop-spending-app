import React from 'react';
import '../../styles/currency_input.css';

class DollarInput extends React.Component{
    render(){
        return <div className='currency-input'>
            <div className={`d-inline input-container`}>
                <div className={`d-inline currency`}> $ </div><input name={this.props.name} type='number' autoFocus={this.props.autofocus}
                                                                     placeholder='amount' value={this.props.value} onChange={this.props.onChange} />
            </div>
            {/*{!this.props.hideCents && <div className={'d-inline'}>*/}
                {/*<div className={`d-inline separator`}> . </div> <div className='d-inline input-container'>*/}
                {/*<input className='cents' type='number' min='1' max='99' />  <span>&#162;</span> </div>*/}
            {/*</div>}*/}
        </div>
    }
}

export default DollarInput;