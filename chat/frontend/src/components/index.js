import React from "react";
import { Provider } from "react-redux";
import {
  legacy_createStore as createStore,
  compose,
  applyMiddleware,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";

import authReducer from "../redux-store/reducers/authReducer";
import messageReducer from "../redux-store/reducers/messageReducer";
import chatReducer from "../redux-store/reducers/chatReducer";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import accountReducer from "../redux-store/reducers/accountReducer";

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25,
    })) ||
  compose;

export const store = createStore(
  // authReducer,
  combineReducers({
    auth: authReducer,
    //     // nav: navReducer,
    //     // message: messageReducer,
    chat: chatReducer,
    account: accountReducer,
  }),
  composeEnhancers(applyMiddleware(thunk))
);

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.createRoot(document.getElementById("app")).render(app);
