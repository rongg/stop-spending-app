import React from 'react';
import Icon from "../common/Icon";
import "../../styles/habit_card.css";
import PiggyBank from "../common/piggy_bank";

class HabitCard extends React.Component {

    render() {
        let {text, iconUrl, link, spent, budgeted, piggy, urgeCount, dateNav} = this.props;
        const max = 10;
        let actualUrgeCount = urgeCount;
        if (urgeCount && urgeCount > max) {
            urgeCount = max;
        }

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

                    {spent !== undefined && !budgeted && <div><span className={'money'}>${spent}</span> spent {dateNav && ' this ' + dateNav}</div>}
                </div>
                {spent !== undefined && budgeted !== undefined ? <div className={'card-footer'}>
                    <div className="footer-text card-text">
                        <span className={`money`}>$ {spent} / {budgeted}</span></div>
                </div> : null}
                {urgeCount !== undefined &&
                <div className={'card-footer text-left'}>{Array.apply(null, Array(urgeCount)).map((u, i) =>
                    <span key={'u-' + i}><Icon path={'app_icons/devil.svg'}/></span>
                )}
                    {actualUrgeCount > max && <span> + {actualUrgeCount - urgeCount} </span>}</div>}
            </div>)
    }

}

export default HabitCard;