import React from 'react';
import Icon from "../common/Icon";
import "../../styles/habit_card.css";

class HabitCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            iconUrl: props.iconUrl,
            link: props.link,
            footerText: props.footerText
        }
    }

    render() {
        let {text, iconUrl, link, footerText} = this.state;
        return (
            <div className="habit-card card text-center">
                <a href={link} style={{textDecoration: 'none'}}>
                    <div className="card-body">
                        <Icon path={iconUrl}/>
                        <p className={`card-text ${text.length > 18 && 'small'}`}>{text}</p>
                        {footerText ? <p className="card-text">{footerText}</p> : null}
                    </div>
                </a>
            </div>)
    }

}

export default HabitCard;