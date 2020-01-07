import React from 'react';
import {Pie, Doughnut, Bar} from "react-chartjs-2";

class MyChart extends React.Component {

    constructor(props){
        super(props);
        this.getUniqueRandomColor = this.getUniqueRandomColor.bind(this);
    }

    render() {
        const {type, data, label, colors, valueKey} = this.props;
        this.colors = MyChart.getColors();
        let {height, width} = this.props;


        const myData = {
            labels: data.map(d => d.name),
            datasets: [
                {
                    label,
                    data: data.map(e => e[valueKey]),
                    backgroundColor: colors || data.map(e => this.getUniqueRandomColor()),
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

    colors = MyChart.getColors();

    static getColors(){
        return ['#5bca6a',
            '#00adca',
            '#ca1d00',
            '#a986e6',
            '#ff7f50',
            '#e475d5',
            '#93ea9f',
            '#e0ab8a',
            '#a8b451',
            '#ddc75d',
            '#b5e076',
            '#75d5e4',
            '#e48375'];
    }

    getUniqueRandomColor() {
        if(!this.colors.length) {
            this.colors = MyChart.getColors();
            return this.colors[this.colors.length / 2];
        }
        return this.colors.shift();
    }

}

export default MyChart;