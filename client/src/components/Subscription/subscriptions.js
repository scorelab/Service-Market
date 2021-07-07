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
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';

class SubscriptionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      subscriptions:[],
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
        this.setState({ loading: false, subscriptions:snapshot.val() });
      });
  };

  componentWillUnmount() {
    this.props.firebase.subscriptions().off();
  }


  render() {
    const { subscriptions,loading } = this.state;

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
                    {Object.entries(subscriptions).map(([k,row]) => (
                        <TableRow key={k}>
                            <TableCell>{k}</TableCell>
                            <TableCell align="right">{row.createdAt}</TableCell>
                            <TableCell align="right">{row.status}</TableCell>
                            <TableCell align="right">
                                <ButtonGroup variant="text" color="primary" size="large" aria-label="text primary button group">
                                    <Button><VisibilityIcon /></Button>
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
