import { put } from 'redux-saga/effects';

import axios from '../../axios-orders';
import {
    setIngredients,
    fetchIngredientsFailed
} from '../actions'

export function* initIngredientsSaga(action) {
    try {
        const res = yield axios.get('/ingredients.json');
        yield put(setIngredients(res.data));
    } catch (e) {
        yield put(fetchIngredientsFailed());
    }
}