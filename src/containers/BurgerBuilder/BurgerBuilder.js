import React from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { addIngredient, removeIngredient, initIngredients, purchaseInit, setAuthRedirectPath } from '../../store/actions';

export class BurgerBuilder extends React.Component {

    state = {
        purchasing: false,
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.ingredients !== this.props.ingredients) {
            this.updatePurchaseState(this.props.ingredients);
        }
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
                .reduce((s, key) => {
                    return s + ingredients[key]
                }, 0);
        return sum > 0;
    }

    purchaseHandle = () => {
        if (this.props.isAuthenticated) {
            this.setState({purchasing: true});
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandle = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandle = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render() {
        const disabledInfo = {
            ...this.props.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;
        let burger = <Spinner />

        if (this.props.error) {
            burger = <p>Ingredients can't be loaded.</p>
        }
        
        if (this.props.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ingredients} />
                    <BuildControls 
                        price={this.props.totalPrice}
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={!this.updatePurchaseState(this.props.ingredients)}
                        ordered={this.purchaseHandle}
                        isAuth={this.props.isAuthenticated}
                    />
                </Aux>
            );

            orderSummary = (
                <OrderSummary 
                    price={this.props.totalPrice}
                    ingredients={this.props.ingredients}
                    purchaseCanceled={this.purchaseCancelHandle}
                    purchaseContinued={this.purchaseContinueHandle}
                />
            );
        }

        return (
            <Aux>
                <Modal 
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandle}
                >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

const mapStateToProps = state => ({
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
});

const mapDispatchToProps = dispatch => ({
    onIngredientAdded: ingredientName => dispatch(addIngredient(ingredientName)),
    onIngredientRemoved: ingredientName => dispatch(removeIngredient(ingredientName)),
    onInitIngredients: () => dispatch(initIngredients()),
    onInitPurchase: () => dispatch(purchaseInit()),
    onSetAuthRedirectPath: path => dispatch(setAuthRedirectPath(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));