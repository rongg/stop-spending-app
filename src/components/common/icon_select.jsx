import React from 'react';
import habits from "../../services/habits";
import Icon from './Icon';
import '../../styles/icon_picker.css';

class IconSelect extends React.Component {
    state = {
        pickerActive: false
    };

    schema = habits.schema;

    render() {
        const {pickerActive} = this.state;
        const selected = this.props.selected;
        const iconGroups = IconSelect.getIcons();
        return <div>
            <div>
                <div className={`${(selected || pickerActive) && 'gone'}`}>
                    <div className='d-inline-block' onClick={() => {
                        this.setState({pickerActive: true})
                    }}>
                        <Icon path={'app_icons/add.svg'}/>
                    </div>
                </div>
                <div className={`${(!selected || pickerActive) && 'gone'}`}>
                    <div className='d-inline-block' onClick={() => {
                        this.setState({pickerActive: true})
                    }}>
                        <Icon path={selected}/>
                    </div>
                </div>
            </div>
            {pickerActive && <div className="picker-container">
                <h5>Select an Icon for your Spending Habit</h5>
                <div className='picker-list'>
                    {iconGroups.map((group, gIndex) => {
                        return <div className={'icon-group'} key={'cat-' + gIndex}>
                            <div className='category'>
                                <h5>{group.category}</h5>
                            </div>
                            <div className='items'>
                                {group.icons.map((icon, index) =>
                                    <div className={`img-container d-inline-block ${selected === icon && 'selected'}`}
                                         key={'icon-' + gIndex + '-' + index}
                                         onClick={() => {
                                             // this.setState({selected: icon});
                                             this.props.onChange('icon', icon);
                                         }}>
                                        <Icon on path={icon}/>
                                    </div>)}
                            </div>
                        </div>
                    })
                    }
                </div>
                <br/>
                <button disabled={!selected} onClick={() => this.setState({pickerActive: false})}>Confirm
                </button>
                <button onClick={() => this.setState({pickerActive: false})}>Close</button>
            </div>
            }


        </div>
    }

    static getIcons() {
        return [
            {
                category: 'Shopping',
                icons: ['shopping_cart.svg', 'shopping_online_laptop.svg', 'shopping_online_mobile.svg', 'grocery.svg', 'clothes.svg', 'clothes_female.svg',
                    'shoes_sneaker.svg', 'shoes_w.svg', 'jewelry.svg', 'electronics.svg', 'video_game.svg', 'baby3.svg', 'toy.svg'].map(a => 'shopping/' + a)
            },
            {
                category: 'Food / Drink',
                icons: ['food.svg', 'food_social.svg', 'food_menu.svg', 'cafeteria.svg', 'burger.svg', 'fries.svg', 'taco.svg', 'coffee_2.svg', 'coffee.svg', 'water.svg', 'smoothie.svg', 'chocolate.svg',
                    'donut.svg', 'egg.svg', 'lunch.svg', 'ice_cream.svg', 'pizza.svg', 'soda.svg'].map(a => 'food/' + a)
            },
            {
                category: 'Household / Pet',
                icons: ['home.svg', 'pet_cat.svg', 'pet_dog.svg', 'pet_fish.svg'].map(a => 'household/' + a)
            },
            {
                category: 'Car',
                icons: ['car.svg', 'car_garage.svg', 'gas.svg', 'keys.svg', 'sports_car.svg'].map(a => 'car/' + a)
            },
            {
                category: 'Transportation / Travel',
                icons: ['taxi.svg', 'lyft.svg', 'uber.svg', 'flight.svg', 'travel.svg',
                    'travel_car.svg'].map(a => 'transportation/' + a)
            },
            {
                category: 'Activity / Social',
                icons: ['concert.svg', 'movie.svg', 'party.svg', 'ticket.svg', 'couple.svg'].map(a => 'activity/' + a)
            },
            {
                category: 'Personal Care',
                icons: ['haircut.svg', 'makeup.svg', 'nails.svg', 'facial.svg', 'massage.svg',].map(a => 'personal_care/' + a)
            },
            {
                category: 'Alcohol',
                icons: ['beer.svg', 'beer_bottle.svg', 'bottle_glass.svg', 'vodka.svg', 'wine.svg', 'wine_2.svg',
                    'drinking_social.svg', 'drinking_social_female.svg',
                    'drinking_social_male.svg'].map(a => 'alcohol/' + a)
            },
            {
                category: 'Gambling',
                icons: ['chips.svg', 'slots.svg', 'blackjack.svg', 'chip.svg', 'dice.svg', 'poker.svg', 'roulette.svg'].map(a => 'gambling/' + a)
            },
            {
                category: 'Smoking',
                icons: ['cig.svg', 'cig_pack.svg', 'cigar.svg', 'hookah.svg', 'lungs.svg', 'mj.svg', 'mj_pipe.svg',
                    'smoking_man.svg', 'vape.svg'].map(a => 'smoking/' + a)
            },
            {
                category: 'Hobby',
                icons: ['guitar.svg', 'vinyl.svg', 'aquarium.svg', 'books.svg', 'fishing.svg', 'gardening.svg', 'gun.svg',
                    'hunting.svg', 'knitting.svg', 'music.svg', 'photography.svg', 'piano.svg',
                    'plant.svg', 'stamp.svg'].map(a => 'hobby/' + a)
            }
        ]
    }
}

export default IconSelect;