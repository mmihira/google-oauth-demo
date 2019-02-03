import * as types from 'actions/types';
import reducerCreator, { DEFAULT } from 'lib/redux/reducerCreator';

const initialData = {
  clientInnerWidth: 0,
  clientInnerHeight: 0
};

const handlers = {
  [types.SET_APP_DIMENSIONS]: (state, action) => ({
    ...state,
    clientInnerWidth: action.innerWidth,
    clientInnerHeight: action.innerHeight
  }),
  [DEFAULT]: state => state
};

export default reducerCreator(initialData, handlers);
