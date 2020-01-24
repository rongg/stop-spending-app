import React from 'react';

function Loader({piggy, className}){

    return (
        <div className={"loader " + className}>
            {!piggy  && <i className="fa fa-cog fa-spin" />}
            {piggy && piggyLoader()}
        </div>
    );


    function piggyLoader() {
        let flip = false;
        let x = 175;
        let y = 85;
        let height = 225;
        let width = 225;
        let x1 = x + width / 2;
        let y1 = y + height / 2;
        let from = "0 " + x1 + " " + y1;
        let to = "360 " + x1 + " " + y1;
        return <svg className={'piggy-bank'} viewBox="0 0 600 400" x="0px" y="0px" width={200} style={{ transform: flip && 'scale(-1,1)'}}
                                    height={100}>

            <path id="pig" style={{stroke: '#ffa6b6', strokeWidth: '6px'}} fill='#ffb3c0'
                  d="M5 185 Q0 225,14 247 Q55 270,95 275 Q100 275,130 325 Q125 370,130 380 Q170 385 ,210 380 Q220 360,225 330 Q275 340,360 328 Q355 360,355 380 Q390 385,430 380 Q435 380,445 290 Q490 250,500 200 Q505 170,505 165 Q525 165,540 150 Q570 155,595 120 Q595 110,585 105 Q570 115,550 125 Q555 70,515 80 Q475 100,512 135 L480 140 Q400 40,250 50 Q225 50,170 65 Q135 20,60 30 Q70 55,118 80 Q60 120,60 160 Q25 170,5 185 Z">
            </path>
            <use clipPath="url(#pinkClip)" href="#pig" fill="pink"/>
            <path id="tail-hole" fill={"#2f2f2f"} d="M530 125 Q515 110,518 100 Q528 95,535 125"/>
            <path id="coin-slot" fill={"#2f2f2f"} strokeWidth="2px" stroke={"#191919"}
                  d="M214 80 Q300 60,370 85 L367 90 Q305 70,215 85 Z"/>
            <ellipse id="eye" fill={"#2f2f2f"} cx="110" cy="130" rx="10" ry="13"/>
            <i className="fa fa-cog fa-spin" />
            <image x={x} y={y} height={height} width={width} xlinkHref={require('../../assets/icons/app_icons/gear_green.svg')} >
                <animateTransform attributeName="transform"
                                  attributeType="XML"
                                  type="rotate"
                                  from={from}
                                  to={to}
                                  dur="2s"
                                  repeatCount="indefinite"/>
            </image>

        </svg>;
    }
}

export default Loader;