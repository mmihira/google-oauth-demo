import { all } from 'redux-saga/effects';
import * as sagaFns from './sagas/index.js';

export default function* rootSaga () {
  yield all(Object.values(sagaFns).map(fn => fn()));
}
