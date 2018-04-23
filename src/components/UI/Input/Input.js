import React from 'react';

import classes from './Input.css';

const Input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    }
    switch(props.elementType) {
        case 'input':
            inputElement = <input 
                onChange={props.changed}
                className={inputClasses.join(' ')} 
                {...props.elementConfig} 
                value={props.value}/>;
            break;
        case 'textarea':
            inputElement = <textarea 
                onChange={props.changed}
                className={inputClasses.join(' ')} 
                {...props.elementConfig} 
                value={props.value}/>;
            break;
        case 'select':
            inputElement = (
                <select 
                    className={inputClasses.join(' ')} 
                    value={props.value}
                    onChange={props.changed}
                >
                    {props.elementConfig.options.map(option => (
                        <option 
                            key={option.value} 
                            value={option.value}
                        >
                            {option.displayValue}
                        </option>
                    ))}
                </select>
            );
            break;
        default:
            inputElement = <input 
                onChange={props.changed}
                className={inputClasses.join(' ')} 
                {...props.elementConfig} 
                value={props.value}/>;
    }

    let validationError = null;

    if (props.invalid && props.touched) {
        validationError = <p className={classes.ValidationError}
                >
                    {props.errorMessage && props.errorMessage.trim().length > 0 ? 
                        props.errorMessage: 'Please enter a valid value!'
                    }
                </p>
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
            {validationError}
        </div>
    );
}

export default Input;