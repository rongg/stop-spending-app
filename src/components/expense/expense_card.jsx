import React from 'react';

class ExpenseCard extends React.Component {

    render() {
        const {amount, name} = this.props.expense;
        return (
            <div className="card text-center" style={{marginTop: '5px', minHeight: this.props.height || '180px', width: this.props.width}}>
                <a href={this.props.link} style={{textDecoration: 'none'}}>
                    <div className="card-body" style={this.props.padding && {padding: this.props.padding}}>
                        {this.props.icon ? <img style={{height: '24px'}} src={this.props.icon} alt="$"/> : null}
                        <p className="card-text" style={{marginBottom: 0, fontSize: '.8rem', color: 'darkgreen'}}>
                            ${amount}
                        </p>
                        {!this.props.hideName && <p className="card-text" style={{fontSize: '.7rem', marginBottom: '4px'}}>{name}</p>}
                    </div>
                </a>
            </div>)
    }

}

export default ExpenseCard;