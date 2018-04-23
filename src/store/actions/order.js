import * as actionTypes from './actionTypes';

export const purchaseBurgerSuccess = (id, order) => ({
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    order
});

export const purchaseBurgerFail = (error) => ({
    type: actionTypes.FETCH_INGREDIENTS_FAILED,
    error
});

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    }
}

export const purchaseBurger = (order, token) => ({
    type: actionTypes.PURCHASE_BURGER,
    order,
    token
});

export const purchaseInit = () => ({
    type: actionTypes.PURCHASE_INIT
});

export const fetchOrdersSuccess = (orders) => ({
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders
});

export const fetchOrdersFail = (error) => ({
    type: actionTypes.FETCH_ORDERS_FAIL,
    error
});

export const fetchOrdersStart = () => ({
    type: actionTypes.FETCH_ORDERS_START
});

export const fetchOrders = (token, userId) => ({
    type: actionTypes.FETCH_ORDER,
    token,
    userId
});