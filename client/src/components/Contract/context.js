
import React from "react"
import {_web3Instance} from "../Web3/context"
import truffleContract from "@truffle/contract"
import contract from "../../contracts/Market.json"

const contractInstance = truffleContract(contract)
contractInstance.setProvider(_web3Instance.currentProvider)
contractInstance.setNetwork(5777)

export const MarketContract = contractInstance
export const MarketContractContext = React.createContext()