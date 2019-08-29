import React from 'react';
import Moment from 'react-moment';
import Icon from "../common/Icon";
import '../../styles/expense_card.css'

class ExpenseCard extends React.Component {

    render() {
        const {amount, name, date} = this.props.expense;
        const {icon, showTime, link, height, width, padding, hideName} = this.props;

        return (
            <div className="expense-card card text-center"
                 style={{minHeight: height || '180px', width: width}}>
                <a href={link} style={{textDecoration: 'none'}}>
                    <div className="card-body" style={padding && {padding: padding}}>
                        {showTime && date &&
                        <p className={'card-text'}
                           style={{fontSize: '.7rem', background: 'lightcyan', padding: '4px', marginBottom: '8px'}}>
                            <Moment format={'h:mm a'}>{date}</Moment>
                        </p>}
                        {icon ? <Icon path={icon}/> : null}
                        <p className="card-text money">
                            ${amount}
                        </p>
                        {!hideName &&
                        <p className={`card-text expense-name ${name.length > 12 && 'small'}`}>{name}</p>}
                    </div>
                </a>
            </div>)
    }

}

export default ExpenseCard;