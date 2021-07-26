import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "react-redux";
import Firebase, { FirebaseContext } from './components/Firebase';
import store from './store';
import { Web3Context, _web3Instance } from './components/Web3/context';
import { MarketContract, MarketContractContext } from './components/Contract/context';

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <Web3Context.Provider value={_web3Instance}>
      <MarketContractContext.Provider value={MarketContract}>
        <Provider store={store}>
          <FirebaseContext.Provider value={new Firebase()}>
            <Router>
              <CssBaseline />
              <App />
            </Router>
          </FirebaseContext.Provider>
        </Provider>
      </MarketContractContext.Provider>
    </Web3Context.Provider>,

  </React.StrictMode>,
  rootElement
);


