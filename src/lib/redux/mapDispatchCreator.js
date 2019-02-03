import PropTypes from 'prop-types';

/**
 * Create a dispatcher which simply assumes that all actions are required and all the
 * arguments will be passed in the exact same order
 * @param actions {Object}
 */
const mapDispatchCreator = function mapDispatchCreator (actions) {
  return dispatch => {
    return Object.keys(actions).reduce(
      (acc, key) => ({
        ...acc,
        [key]: (...args) => dispatch(actions[key](...args))
      }),
      {}
    );
  };
};

/**
 * Takes all actions and assigns the function PropType to the
 * actions
 * @param actions {Object}
 */
const propTypeActionCreator = actions => {
  return Object.keys(actions).reduce(
    (acc, key) => ({
      ...acc,
      [key]: PropTypes.func
    }),
    {}
  );
};

export {
  mapDispatchCreator,
  propTypeActionCreator
};
