import React from 'react';
class Icon extends React.Component {

    render() {
        let {path} = this.props;
        if(!path) path = 'money_default.svg';

        return <img src={require('../../assets/icons/' + path)} alt={'not found!'}/>;
    }

    static getFolderPath(){
        return 'src/assets/icons/';
    }
}

export default Icon;