import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import {
    purchaseBurger
} from '../../../store/actions';
import { updateObject, checkValidity } from '../../../shared/utility';

class ContactData extends Component {
    state = { 
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false,
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 5,
                    isNumeric: true
                },
                valid: false,
                touched: false,
            },
            contury: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Contury'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [{
                        value: 'fastest', displayValue: 'Fastest'
                    },{
                        value: 'cheapest', displayValue: 'Cheapest'
                    }]
                },
                valid:true,
                value: 'fastest',
            }
        },
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        const formData = {};

        for (let name in this.state.orderForm) {
            formData[name] = this.state.orderForm[name].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId
        }
        this.props.onOrderBurger(order, this.props.token);
       
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updateOrderElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
            touched: true
        });

        const updateOrderForm = updateObject(this.state.orderForm, { 
            [inputIdentifier]: updateOrderElement
         });

        let formIsValid = true;
        for (let name in updateOrderForm) {
            formIsValid = (!!updateOrderForm[name].valid) && formIsValid;
        }
        this.setState({
            orderForm: updateOrderForm,
            formIsValid
        });
    }

    render() {

        const formElements = [];
        for (let elementName in this.state.orderForm) {
            formElements.push({
                id: elementName,
                config: this.state.orderForm[elementName]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElements.map(element => (
                    <Input 
                        value={element.config.value}
                        elementType={element.config.elementType}
                        elementConfig={element.config.elementConfig}
                        key={element.id}
                        invalid={!element.config.valid}
                        shouldValidate={element.config.validation}
                        touched={element.config.touched}
                        changed={(e) => this.inputChangedHandler(e, element.id)}
                    />
                ))}
                <Button 
                    btnType='Success'
                    disabled={!this.state.formIsValid}
                >ORDER</Button>
            </form>
        );
        if (this.props.loading) {
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
});

const mapDispatchToProps = dispatch => ({
    onOrderBurger: (orderData, token) => dispatch(purchaseBurger(orderData, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));