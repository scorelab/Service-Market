import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import MainBlock from '../Common/main-block';

const NewContractPage = (props,contract) => (
    <MainBlock>
    <ContractCreateForm props={props} contract={contract}/>
  </MainBlock>
);

class ContractCreateForm extends Component {
  constructor(props,contract) {
    super(props)
    console.log(props,contract);
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
export default NewContractPage;