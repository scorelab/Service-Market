import React, { useState,useEffect,useContext } from "react";
import MarketContract from "../../contracts/Market.json";
import getWeb3 from "./getWeb3";
import W3Context from "./context"

export const W3Provider  = ({children}) => {

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);

  const init = async () => {
    setLoading(true)
    try {
      const web3 = await getWeb3();
      setWeb3(web3);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MarketContract.networks[networkId];
      const contract = new web3.eth.Contract(
        MarketContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract(contract)
    } catch (error) {
      alert("No web3 connection");
    }
    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <W3Context.Provider value={{ loading, web3:web3, contract:contract }}>
      {children}
    </W3Context.Provider>
  )
}


