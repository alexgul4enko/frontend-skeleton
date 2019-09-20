import 'polyfills' // should be first
import '../styles/index.scss'
import { resources } from 'djangostars/resources'
import persistReducer from 'djangostars/persist'
import { composeReducers, combineReducers } from 'djangostars/redux-helpers'
import thunkMiddleware from 'djangostars/thunk'
import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, compose as reduxCompose } from 'redux'
import { reducer as form } from 'redux-form'
import cacheMiddleware from 'djangostars/cache-middleware'
import { reducers } from 'store'
import * as Sentry from '@sentry/browser'
import createSentryMiddleware from 'redux-sentry-middleware'
import authMiddleware from 'common/session/authMiddleware'
import omit from 'lodash/omit'
import axios from 'axios'
import 'common/utils/transformRequest'

axios.defaults.baseURL = `${window.location.origin}${process.env.API_URL}`
axios.defaults.headers.common['Content-Type'] = 'application/json'

if(process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.SENTRY_ENVIRONMENT })
}


// support for redux dev tools
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose

const store = createStore(
  composeReducers(
    {},
    combineReducers({
      form,
      ...reducers,
    }),
    persistReducer(JSON.parse(process.env.PERSIST_WHITE_LIST)),
    resources,
  ),
  {},
  compose(
    applyMiddleware(...[
      thunkMiddleware(),
      cacheMiddleware({
        storeKey: process.env.STORAGE_KEY,
        cacheKeys: JSON.parse(process.env.CACHE_STATE_KEYS),
        storage: localStorage,
      }),
      authMiddleware,
      process.env.SENTRY_DSN && createSentryMiddleware(Sentry, {
        stateTransformer: (state) => { return omit(state, 'session') },
      }),
    ].filter(Boolean))
  )
)

const history = createBrowserHistory()

export {
  store,
  history,
}
