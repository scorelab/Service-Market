import {
  Button,
  ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import VisibilityIcon from '@material-ui/icons/Visibility';
import React, { Component, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { WEB3_NOT_FOUND } from '../../constants/errors';
import { MerkleTree } from '../../util/MerkelUtil';
import MainBlock from '../Common/main-block';
import { withFirebase } from '../Firebase';
import { W3Provider } from '../Web3';
import W3Context from '../Web3/context';



class IntClientPage extends Component {

  constructor(props) {
    super(props);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      loading: false,
      clients: [],
      isOpen: false,
      activeItem: null
    };

  }

  handleClickOpen(item) {
    this.setState({ isOpen: true, activeItem: item });
  };

  handleClose() {
    this.setState({ isOpen: false, activeItem: null });
  };

  componentDidMount() {
    if (!this.state.clients.length) {
      this.setState({ loading: true });
    }
    this.onListenForClients();
  }

  onListenForClients = () => {
    this.props.firebase
      .clients()
      .orderByChild('intermediation')
      .equalTo(this.props.authUser.uid)
      .on('value', snapshot => {
        this.setState({ loading: false, clients: snapshot.val() });
      });
  };

  componentWillUnmount() {
    this.props.firebase.intermediaries().off();
  }

  render() {
    const {
      clients,
      loading,
    } = this.state;

    return (
      <MainBlock title="My Clients">
        {loading && <div>Loading ...</div>}

        {clients &&
          <TableContainer component={Paper}>
            <Table aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(clients).map(([k, row]) => (
                  <TableRow key={k}>
                    <TableCell>{row.service}</TableCell>
                    <TableCell align="right">
                      <ButtonGroup variant="text" color="primary" size="large" aria-label="text primary button group">
                        <Button><VisibilityIcon onClick={() => this.handleClickOpen(row)} /></Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>
        }
        {!clients && <div>There are no clients ...</div>}
        <W3Provider>
          <ClaimDialog
            isOpen={this.state.isOpen}
            handleClose={this.handleClose}
            activeItem={this.state.activeItem}
            firebase={this.props.firebase} />
        </W3Provider>
      </MainBlock>
    );
  }
}

const ClaimDialog = (props) => {
  const { isOpen, handleClose, activeItem } = props
  const { web3, claimContract } = useContext(W3Context);

  const [claimIndex, setClaimIndex] = useState("");
  const [claimSecret, setClaimSecret] = useState("");
  const [claimSig, setClaimSig] = useState("");

  const handleClaim = async () => {
    const {
      contractOwner,
      intermediaryIndex,
      serviceIndex,
      tree
    } = activeItem
    const value = tree[intermediaryIndex]["services"][serviceIndex]["data"][1][0][0]
    const expire = tree[intermediaryIndex]["services"][serviceIndex]["data"][1][0][1]

    const mt = new MerkleTree();

    const witness = mt.WW(tree, claimIndex, serviceIndex, intermediaryIndex)
    if (web3) {
      const result = await claimContract(
        contractOwner,
        witness,
        claimSecret,
        value,
        expire,
        claimIndex,
        serviceIndex,
        intermediaryIndex,
        claimSig
      );
      console.log(result);
      const balance = await web3.eth.getBalance(result.from);
      alert("New Balance is",balance);
    } else {
      alert(WEB3_NOT_FOUND);
    }
    handleClose();
  };

  const onChangeSecret = event => {
    setClaimSecret(event.target.value);
  };

  const onChangeIndex = event => {
    setClaimIndex(event.target.value);
  };

  const onChangeSig = event => {
    setClaimSig(event.target.value);
  };

  return (
    <Dialog open={isOpen} maxWidth="lg" aria-labelledby="form-dialog-title">
      <DialogTitle id="dialog">Claim</DialogTitle>
      <DialogContent>
        <TextField
          id="claimIndex"
          label="Index"
          defaultValue={claimIndex}
          onChange={onChangeIndex}
          type="number"
          variant="outlined"
        />
        <TextField
          id="claimSecret"
          label="Secret"
          defaultValue={claimSecret}
          onChange={onChangeSecret}
          variant="outlined"
        />
        <TextField
          id="claimSig"
          label="Signature"
          defaultValue={claimSig}
          onChange={onChangeSig}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClaim} color="primary">
          Claim
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
  ),
)(IntClientPage);
