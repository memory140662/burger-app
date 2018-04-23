import { put } from 'redux-saga/effects';

import axios from '../../axios-orders';
import {
    purchaseBurgerFail,
    purchaseBurgerStart,
    purchaseBurgerSuccess,
    fetchOrdersFail,
    fetchOrdersStart,
    fetchOrdersSuccess
} from '../actions';

export function* purchaseBurgerSaga({token, order}) {
    yield put(purchaseBurgerStart());
    try {
        const res = yield axios.post(`/orders.json?auth=${token}`, order);
        yield put(purchaseBurgerSuccess(res.data.name, order));
    } catch (err) {
        yield put(purchaseBurgerFail(err));
    }
}

export function* fetchOrdersSaga({token, userId}) {
    yield put(fetchOrdersStart());
    try {
        const res = yield axios.get(`/orders.json?auth=${token}&orderBy="userId"&equalTo="${userId}"`);
        const fetchedOrders = [];
        for (let key in res.data) {
            fetchedOrders.push({
                ...res.data[key],
                id: key
            });
        }
        yield put(fetchOrdersSuccess(fetchedOrders));
    } catch (err) {
        yield put(fetchOrdersFail(err));
    }
}