import React from 'react';

class IconWithTitle extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            url: props.url,
            title: props.title,
            style: props.style
        }
    }

    render(){
        let {style, url, title} = this.state;
        if(!style) style = defaultStyle;

         return <div style={{marginTop: style.marginTop, marginBottom: style.marginBottom}}>
             <img style={style.img} src={url} alt="$" />
            <span style={style.title}>{title}</span>
         </div>
    }
}

const defaultStyle={
    img: {
        height: '32px',
        width: '32px',
    },
    title:{
        fontSize: '1rem',
        marginLeft: '5px'
    }
};


// const iconTitleStyle = {
//     marginTop: '4px',
//     marginBottom: '4px',
//     img: {
//         height: '56px',
//         width: '56px'
//     },
//     title:{
//         fontSize: '2.5rem',
//         marginLeft: '24px',
//         verticalAlign: 'middle'
//     }
// };

export default IconWithTitle;

