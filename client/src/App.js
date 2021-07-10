import React, { Component } from "react";
import MarketContract from "./contracts/Market.json";
import getWeb3 from "./getWeb3";
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './theme'
import { Route, Switch } from "react-router-dom";
import TopMenu from './components/Common/menu';
import SideMenu from './components/Common/sidemenu';
import Footer from './components/Common/footer';
import NewServicePage from './components/Service/new-service';
import ServicePage from './components/Service/services';
import SignUpPage from './components/Account/signup'
import SignInPage from './components/Account/signin'
import AccountPage from './components/Account/account'
import NewSubscriptionPage from './components/Subscription/new-subscription'
import SubscriptionPage from './components/Subscription/subscriptions'

import "./App.css";
import * as ROUTES from './constants/routes';
import { withAuthentication } from './components/Session';
import Messages from "./components/Messages/Messages";

class App extends Component {
  // state = { loading: true, drizzleState: null };

  // componentDidMount = async () => {
  //   try {
  //     // Get network provider and web3 instance.
  //     const web3 = await getWeb3();

  //     // Get the contract instance.
  //     const networkId = await web3.eth.net.getId();
  //     const deployedNetwork = MarketContract.networks[networkId];
  //     const instance = new web3.eth.Contract(
  //       MarketContract.abi,
  //       deployedNetwork && deployedNetwork.address,
  //     );

  //     const active_account = await web3.eth.getAccounts()[0];

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  render() {
    return (

      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{display: 'flex'}}>
            <TopMenu />
            <SideMenu />
            <Switch>
              <Route exact from={ROUTES.LANDING} render={props => <ServicePage {...props} />} />
              <Route exact from={ROUTES.VIEW_SERVICE} render={props => <ServicePage {...props} />} />
              <Route exact from={ROUTES.VIEW_INTERMEDIATION} render={props => <IntermediationPage {...props} />} />
              <Route exact from={ROUTES.VIEW_SUBSCRIPTION} render={props => <SubscriptionPage {...props} />} />
              <Route exact from={ROUTES.ADD_SUBSCRIPTION} render={props => <NewSubscriptionPage {...props} />} />
              <Route exact from={ROUTES.ADD_INTERMEDIATION} render={props => <NewIntermediaryPage {...props} />} />
              <Route exact from={ROUTES.ADD_SERVICE} render={() => <NewServicePage/>} />
              <Route exact from={ROUTES.SIGN_UP} render={props => <SignUpPage {...props} />} />
              <Route exact from={ROUTES.SIGN_IN} render={props => <SignInPage {...props} />} />
              <Route exact from={ROUTES.ACCOUNT} render={props => <AccountPage {...props} />} />
              <Route exact from={ROUTES.NOTIFICATIONS} render={props => <Messages {...props} />} />
            </Switch>      
            <Footer />
          </div>
        </ThemeProvider>
      </div>
    );
  }
}

export default withAuthentication(App);

