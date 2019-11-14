import React from "react";

class FuelLevel extends React.Component{
    render(){
        let {target, spent} = this.props;
        const spentLeft = target - spent;
        let rotateAngle = Math.round(spentLeft / target * 180 - 90);
        // angles to the 5th degree
        rotateAngle = Math.round(rotateAngle / 5) * 5;

        if(rotateAngle >= 90) rotateAngle = 90;
        if(rotateAngle <= -90) rotateAngle = -90;


        let svg = <svg className={'fuel-level'} viewBox="0 0 700 400"  x="0px" y="0px" width="1000px" height="400px" >
            <text fill="#518945" x="42.25%" y="60%" fontFamily="Georgia" fontSize="175px">$</text>
            <text fill="#518945" x="40" y="390" fontFamily="sans-serif" fontSize="50px">0</text>
            <text fill="#518945" x="600" y="390" fontFamily="sans-serif" fontSize="50px">${target}</text>
            <path stroke="#fff" strokeWidth="5" fill="none" d="M 70,340 C 70,-60 630,-60 630,340"/>
            <rect x="347" y="40" width="7" height="35" fill="#fff" />
            <rect transform="translate(135, 140), rotate(-45)" width="5" height="20" fill="#fff" />
            <rect transform="translate(565, 140), rotate(45)" width="5" height="20" fill="#fff" />
            <rect transform="translate(82, 240), rotate(-65)" width="6" height="25" fill="red" />
            <rect transform="translate(615, 240), rotate(65)" width="5" height="20" fill="#fff" />
            <rect transform="translate(225, 70), rotate(-25)" width="5" height="20" fill="#fff" />
            <rect transform="translate(475, 70), rotate(25)" width="5" height="20" fill="#fff" />

            <line stroke="red" x1="350" y1="340" x2="67" y2="340" strokeWidth="6"/>
            <line stroke="#fff" x1="350" y1="340" x2="632" y2="340" strokeWidth="5"/>

            <path stroke="red" strokeWidth="6" fill="none" d="M 70,340 Q 71,275 85,235"/>
            <path fill="pink" d="M 342,340 L358,340 L353,40 Q 350, -10 347,40" transform={`rotate(${rotateAngle},350,340)`}/>

            <circle r="16" fill="#e595a3" cx="50%" cy="85%" />
        </svg>;


        return svg;
    }
}

export default FuelLevel;