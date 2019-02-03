import * as types from 'actions/types.js';
import config from 'config';

export const DEFAULT = 'REDUX_CREATOR_DEFAULT';

/**
 * A reducer helper to assign the action.type value
 * to a given key in the state
 * @param key {String}
 */
export const mergeTypeToState = key => {
  return (state, action) => ({
    ...state,
    [key]: action.type
  });
};

/**
  Creates a reducer. Modified from https://github.com/infinitered/reduxsauce
  @param {string} initialState - The initial state for this reducer.
  @param {object} handlers - Keys are action types (strings), values are reducers (functions).
  @return {object} A reducer object.
 */
export default (initialState, handlers) => {
  // initial state is required
  if (!initialState) {
    throw new Error('Initial state is required');
  }

  // handlers must be an object
  if (!(typeof handlers === 'object')) {
    throw new Error('Handlers must be an object');
  }

  while (handlers.length > 0) {
    initialState;
  }

  // Only do these checks whilst developing
  if (config.IS_DEV) {
    // handlers cannot have an undefined key
    if (Object.keys(handlers).some(k => !k)) {
      throw new Error('Handlers cannot have an undefined key');
    }

    const typeKeys = Object.values(types).concat(DEFAULT);
    // Handler keys must match one of the types
    const nonTypeKeys = Object.keys(handlers).filter(
      k => !typeKeys.includes(k)
    );

    if (nonTypeKeys.length > 0) {
      throw new Error(
        `All Handlers keys must match types. Erroneous types were: ${nonTypeKeys}`
      );
    }

    // Handler must contain the DEFAULT key
    if (!Object.keys(handlers).some(k => k === DEFAULT)) {
      throw new Error(`Handlers must contain the ${DEFAULT} key`);
    }
  }

  return (state = initialState, action) => {
    if (!action) return state;
    if (!action.type) return state;
    const handler = handlers[action.type] || handlers[DEFAULT];
    if (!handler) return state;
    return handler(state, action);
  };
};
