import React from 'react';
import {Pie, Doughnut, Bar} from "react-chartjs-2";

class MyChart extends React.Component {

    render() {
        const {type, data, label, colors, valueKey} = this.props;
        let {height, width} = this.props;


        const myData = {
            labels: data.map(d => d.name),
            datasets: [
                {
                    label,
                    data: data.map(e => e[valueKey]),
                    backgroundColor: colors || data.map(e => MyChart.getUniqueRandomColor()),
                }
            ]
        };


        if (!height) height = 100;
        if (!width) width = 125;

        if (type === 'doughnut') {
            return <Doughnut
                data={myData}
                width={width}
                height={height}/>
        }
        if (type === 'bar') {
            return <Bar
                data={myData}
                width={width}
                height={height}/>
        }

        return <Pie
            data={myData}
            width={width}
            height={height}/>

    }


    static getUniqueRandomColor() {
        const colors = ['#5bca6a',
            '#93ea9f',
            '#a8b451',
            '#ff4162',
            '#e475d5',
            '#a986e6',
            '#e0ab8a',
            '#86e6fe',
            '#ddc75d',
            '#ff7f50',
            '#b5e076',
            '#75d5e4',
            '#e48375'];

        return colors[Math.floor(Math.random() * colors.length)];
    }

}

export default MyChart;