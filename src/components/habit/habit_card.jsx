import React from 'react';
import Icon from "../common/Icon";

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
            <div className="card text-center" style={{minHeight: this.props.height || '180px', width: this.props.width}}>
                <a href={link} style={{textDecoration: 'none'}}>
                    <div className="card-body">
                        <Icon path={iconUrl}/>
                        <p className="card-text"
                           style={{marginBottom: 0, fontSize: text.length < 15 ? '1.25rem' : '1.0rem'}}>{text}</p>
                        {footerText ? <p className="card-text"
                                         style={{fontSize: footerText.length < 15 ? '1.0rem' : '.75rem'}}>{footerText}</p> : null}
                    </div>
                </a>
            </div>)
    }

}

export default HabitCard;