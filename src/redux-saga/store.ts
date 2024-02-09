// store.ts
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import translateReducer, { TranslateState } from "./reducer";
import rootSaga from "./saga";

export interface RootState {
  translate: TranslateState; // Состояние для translateReducer
}

const rootReducer = combineReducers({
  translate: translateReducer,
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
