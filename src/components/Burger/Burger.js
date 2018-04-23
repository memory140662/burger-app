import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
const Burger = (props) => {
    let ingredients = Object.keys(props.ingredients)
            .map(key => [...Array(props.ingredients[key])]
            .map((_, index) => <BurgerIngredient key={key+index} type={key} />))
            .reduce((arr, val) => {
                return arr.concat(val);
            }, []);
    if (ingredients.length === 0) {
        ingredients = <p>Please start add ingredients!</p>
    }
    
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {ingredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default Burger;