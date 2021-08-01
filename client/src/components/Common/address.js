import { IconButton } from '@material-ui/core';
import React, { useContext } from 'react';
import { W3Provider } from '../Web3';
import W3Context from '../Web3/context';
import SyncIcon from '@material-ui/icons/Sync';

const AddressButton = (props) => {
    return (
        <W3Provider>
            <AddressButtonBase setAddress={props.setAddress}/>
        </W3Provider>
    )
}

const AddressButtonBase = (props) => {
    const { account, refresh } = useContext(W3Context);
    return (
      <IconButton aria-label="delete" onClick={()=>props.setAddress(account)}><SyncIcon /></IconButton>
    );
  }


export default  AddressButton;