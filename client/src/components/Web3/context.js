import React from "react"
import Web3 from 'web3'

let web3Instance = null

if (typeof window.Web3 !== 'undefined') {
  web3Instance = new Web3(Web3.ethereum)
} else {
  web3Instance = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"))
}
export const _web3Instance = web3Instance
export const Web3Context = React.createContext()