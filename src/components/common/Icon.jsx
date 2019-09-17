import React from 'react';
import '../../styles/icon.css';

class Icon extends React.Component {

    render() {
        let {path} = this.props;
        if(!path) path = 'money_default.svg';
        try {
            return <img className="icon" src={require('../../assets/icons/' + path)} alt={'not found!'}/>;
        }catch(e){
            return <img className="icon" src={require('../../assets/icons/money_default.svg')} alt={'not found!'}/>;
        }
    }

    static getFolderPath(){
        return 'src/assets/icons/';
    }

    static getSVGImage(options, isHabit){
        const {x, y, height, width} = options;
        const file = isHabit ? options.file : 'app_icons/' + options.file;

        return <image x={x} y={y} height={height} width={width} xlinkHref={require('../../assets/icons/' + file)}  />;
    }
}

export default Icon;