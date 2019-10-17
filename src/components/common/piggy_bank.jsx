import React from 'react';
import Icon from '../common/Icon';

class PiggyBank extends React.Component {

    render() {
        let {icon, isHabit, outline} = this.props;

        if(!icon && icon !== null) {
            isHabit = false;
            icon = 'dollar_sign.svg';
        }

        const p = PiggyBank.getSVGParams(this.props.budget || 1, this.props.spent || 0, this.props.width, this.props.height);
        return <svg className={'piggy-bank'} viewBox="0 0 600 400" x="0px" y="0px" width={p.width}
                    height={p.height}>

            <path id="pig" style={{stroke: '#ffa6b6', strokeWidth: '6px'}} fill='#ffb3c0'
                  d="M5 185 Q0 225,14 247 Q55 270,95 275 Q100 275,130 325 Q125 370,130 380 Q170 385 ,210 380 Q220 360,225 330 Q275 340,360 328 Q355 360,355 380 Q390 385,430 380 Q435 380,445 290 Q490 250,500 200 Q505 170,505 165 Q525 165,540 150 Q570 155,595 120 Q595 110,585 105 Q570 115,550 125 Q555 70,515 80 Q475 100,512 135 L480 140 Q400 40,250 50 Q225 50,170 65 Q135 20,60 30 Q70 55,118 80 Q60 120,60 160 Q25 170,5 185 Z">
            </path>
            {/*<use clipPath="url(#greenRemClip)" href="#pig" fill="#85BB65"/>*/}
            <use clipPath="url(#pinkClip)" href="#pig" fill="pink"/>
            <path id="tail-hole" fill={outline || "#2f2f2f"} d="M530 125 Q515 110,518 100 Q528 95,535 125"/>
            <path id="coin-slot" fill={outline || "#2f2f2f"} strokeWidth="2px" stroke={outline || "#191919"}
                  d="M214 80 Q300 60,370 85 L367 90 Q305 70,215 85 Z"/>
            <ellipse id="eye" fill={outline || "#2f2f2f"} cx="110" cy="130" rx="10" ry="13"/>
            {/*<text fill="#518945" x="235" y="255" fontFamily="Georgia" fontSize="175px">$</text>*/}
            {icon && Icon.getSVGImage({file: icon, x: '210', y: '125', height: '150', width: '150'}, isHabit)}
            <clipPath id="pinkClip">
                <rect y={0} height={p.spentHeightPct} width="100%">
                    {this.props.animate ?
                        <animate attributeName="height" attributeType="XML" from="29%" to="50%" begin="1s" dur="6s"
                                 fill="freeze"/> : null}
                </rect>
            </clipPath>
            <clipPath id="greenClip">
                <rect y={p.spentHeightPct} height={p.budgetRemHeightPct} width="100%"/>
            </clipPath>
        </svg>;
    }

    static getSVGParams(budget, spent, svgWidth, svgHeight) {

        let scale = 1;
        if (budget <= 25) {
            scale *= 14;
        } else if (budget <= 50) {
            scale *= 8;
        } else if (budget <= 75) {
            scale *= 6;
        } else if (budget <= 100) {
            scale *= 4;
        } else if (budget <= 200) {
            scale *= 1.75;
        } else if (budget <= 500) {
            scale *= .7;
        } else if (budget <= 1000) {
            scale *= .35;
        }

        //  Scale graph height for over budget case
        const rem = budget - spent;
        if (rem <= -100) scale *= .125;
        else if (rem <= -50) scale *= .25;
        else if (rem <= -25) scale *= .5;
        else if (rem <= -5) scale *= .65;
        if (budget >= 100 && rem <= -25) {
            scale *= 2;
            if (budget >= 200 && rem <= -100) scale *= 2;
        }

        const budgetRemDim = (budget - spent) * scale;
        const viewBoxHeight = 500;
        const viewBoxWidth = 400;
        const barWidth = 400;

        //  positions
        const xStart = viewBoxWidth / 2 - barWidth / 2;
        const y1 = 0;
        const y2 = rem / budget * viewBoxHeight;

        //  colors
        let budgetLeftBG = '#81D8AE';
        let budgetBG = '#42C486';
        let budgetRemStroke = 'darkgreen';

        let viewBox = "0 0 " + viewBoxWidth + " " + viewBoxHeight;
        const leftInBudget = budget - spent;
        const warningRangePct = .10;


        const brOffset = 55;
        let spentRect, budgetRect, budgetRem;

        if (leftInBudget > (warningRangePct * budget)) {
            //  under budget
            spentRect = {
                x: xStart,
                y: y2,
                fill: budgetBG,
                width: barWidth,
                height: viewBoxHeight - y2
            };

            budgetRect = {
                x: xStart,
                y: y1,
                fill: budgetLeftBG,
                stroke: budgetRemStroke,
                width: barWidth,
                height: y2
            };

            budgetRem = {
                text: "$" + (budget - spent) + " left",
                x: xStart + barWidth / 2 - brOffset,
                y: y2 / 2 + 5
            };

        } else if (leftInBudget >= 0) {
            //  Warning range
            budgetLeftBG = 'lightgreen';
            budgetRemStroke = 'red';
            let showBudget = true;
            if (budgetRemDim < 15) {
                if (budgetRemDim === 0) {
                    showBudget = false;
                }
            }
            spentRect = {
                x: xStart,
                y: y2,
                fill: budgetBG,
                width: barWidth,
                height: viewBoxHeight - y2
            };

            if (showBudget) {
                budgetRect = {
                    x: xStart,
                    y: 0,
                    fill: budgetLeftBG,
                    stroke: budgetRemStroke,
                    width: barWidth,
                    height: y2
                };
            }

            /*  Left to Spend   */
            let heightLeft = y2 / 2 + 10;
            if (heightLeft < 25) heightLeft = 30;

            budgetRem = {
                text: "$" + (budget - spent) + " left",
                fill: 'red',
                x: xStart + barWidth / 2 - brOffset,
                y: heightLeft
            };
        } else {
            //  Over budget
            spentRect = {
                x: xStart,
                y: 0,
                fill: 'salmon',
                stroke: 'red',
                width: barWidth,
                height: viewBoxHeight
            };

            budgetRect = {
                x: xStart,
                y: 0,
                fill: 'lightsalmon',
                width: barWidth,
                height: 0
            };

            /*  Left to Spend   */
            budgetRem = {
                text: "$" + Math.abs(budget - spent) + " over!",
                x: xStart + barWidth / 2 - brOffset,
                y: 25
            };

        }
        const spentHeightPct = spent * 100 / (budget);

        return {
            viewBox: viewBox,
            height: svgHeight,
            width: svgWidth,
            background: '#f5f5f5',
            spentRect: spentRect,
            budgetRect: budgetRect,
            budgetRem: budgetRem,
            fontSize: '28px',
            spentHeightPct: spentHeightPct + '%',
            budgetRemHeightPct: 100 - spentHeightPct + '%'
        };

    }

}

export default PiggyBank;

// let rootElem = document.querySelector('#piggy-bank-root');
// if (rootElem) {
//     ReactDOM.render(<PiggyBank budget={75} spent={33} height={300} width={450} animate={true}/>,
//         rootElem);
// }
