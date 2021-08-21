import React, { Component, useContext } from "react";
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
import IntermediationPage from './components/Intermediation/intermediations'
import IntClientPage from './components/Intermediation/clients'
import ServiceClientPage from './components/Service/clients'
import AllItemPage from './components/All/all_items'
import "./App.css";
import * as ROUTES from './constants/routes';
import { withAuthentication } from './components/Session';
import Messages from "./components/Messages/Messages";
import { compose } from "redux";
import NewIntermediaryPage from "./components/Intermediation/new-intermediation";
import { W3Provider } from "./components/Web3";
import PasswordForgetPage from "./components/Account/pw-forgot";
import HowItWorksPage from "./components/Static/how_it_works";

class App extends Component {

  render() {

    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{ display: 'flex' }}>
            <TopMenu />
            <SideMenu />
            <Switch>
              <Route exact from={ROUTES.HOME} render={props => <AllItemPage {...props} />} />
              <Route exact from={ROUTES.VIEW_SERVICE} render={props => <ServicePage  {...props} />} />
              <Route exact from={ROUTES.VIEW_INTERMEDIATION} render={props => <IntermediationPage {...props} />} />
              <Route exact from={ROUTES.VIEW_SUBSCRIPTION} render={props => <SubscriptionPage {...props} />} />
              <Route exact from={ROUTES.ADD_SUBSCRIPTION} render={props => <NewSubscriptionPage {...props} />} />
              <Route exact from={ROUTES.ADD_INTERMEDIATION} render={props => <NewIntermediaryPage {...props} />} />
              <Route exact from={ROUTES.VIEW_INT_CLIENTS} render={props => <IntClientPage {...props} />} />
              <Route exact from={ROUTES.VIEW_SERVICE_CLIENTS} render={props => <ServiceClientPage {...props} />} />
              <Route exact from={ROUTES.ADD_SERVICE} render={() => <NewServicePage />} />
              <Route exact from={ROUTES.SIGN_UP} render={props => <SignUpPage {...props} />} />
              <Route exact from={ROUTES.SIGN_IN} render={props => <SignInPage {...props} />} />
              <Route exact from={ROUTES.ACCOUNT} render={props => <AccountPage {...props} />} />
              <Route exact from={ROUTES.NOTIFICATIONS} render={props => <Messages {...props} />} />
              <Route exact from={ROUTES.PASSWORD_FORGET} render={props => <PasswordForgetPage {...props} />} />
              <Route exact from={ROUTES.HOW_IT_WORKS} render={props => <HowItWorksPage {...props}/>} />
            </Switch>
            <Footer />
          </div>
        </ThemeProvider>
      </div>
    );
  }
}


export default compose(
  withAuthentication,
)(App);


