import React, { useState, useEffect, useContext } from "react";
import MarketContract from "../../contracts/Market.json";
import getWeb3 from "./getWeb3";
import W3Context from "./context"

const INITIAL_STATE = {
  web3: null,
  contract: null,
  account: null,
  balance: null,
  loading: false,
};

export const W3Provider = ({ children }) => {

  var [w3State, setW3Values] = useState({
    ...INITIAL_STATE
  });

  const init = async () => {
    setW3Values({ ...w3State, loading: true })
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = MarketContract.networks[networkId];
    const contract = new web3.eth.Contract(
      MarketContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      const account = accounts[0];
      const balance = await web3.eth.getBalance(account);
      const balanceEth = web3.utils.toWei(balance, 'ether');
      setW3Values({ loading: false, web3: web3, contract: contract, account: account, balance: balanceEth })
    } else {
      setW3Values({ ...w3State, loading: true })
    }
  }

  const refresh = async () => {
    if (w3State.web3) {
      const accounts = await w3State.web3.eth.getAccounts();
      if (accounts.length > 0) {
        const account = accounts[0];
        const balance = await w3State.web3.eth.getBalance(account);
        const balanceEth = w3State.web3.utils.toWei(balance, 'ether');
        setW3Values({ ...w3State, account: account, balance: balanceEth })
      } else {
        setW3Values({ ...INITIAL_STATE })
      }
    } else {
      setW3Values({ ...INITIAL_STATE })
    }
  }

  const createContract = async (activeItemId) => {
    const lock = '0x100000000000000000000000000000000'
    const expire = 100;
    const value = w3State.web3.utils.toWei("1", "ether");
    const account = w3State.account;
    const result = await w3State.contract.methods.newContract(lock).send(
      {
        from: account,
        gas: 1000000,
        value: value
      }
    );
    const index = result.events.NewContract.returnValues.index;
    return {account,index};
    
    
  }


  useEffect(() => {
    init()
  }, [])

  return (
    <W3Context.Provider value={{ ...w3State, refresh: refresh, createContract: createContract }}>
      {children}
    </W3Context.Provider>
  )
}


