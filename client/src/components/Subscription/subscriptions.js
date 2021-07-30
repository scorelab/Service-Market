import React, { Component } from 'react';
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
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import moment from 'moment';
import SubscriptionList from './sub-list';



class SubscriptionPage extends Component {

  constructor(props) {
    super(props);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCreate = this.handleCreate.bind(this);

    this.state = {
      loading: false,
      subscriptions: [],
      subList: [],
      isOpen: false
    };
  }


  componentDidMount() {
    if (!this.state.subscriptions.length) {
      this.setState({ loading: true });
    }
    this.onListenForSubscriptions();
  }

  onListenForSubscriptions = () => {
    this.props.firebase
      .subscriptions()
      .orderByChild('createdAt')
      .limitToLast(5)
      .on('value', snapshot => {
        this.setState({ loading: false, subscriptions: snapshot.val() });
      });
  };

  componentWillUnmount() {
    this.props.firebase.subscriptions().off();
  }

  handleClickOpen(list, item) {
    this.setState({ isOpen: true, subList: list, activeItemId:item });
  };

  handleClose() {
    this.setState({ isOpen: false, subList: [] });
  };

  handleCreate() {
    console.log(this.state.activeItemId);
  };

  render() {
    const {
      subscriptions,
      loading,
      isOpen,
      activeItemName,
      activeItemId,
    } = this.state;

    return (
      <MainBlock title="My Subscriptions">
        {loading && <div>Loading ...</div>}

        {subscriptions &&
          <TableContainer component={Paper}>
            <Table aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell>Subscription ID</TableCell>
                  <TableCell align="right">Created Date</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(subscriptions).map(([k, row]) => (
                  <TableRow key={k}>
                    <TableCell>{k}</TableCell>
                    <TableCell align="right">{moment(row.createdAt).format("DD MMMM YYYY")}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                    <TableCell align="right">
                      <ButtonGroup variant="text" color="primary" size="large" aria-label="text primary button group">
                        <Button><VisibilityIcon onClick={() => this.handleClickOpen(row.subList,k)} /></Button>
                        <Button><LockIcon /></Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>
        }

        {!subscriptions && <div>There are no subscriptions ...</div>}
        <Dialog open={isOpen} aria-labelledby="form-dialog-title">
          <DialogTitle id="dialog">Subscribe</DialogTitle>
          <DialogContent>
            <SubscriptionList subList={this.state.subList} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCreate} color="primary">
              Create Contract
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
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
)(SubscriptionPage);
