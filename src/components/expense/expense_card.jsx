import React from 'react';
import Moment from 'react-moment';
import Icon from "../common/Icon";
import '../../styles/expense_card.css'

class ExpenseCard extends React.Component {

    render() {
        const {amount, name, date} = this.props.expense;
        return (
            <div className="expense-card card text-center"
                 style={{marginTop: '5px', minHeight: this.props.height || '180px', width: this.props.width}}>
                <a href={this.props.link} style={{textDecoration: 'none'}}>
                    <div className="card-body" style={this.props.padding && {padding: this.props.padding}}>
                        {this.props.showTime &&
                        <p className={'card-text'} style={{fontSize: '.7rem', background: 'lightcyan', padding: '4px', marginBottom: '8px'}}>
                            <Moment format={'h:mm a'}>{date}</Moment>
                        </p>}
                        {this.props.icon ? <Icon path={this.props.icon} /> : null}
                        <p className="card-text" style={{marginBottom: 0, fontSize: '.8rem', color: 'green'}}>
                            ${amount}
                        </p>
                        {!this.props.hideName &&
                        <p className="card-text" style={{fontSize: '.7rem', marginBottom: '4px'}}>{name}</p>}
                    </div>
                </a>
            </div>)
    }

}

export default ExpenseCard;