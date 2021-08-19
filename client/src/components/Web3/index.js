import React, { useState, useEffect, useContext } from "react";
import MarketContract from "../../contracts/Market.json";
import getWeb3 from "./getWeb3";
import W3Context from "./context"
import { toBuffer } from "ethereumjs-util";

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
      const balanceEth = web3.utils.fromWei(balance, 'ether');
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
        const balanceEth = w3State.web3.utils.fromWei(balance, 'ether');
        setW3Values({ ...w3State, account: account, balance: balanceEth })
      } else {
        setW3Values({ ...INITIAL_STATE })
      }
    } else {
      setW3Values({ ...INITIAL_STATE })
    }
  }

  const createContract = async (lock, expire, value) => {
    const account = w3State.account;
    const result = await w3State.contract.methods.newContract(lock, expire).send(
      {
        from: account,
        gas: 1000000,
        value: w3State.web3.utils.toWei(value.toString(), "Gwei")
      }
    );
    const index = result.events.NewContract.returnValues.index;
    return { account, index };
  }

  const claimContract = async (owner, index, witness, secret, value, expire, i1, i2, i3) => {
    const account = w3State.account;
    const w1 = witness[1]?witness[1].map(el => '0x'+el.toString('hex')):[];
    const w2 = witness[2]?witness[2].map(el => '0x'+el.toString('hex')):[];
    const w3 = witness[3]?witness[3].map(el => '0x'+el.toString('hex')):[];
    const v1 = w3State.web3.utils.padLeft(w3State.web3.utils.toHex(value), 12).toString()
    const e1 = w3State.web3.utils.padLeft(w3State.web3.utils.toHex(expire), 12).toString()
    await w3State.contract.methods.claim(
      owner, index, w1, w2, w3, secret, v1,e1, i1, i2, i3
    ).send(
      { from: account, gas:4612387}
    ).then((result)=>{
      console.log('result',result);
    }).catch((error)=>{
      console.log("error",error);
    });
  }


  useEffect(() => {
    init()
  }, [])

  return (
    <W3Context.Provider value={{ ...w3State, refresh: refresh, createContract: createContract, claimContract:claimContract }}>
      {children}
    </W3Context.Provider>
  )
}


