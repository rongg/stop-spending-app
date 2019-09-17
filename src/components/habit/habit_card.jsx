import React from 'react';
import Icon from "../common/Icon";
import "../../styles/habit_card.css";

class HabitCard extends React.Component {

    render() {
        let {text, iconUrl, link, spent, budgeted} = this.props;
        return (
            <div className="habit-card card text-center">
                <a href={link} style={{textDecoration: 'none'}}>
                    <div className="card-body">
                        <Icon path={iconUrl}/>
                        <p className={`habit-name card-text ${text.length > 18 && 'small'}`}>{text}</p>
                        <div className={'card-footer'}>
                            {spent !== undefined && budgeted !== undefined ? <div className="footer-text card-text">
                            <span className={`money`}>$ {spent} / {budgeted}</span></div> : null}
                        </div>
                    </div>
                </a>
            </div>)
    }

}

export default HabitCard;