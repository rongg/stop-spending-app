import React from 'react';
import Icon from "../common/Icon";
import "../../styles/habit_card.css";
import PiggyBank from "../common/piggy_bank";

class HabitCard extends React.Component {

    render() {
        let {text, iconUrl, link, spent, budgeted, piggy} = this.props;
        return (
            <div className="habit-card card text-center">
                {piggy && <div className={'card-header'}>
                    <span>{text}</span>
                </div>}
                <div className="card-body">

                    <a href={link} style={{textDecoration: 'none'}}>
                        {!piggy && <Icon path={iconUrl}/>}
                        {piggy && <PiggyBank isHabit height={150} width={225} icon={iconUrl}/>}
                        {!piggy && <p className={`habit-name card-text ${text.length > 18 && 'small'}`}>{text}</p>}
                    </a>

                </div>
                {spent !== undefined && budgeted !== undefined ? <div className={'card-footer'}>
                    <div className="footer-text card-text">
                        <span className={`money`}>$ {spent} / {budgeted}</span></div>
                </div> : null}
            </div>)
    }

}

export default HabitCard;