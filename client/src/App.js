import React, { Component } from "react";
import MarketContract from "./contracts/Market.json";
import getWeb3 from "./getWeb3";
import { AccountViewForm, ContractCreateForm, ContractViewForm } from "./components/Views";
import Home from './pages/Home';
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './Theme'

import "./App.css";

class App extends Component {
  // state = { activeAcc: null, web3: null, accounts: null, contract: null };

  // updateActiveAcc = (acc) => {
  //   this.setState({ activeAcc: acc });
  // }

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

  //     const accounts = await web3.eth.getAccounts();

  //     // Set web3 and contract to the state, and then proceed with an
  //     // example of interacting with the contract's methods.
  //     this.setState({activeAcc:accounts[0], web3: web3, contract: instance });
  //   } catch (error) {
  //     // Catch any errors for any of the above operations.
  //     alert(
  //       `Failed to load web3, accounts, or contract. Check console for details.`,
  //     );
  //     console.error(error);
  //   }
  // };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (

      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Home/>
        </ThemeProvider>

        {/* <AccountViewForm
          web3={this.state.web3}
          account={this.state.activeAcc}
          updateActiveAcc={this.updateActiveAcc}

        />
        <ContractViewForm
          contract={this.state.contract}
          account={this.state.activeAcc}
        />
        <ContractCreateForm
          contract={this.state.contract}
          account={this.state.activeAcc}
        /> */}
      </div>
    );
  }
}

export default App;
