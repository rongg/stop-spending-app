import React from 'react';


class CurrencyInput extends React.Component {

    state = {
        keys: '',
        keyStack: [],
        value: ''
    };

    handleKeyUp = event => {
        let key = event.key;

        let {keys, keyStack} = this.state;
        let{amount} = this.props;

        if(!keys.length && keyStack.length === 0 && amount){
            //  Generate keys if the amount was already set
            keys = CurrencyInput.keysFromAmount(amount);

        }

        let keyNum = parseInt(key);
        //  Valid if 0-9 or Backspace. First input can't be 0.
        let valid = !isNaN(keyNum) || key === 'Backspace';
        if (keys.length === 0 && key === '0') valid = false;

        if (valid) {
            keyStack.push(key);
            if (key === 'Backspace') {
                keys = keys.slice(0, keys.length - 1);
            } else {
                keys += key;
            }

            this.setState({
                keys
            });

            let amountObj = CurrencyInput.keysToAmount(keys);
            let amount = amountObj.dollars + amountObj.cents / 100;

            this.props.callback(amount);
        }
    };

    handleInput = event => {
        let val = event.target.value;
        let key = val[val.length - 1];
        let {keys, keyStack, value} = this.state;

        let{amount} = this.props;

        if(!keys.length && keyStack.length === 0 && amount){
            //  Generate keys if the amount was already set
            keys = CurrencyInput.keysFromAmount(amount);
            value = amount.toFixed(2) + "";
        }


        let sRep = value.replace('$', '');
        let sRep2 = val.replace('$', '');
        if(sRep2.length < 5 && sRep2[0] === '0') sRep2 = sRep2.slice(1, sRep2.length);
        if(sRep.length > sRep2.length) {
            key = 'Backspace';
        }

        let keyNum = parseInt(key);
        //  Valid if 0-9 or Backspace. First input can't be 0.
        let valid = !isNaN(keyNum) || key === 'Backspace';
        if (keys.length === 0 && key === '0') valid = false;

        if (valid) {
            keyStack.push(key);
            if (key === 'Backspace') {
                keys = keys.slice(0, keys.length - 1);
            } else {
                keys += key;
            }

            this.setState({
                keys
            });


            let amountObj = CurrencyInput.keysToAmount(keys);
            let amount = amountObj.dollars + amountObj.cents / 100;

            this.props.callback(amount);
        }

        this.setState({value: val});
    };

    static keysFromAmount(amount) {
        if(amount <= 0) return "";
        let amtStr = amount.toFixed(2) + "";
        if(amtStr[0] === '0') amtStr = amtStr.slice(1, amtStr.length);  //  remove leading zero
        if(amtStr[0] === '.' && amtStr[1] && amtStr[1] === '0') amtStr = amtStr.slice(2, amtStr.length);    //  remove leading zero after decimal if less than 1
        let keys = "";
        for(let i = 0; i < amtStr.length; i++){

            let c = amtStr[i];
            if(c !== '.'){
                keys += c;
            }
        }

        return keys;
    }

    static keysToAmount(keys) {
        let dollarDisplay = '00';
        let centDisplay = '00';
        if (keys.length === 1) {
            centDisplay = '0' + keys;
        } else if (keys.length === 2) {
            centDisplay = keys;
        } else if(keys.length === 3) {
            dollarDisplay = '0' + keys.slice(0, 1);
            centDisplay = keys.slice(1, keys.length);
        }else if (keys.length !== 0) {
            dollarDisplay = keys.slice(0, keys.length - 2);
            centDisplay = keys.slice(keys.length - 2, keys.length);
        }

        let dollars = parseInt(dollarDisplay);
        let cents = parseInt(centDisplay);

        return {
            dollarDisplay, centDisplay, dollars, cents
        }
    }

    render() {
        let {keys, keyStack} = this.state;
        let {autofocus, amount} = this.props;

        if(!keys && keyStack.length > 0) amount = 0;

        if(!keys) keys = CurrencyInput.keysFromAmount(amount);

        let amountObj = CurrencyInput.keysToAmount(keys);

        let formattedAmount = '$' + amountObj.dollarDisplay + '.' + amountObj.centDisplay;

        return <div>
            <input autoFocus={autofocus}
                   autoComplete={'off'}
                   pattern="[0-9]*"
                   className={'money'}
                   inputMode={"numeric"}
                   onChange={() => {}}
                   onInput={this.handleInput}
                   value={formattedAmount}/>

        </div>;
    }


}

export default CurrencyInput;