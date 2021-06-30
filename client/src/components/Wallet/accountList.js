import React, { Component } from 'react';
import Select from 'react-select'

class AccountList extends Component {
  state = { accounts: [], isLoading: true };

  onChangeAccount = (val) => {
    this.props.updateActiveAcc(val.value);
  }

  componentDidMount = async () => {
    const accounts = await this.props.web3.eth.getAccounts();
    let list = [];
    for (var i = 0; i < accounts.length; i++) {
      const balance = await this.props.web3.eth.getBalance(accounts[i])
      list.push({
        label: accounts[i] + '--' + balance,
        value: accounts[i]

      });
    }
    this.setState({ accounts: list, isLoading: false });
  };

  render() {
    return (
      <div  >
        <Select
          onChange={this.onChangeAccount}
          options={this.state.accounts}
          isLoading={this.state.isLoading}
        />
      </div>
    );
  }
}

export default AccountList;
