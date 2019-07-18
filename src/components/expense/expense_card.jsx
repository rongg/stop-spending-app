import React from 'react';

class ExpenseCard extends React.Component {

    render() {
        const {amount, name} = this.props.expense;

        return (<div className="card text-center" style={{height: this.props.height || '180px', width: this.props.width}}>
            <a href={this.props.link} style={{textDecoration:'none'}}>
                <div className="card-body" style={{padding: this.props.icon ? '1.5rem' : '2.0rem'}}>
                    <p className="card-text" style={{ marginBottom: 0, fontSize: '1.0rem'}}>${amount}</p>
                    <p className="card-text" style={{fontSize: '.9rem', marginBottom: '4px'}}>{name}</p>
                    {this.props.icon ? <img style={{height: '24px'}} src={this.props.icon} alt="$"/> : null}
                </div>
            </a>
        </div>)
    }

}

export default ExpenseCard;