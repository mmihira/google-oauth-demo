import * as types from './types';
import makeActionCreator from 'lib/redux/actionCreator';

const exports = {
  setAppDimensions: makeActionCreator(
    types.SET_APP_DIMENSIONS,
    'innerWidth',
    'innerHeight'
  )
};

export default exports;
