import * as types from 'actions/types.js';
import { take, call } from 'redux-saga/effects';
import { isAuthenticated } from 'lib/api/isAuthenticated';

const initApp = function* _initApp () {
  yield take(types.SET_APP_DIMENSIONS);
  const {response, error } = yield call(isAuthenticated);
  if (response) {
    console.warn('AUTH', response);
  } else {
    console.warn('AUTH ERROR', error);
  }
};

export {
  initApp
};

