import { Button, Grid, TextField } from '@material-ui/core';
import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs={2}>
            <Button fullWidth type="submit" disabled={isInvalid} variant="contained" color="primary" >Change Password</Button>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
            <Grid item xs={12}>
              {error && error.message}
            </Grid>
          </Grid>
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);
