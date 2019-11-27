import React from "react";

class Count extends React.Component {
    render() {
        let {target, count} = this.props;
        if(target > 31) target = 31;
        
        const viewBox = {x: 700, y: 400};
        let diagXOffset = 30;
        //  target <= 5
        let pct = {
            startX: .28,
            startY: .1,
            tickSpacing: .15,
            tickHeight: .75,
            tickWidth: .05,
            dTickHeight: 1.32,
            dRotate: 59,
            rowSpacing: .1
        };
        if(target > 5 && target <= 10){
            pct = {
                startX: .12,
                startY: .2,
                tickSpacing: .10,
                tickHeight: .55,
                tickWidth: .034,
                dTickHeight: .85,
                dRotate: 54,
                rowSpacing: .1
            };
        }else if(target > 10 && target <= 15){
            pct = {
                startX: .12,
                startY: .2,
                tickSpacing: .06,
                tickHeight: .55,
                tickWidth: .029,
                dTickHeight: .7,
                dRotate: 42,
                rowSpacing: .1
            };
            diagXOffset = 10;
        }else{
            //  16 and above
            diagXOffset = 10;
            pct = {
                startX: .12,
                startY: .1,
                tickSpacing: .06,
                tickHeight: .35,
                tickWidth: .029,
                dTickHeight: .55,
                dRotate: 56,
                rowSpacing: .425
            };

        }


        let px = {
            rows: 1,
            tickWidth: pct.tickWidth * viewBox.x,
            tickHeight: pct.tickHeight * viewBox.y,
            tickSpacing: pct.tickSpacing * viewBox.x,
            startX: pct.startX * viewBox.x,
            startY: pct.startY * viewBox.y,
            dTickHeight: pct.dTickHeight * viewBox.y,
            dTickRotate: pct.dRotate,
            rowSpacing: pct.rowSpacing * viewBox.y
        };

        let currX = px.startX;
        let currY = px.startY;
        let ticks = [];
        for (let i = 0; i < target; i++) {
            let tick;
            let fill = 'white';
            let stroke = fill;
            let dash = 0;
            if(i >= count) {
                fill = 'none';
                dash = '10 2';
                stroke = 'gainsboro';
            }
            if ((i + 1) % 5 === 0) {
                //  Diagonal
                tick = <rect width={px.tickWidth + "px"} height={px.dTickHeight + "px"}
                             fill={fill}
                             stroke={stroke}
                             strokeDasharray={dash}
                             transform={`translate(${currX - diagXOffset}, ${currY}), rotate(${px.dTickRotate})`}
                             key={'t-d-' + i}/>;
            } else {
                tick = <rect x={currX + 'px'} y={currY + "px"} width={px.tickWidth + "px"}
                             height={px.tickHeight + "px"}
                             stroke={stroke}
                             strokeDasharray={dash}
                             fill={fill} key={'t-' + i}/>;
            }

            ticks.push(
                tick
            );

            currX += px.tickSpacing;


            if((i + 1) % 15 === 0 && (i + 1) < 30){
                currY += px.rowSpacing;
                currX = px.startX;
            }
        }



        let svg = <svg style={{backgroundColor: 'black'}} className={'count-ticks'} viewBox="0 0 700 400" x="0px"
                       y="0px" width="1000px" height="400px">
            {ticks.map((t, i) => {
                //  Draw white ticks
                return t;
            })};
        </svg>;


        return svg;
    }
}

export default Count;