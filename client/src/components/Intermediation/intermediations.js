import React, { Component, useContext, useEffect, useState } from 'react';
import MainBlock from '../Common/main-block';
import ShowCase from '../Common/grid';
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Select,
  FormLabel,
  FormControlLabel,
  OutlinedInput,
  FormControl,
  InputLabel,
  InputAdornment,
  Box,
  Input,
  Chip,
  MenuItem,
  IconButton,
  Modal,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import moment from 'moment';
import { SERVICE_TYPES } from '../../constants/constants';
import { W3Provider } from '../Web3';
import W3Context from '../Web3/context';



class IntermediationPage extends Component {

  constructor(props) {
    super(props);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      loading: false,
      intermediaries: [],
      isOpen: false,
      activeItemId: null
    };

  }

  handleClickOpen(item) {
    this.setState({ isOpen: true, activeItemId: item });
  };

  handleClose() {
    this.setState({ isOpen: false, activeItemId: null });
  };

  componentDidMount() {
    if (!this.state.intermediaries.length) {
      this.setState({ loading: true });
    }
    this.onListenForIntermediations();
  }

  onListenForIntermediations = () => {
    this.props.firebase
      .intermediaries()
      .orderByChild('createdAt')
      .limitToLast(5)
      .on('value', snapshot => {
        this.setState({ loading: false, intermediaries: snapshot.val() });
      });
  };

  componentWillUnmount() {
    this.props.firebase.intermediaries().off();
  }


  render() {
    const {
      intermediaries,
      loading,
    } = this.state;

    return (
      <MainBlock title="My Intermediations">
        {loading && <div>Loading ...</div>}

        {intermediaries &&
          <TableContainer component={Paper}>
            <Table aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell>Intermediary Name</TableCell>
                  <TableCell align="right">Service Type</TableCell>
                  <TableCell align="right">Fee (%)</TableCell>
                  <TableCell align="right">Created Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(intermediaries).map(([k, row]) => (
                  <TableRow key={k}>
                    <TableCell>{row.intermediaryName}</TableCell>
                    <TableCell align="right">{SERVICE_TYPES[row.intermediaryType]}</TableCell>
                    <TableCell align="right">{row.brokerFee}</TableCell>
                    <TableCell align="right">{moment(row.createdAt).format("DD MMMM YYYY")}</TableCell>
                    <TableCell align="right">
                      <ButtonGroup variant="text" color="primary" size="large" aria-label="text primary button group">
                        <Button><VisibilityIcon onClick={() => this.handleClickOpen(k)} /></Button>
                        <Button><DeleteIcon /></Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>
        }
        {!intermediaries && <div>There are no itermediations ...</div>}
      </MainBlock>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
  ),
)(IntermediationPage);
