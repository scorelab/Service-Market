import {
  Button, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, Select, TextField
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import 'firebase/firestore';
import React, { Component } from 'react';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { SERVICE_TYPES } from '../../constants/constants';
import AddressButton from '../Common/address';
import MainBlock from '../Common/main-block';
import { withFirebase } from '../Firebase';



function NewIntermediaryPage(props) {

  return (
    <MainBlock title={"New Intermediary"}>
      <NewIntermediaryForm />
    </MainBlock>
  )
};

const INITIAL_STATE = {
  intermediaryName: '',
  intermediaryDetails: '',
  intermediaryType: '',
  focusedInput: null,
  brokerFee: '',
  address: '',
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

class NewIntermediaryFormBase extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event, authUser) => {
    event.preventDefault();
    const {
      intermediaryName,
      intermediaryDetails,
      intermediaryType,
      brokerFee,
      address,
    } = this.state;

    this.props.firebase.intermediaries().push({
      mediator: authUser.uid,
      intermediaryName: intermediaryName,
      intermediaryDetails: intermediaryDetails,
      intermediaryType: intermediaryType,
      brokerFee: brokerFee,
      address: address,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    }).then(() => {
      this.setState({ ...INITIAL_STATE });
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

  render() {
    const {
      intermediaryName,
      intermediaryDetails,
      intermediaryType,
      brokerFee,
      address,
      error,

    } = this.state;

    const isInvalid =
      intermediaryName === '';

    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <form onSubmit={event => this.onSubmit(event, this.props.authUser)}>
          <Grid container spacing={4}>
            <Grid item xs>
              <TextField
                fullWidth
                name="intermediaryName"
                value={intermediaryName}
                onChange={this.onChange}
                type="text"
                variant="outlined"
                placeholder="Intermediary Name"
              />
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="intermediaryDetails"
                value={intermediaryDetails}
                onChange={this.onChange}
                variant="outlined"
                multiline
                rows={5}
                rowsMax={6}
                type="text"
                placeholder="Intermediary Details"
              />
            </Grid>
            <Grid item xs>
              <Grid container spacing={4}>
                <Grid item xs>
                  <FormControl variant="outlined" fullWidth >
                    <InputLabel htmlFor="intermediaryType">Intermediary type</InputLabel>
                    <Select
                      id="intermediaryType"
                      name="intermediaryType"
                      value={intermediaryType}
                      onChange={this.onChange}
                      placeholder="Intermediary Type"
                      label="Intermediary Type"
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
                    <InputLabel htmlFor="brokerFee">Mediation Fee</InputLabel>
                    <OutlinedInput
                      id="brokerFee"
                      name="brokerFee"
                      value={brokerFee}
                      onChange={this.onChange}
                      endAdornment={<InputAdornment position="end">%</InputAdornment>}
                      labelWidth={60}
                    />
                  </FormControl>
                </Grid>
              </Grid>
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

const NewIntermediaryForm = compose(
  withRouter,
  withFirebase,
  connect(
    mapStateToProps,
  ),
  withStyles(useStyles),
)(NewIntermediaryFormBase);


export default NewIntermediaryPage;

export { NewIntermediaryForm };
