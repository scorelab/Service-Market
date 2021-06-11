import React, { Component } from 'react';
import Select from 'react-select'
import equal from 'fast-deep-equal'

class AccountViewForm extends Component {
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

class ContractCreateForm extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
  }

  async handleClick(event) {
    event.preventDefault();
    const value = document.getElementById('value').value;;
    const lock = document.getElementById('lock').value;;
    const expire = document.getElementById('expire').value;;
    await this.props.contract.methods.newContract(lock, expire).send({ from: this.props.account, gas: 1000000, value: String(value) });

  }

  render() {
    return (

      <div className="create-form">
        <form>
          <label htmlFor="value">Value</label>
          <input
            className="form-control"
            type="input"
            id="value"
            name="value" />
          <label htmlFor="lock">Lock</label>
          <input
            className="form-control"
            type="input"
            id="lock"
            name="lock" />
          <label htmlFor="expire">Expire</label>
          <input
            className="form-control"
            type="input"
            id="expire"
            name="expire" />
          <button className='btn btn-success' onClick={this.handleClick}>Create</button>
        </form>
      </div>
    );
  }
}

class ContractViewForm extends Component {

  state = { contracts: null };

  componentDidUpdate(prevProp) {
    if (!equal(this.props.account, prevProp.account)) {
      this.set_contracts()
    }
  }

  set_contracts = async () => {
    const count = await this.props.contract.methods.getCount(this.props.account).call();
    var contracts = []
    var i;
    for (i = 0; i < count; i++) {
      const response = await this.props.contract.methods.getContract(this.props.account, i).call();
      contracts.push(response)
    }
    this.setState({ contracts: contracts })
  };


  render() {
    return (
      <div>
        {this.state.contracts && this.state.contracts.map((c, i) => (
          <p key={i}>
            Value : {c[0]},
                  Lock : {c[1]},
                  Expire : {c[2]}
          </p>
        ))}
      </div>
    );
  }
}

export { AccountViewForm, ContractCreateForm, ContractViewForm };