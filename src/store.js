import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import root from 'sagas';
import { routerMiddleware } from 'connected-react-router';
import createSagaMonitor from 'lib/sagaMonitor/index.js';
import history from 'history';
import createRootReducer from 'reducers.js';

/**
 * DEV store.
 * Includes support for reduce devtools extension and sagaMonitor
 */
function devStoreVariant () {
  const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose;
  const monitor = createSagaMonitor();
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor: monitor });

  return {
    middleware: composeEnhancers(
      applyMiddleware(sagaMiddleware, routerMiddleware(history))
    ),
    sagaMiddleware
  };
}

/**
 * Prod store
 */
function prodStoreVariant () {
  const sagaMiddleware = createSagaMiddleware();
  return {
    middleware: applyMiddleware(sagaMiddleware, routerMiddleware(history)),
    sagaMiddleware
  };
}

export default function configureStore () {
  const { middleware, sagaMiddleware } =
    process.env.NODE_ENV === 'production'
      ? prodStoreVariant()
      : devStoreVariant();

  const store = createStore(createRootReducer(history), middleware);

  sagaMiddleware.run(root);

  return store;
}
