import React, { Component, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import * as ERRORS from '../../constants/errors';
import MainBlock from '../Common/main-block';
import 'firebase/firestore';
import {
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  FormLabel,
  FormControlLabel,
  OutlinedInput,
  FormControl,
  InputLabel,
  InputAdornment,
  Box,
  IconButton,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import { DateRangePicker } from "react-dates";
import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { green } from '@material-ui/core/colors';
import { SERVICE_TYPES } from '../../constants/constants';
import { MerkleTree } from '../../util/MerkelUtil';
import AddressButton from '../Common/address'

function NewServicePage(props) {

  return (
    <MainBlock title={"New Service"}>
      <NewServiceForm />
    </MainBlock>
  )
};

const INITIAL_STATE = {
  serviceName: '',
  serviceDetails: '',
  serviceType: '',
  startDate: moment(),
  endDate: moment().add(7, 'days'),
  focusedInput: null,
  intermediary: '',
  resolution: '',
  unitValue: '',
  address: '',
  intermediaries: [],
  error: null,
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

class NewServiceFormBase extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { ...INITIAL_STATE };
  }

  getRandomNumbers = (start, end) => {
    const crypto = require("crypto");
    const duration = moment.duration(end.diff(start)).asDays().toFixed(0);
    return new Array(parseInt(duration) + 1).fill().map(() => "0x" + crypto.randomBytes(16).toString("hex"));
  }

  downloadTxtFile = (secrets) => {
    const element = document.createElement("a");
    const file = new Blob([secrets.join("\r\n")], { type: 'text/plain', endings: 'native' });
    element.href = URL.createObjectURL(file);
    element.download = "secretes.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  onSubmit = (event, authUser) => {
    event.preventDefault();
    const {
      serviceName,
      serviceDetails,
      serviceType,
      intermediary,
      startDate,
      endDate,
      unitValue,
      address,
      intermediaries
    } = this.state;

    const secrets = this.getRandomNumbers(startDate, endDate);
    const mt = new MerkleTree()
    this.props.firebase.services().push({
      producer: authUser.uid,
      serviceName: serviceName,
      serviceDetails: serviceDetails,
      serviceType: serviceType,
      intermediary: intermediary,
      startDate: startDate.valueOf(),
      endDate: endDate.valueOf(),
      address: address,
      unitValue: unitValue,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
      hashes: secrets.map((e) => "0x" + mt.H(e).toString('hex'))
    }).then(() => {
      this.setState({ ...INITIAL_STATE });
      this.downloadTxtFile(secrets)
    }).catch(error => {
      this.setState({ error });
    });

  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeAddress = (address) => {
    this.setState({ ['address']: address });
  };

  componentDidMount() {
    if (!this.state.intermediaries.length) {
      this.setState({ loading: true });
    }
    this.onListenForIntermediaries();
  }

  onListenForIntermediaries = () => {
    this.props.firebase
      .intermediaries()
      .orderByChild('createdAt')
      .limitToLast(5)
      .on('value', snapshot => {
        this.setState({ loading: false, intermediaries: snapshot.val() });
      });
  };

  render() {
    const {
      serviceName,
      serviceDetails,
      serviceType,
      intermediary,
      startDate,
      endDate,
      unitValue,
      focusedInput,
      intermediaries,
      address,
      error,

    } = this.state;

    const isInvalid = serviceName === '';

    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <form onSubmit={event => this.onSubmit(event, this.props.authUser)}>
          <Grid container spacing={4}>
            <Grid item xs>
              <TextField
                fullWidth
                name="serviceName"
                value={serviceName}
                onChange={this.onChange}
                type="text"
                variant="outlined"
                placeholder="Service Name"
              />
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="serviceDetails"
                value={serviceDetails}
                onChange={this.onChange}
                variant="outlined"
                multiline
                rows={5}
                rowsMax={6}
                type="text"
                placeholder="Service Details"
              />
            </Grid>
            <Grid item xs>
              <Grid container spacing={4}>
                <Grid item xs>
                  <FormControl variant="outlined" fullWidth >
                    <InputLabel htmlFor="serviceType">Service type</InputLabel>
                    <Select
                      id="serviceType"
                      name="serviceType"
                      value={serviceType}
                      onChange={this.onChange}
                      placeholder="Service Type"
                      label="Service Type"
                    >
                      <option value="" disabled></option>
                      {Object.entries(SERVICE_TYPES).map(([k, v], i) => {
                        return <option key={k} value={k}>{v}</option>;
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="intermediary">Intermediary</InputLabel>
                    <Select
                      id={intermediary}
                      label="Intermediary"
                      name="intermediary"
                      value={intermediary}
                      onChange={this.onChange}
                    >
                      <option value="" disabled></option>
                      {intermediaries && Object.entries(intermediaries).map(([k, v], i) => {
                        return <option key={k} value={k}>{v.intermediaryName}</option>;
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="unitValue">Unit value</InputLabel>
                <OutlinedInput
                  id="unitValue"
                  name="unitValue"
                  value={unitValue}
                  onChange={this.onChange}
                  endAdornment={<InputAdornment position="end">$/day</InputAdornment>}
                  labelWidth={60}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}  >
              <Box display="flex" borderRadius={3} padding={0.5} border={1} borderColor="silver">
                <FormControlLabel
                  control={
                    <DateRangePicker
                      noBorder={true}
                      id="serviceDuration"
                      name="serviceDuration"
                      openDirection="up"
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
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={11}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="address" >Address</InputLabel>
                <OutlinedInput
                  id="address"
                  name="address"
                  value={address}
                  label="Address"
                  onChange={this.onChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <AddressButton setAddress={this.onChangeAddress} />
            </Grid>
          </Grid>

          <Grid container spacing={4} justify="flex-end">
            <Grid item xs={2}>
              <Button type="submit" fullWidth disabled={isInvalid} variant="contained" color="primary" >Save</Button>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              {error && error.message}
            </Grid>
          </Grid>
        </form >
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

const NewServiceForm = compose(
  withRouter,
  withFirebase,
  connect(
    mapStateToProps,
  ),
  withStyles(useStyles),
)(NewServiceFormBase);


export default NewServicePage;

export { NewServiceForm };
