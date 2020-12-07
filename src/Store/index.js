import { createStore, applyMiddleware, combineReducers } from "redux";
import reducers from "./Reducers/index";
import thunk from "redux-thunk";
export const store = createStore(combineReducers(reducers), {}, applyMiddleware(thunk));
