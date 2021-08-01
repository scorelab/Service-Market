import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "react-redux";
import Firebase, { FirebaseContext } from './components/Firebase';
import store from './store';

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
        <Provider store={store}>
          <FirebaseContext.Provider value={new Firebase()}>
            <Router>
              <CssBaseline />
              <App />
            </Router>
          </FirebaseContext.Provider>
        </Provider>
  </React.StrictMode>,
  rootElement
);


