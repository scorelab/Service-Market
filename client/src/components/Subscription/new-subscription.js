import React, { Component, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import * as ERRORS from '../../constants/errors';
import MainBlock from '../Common/main-block';
import 'firebase/firestore';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
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
import { makeStyles, withStyles } from '@material-ui/core/styles';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";
import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import SubscriptionList from './sub-list';

function NewSubscriptionPage(props) {
  return (
    <MainBlock title={"New Subscription"}>
      <NewSubscriptionForm />
    </MainBlock>
  )
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  datepicker: {
    padding: 0.5,
    border: 1,
    borderColor: "silver",
    borderRadius: "3px",

  },
}));

const INITIAL_ITEM_STATE = {
  serviceId: '',
  startDate: moment(),
  endDate: moment().add(7, 'days'),
}


class SubscriptionItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_ITEM_STATE };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onClick = (event) => {
    this.props.updateItem(this.state);
    this.setState({ serviceId: '' });
  }

  render() {
    const {
      serviceId,
      startDate,
      endDate,
      focusedInput,
    } = this.state;

    const isInvalid =
      serviceId === '';

    return (
      <Grid container spacing={4} >
        <Grid item xs={5}>
          <FormControl variant="outlined" fullWidth >
            <InputLabel htmlFor="subscriptionType">Service</InputLabel>
            <Select
              id="serviceId"
              name="serviceId"
              value={serviceId}
              onChange={this.onChange}
              placeholder="Service"
              label="Service"
            >
              <option value="" disabled></option>
              {Object.entries(this.props.services).map(([k, v], i) => {
                return <option key={k} value={k}>{v.serviceName}</option>;
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          <Box display="flex" borderRadius={3} padding={0.5} border={1} borderColor="silver">
            <FormControlLabel
              control={
                <DateRangePicker
                  noBorder={true}
                  id="subscriptionDuration"
                  name="subscriptionDuration"
                  openDirection="down"
                  startDate={startDate}
                  startDateId="startData"
                  endDate={endDate}
                  endDateId="endDate"
                  onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
                  focusedInput={focusedInput}
                  onFocusChange={focusedInput => this.setState({ focusedInput })}
                />
              }
              label="Duration"
              labelPlacement="start"
              style={{ color: "gray" }}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box display="flex" padding={1}>
            <Button onClick={this.onClick} disabled={isInvalid} fullWidth variant="contained" color="primary" >Add</Button>
          </Box>
        </Grid>
      </Grid>
    )

  }
}

const INITIAL_STATE = {
  subList: [],
  services: [],
  error: null,
};

class NewSubscriptionFormBase extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    if (!this.state.services.length) {
      this.setState({ loading: true });
    }
    this.onListenForServices();
  }

  onListenForServices = () => {
    this.props.firebase
      .services()
      .orderByChild('createdAt')
      .limitToLast(5)
      .on('value', snapshot => {
        this.setState({ loading: false, services: snapshot.val() });
      });
  };

  componentWillUnmount() {
    this.props.firebase.services().off();
  }

  updateItem = (item) => {
    item.status = "Pending";
    item.value = this.state.services[item.serviceId].unitValue * moment.duration(item.endDate.diff(item.startDate)).asDays().toFixed(0);
    this.setState({
      subList: [...this.state.subList, item]
    });
  }

  onSubmit = (event, authUser) => {
    event.preventDefault();
    const {
      subList,
    } = this.state;

    this.props.firebase.subscriptions().push({
      consumer: authUser.uid,
      status: "Pending",
      subList: subList.map(e => {
        e.startDate = e.startDate.valueOf();
        e.endDate = e.endDate.valueOf();
        return e;
      }),
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    }).then((res) => {
      subList.forEach((e) => {
        this.props.firebase.messages().push({
          from: authUser.username,
          to: e.intermediary,
          type: "Subscription Request",
          subject: e.serviceName,
          subjectId: [res.key,e.serviceId],

        });
      });
      this.setState({ ...INITIAL_STATE });
    }).catch(error => {
      this.setState({ error });
    });

  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      subList,
      services,
      error,

    } = this.state;

    const isInvalid =
      subList.length == 0;

    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <form onSubmit={event => this.onSubmit(event, this.props.authUser)}>
          <SubscriptionItem updateItem={this.updateItem} services={services} />
          <Grid container spacing={4} justify="flex-end">
            <Grid item xs>
              <SubscriptionList subList={subList} />
            </Grid>
          </Grid>
          <Grid container spacing={4} justify="flex-end">
            <Grid item xs={2}>
              <Button type="submit" fullWidth disabled={isInvalid} variant="contained" color="primary" >Request</Button>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            {error && <p>{error.message}</p>}
          </Grid>
        </form >
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

const NewSubscriptionForm = compose(
  withRouter,
  withFirebase,
  connect(
    mapStateToProps,
  ),
  withStyles(useStyles),
)(NewSubscriptionFormBase);


export default NewSubscriptionPage;

export { NewSubscriptionForm };
