import { Button, Grid, makeStyles, TextField, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ERRORS from '../../constants/errors';
import * as ROUTES from '../../constants/routes';
import MainBlock from '../Common/main-block';
import { withFirebase } from '../Firebase';

function SignUpPage(props) {
  return (
    <MainBlock title="Sign Up">
      <SignUpForm />
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

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    const roles = {};

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
          roles,
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERRORS.ERROR_MSG_ACCOUNT_EXISTS[0]) {
          error.message = ERRORS.ERROR_MSG_ACCOUNT_EXISTS[1];
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <form onSubmit={this.onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="username"
                value={username}
                onChange={this.onChange}
                type="text"
                placeholder="Full Name"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="email"
                value={email}
                onChange={this.onChange}
                placeholder="Email Address"
                type="email"
                variant="outlined"
              />
            </Grid>
          </Grid>
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
          <Grid container spacing={4} justify="flex-end">
            <Grid item xs={2}>
              <Button fullWidth type="submit" disabled={isInvalid} variant="contained" color="primary" >Sign Up</Button>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              {error && error.message}
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

const SignUpForm = compose(
  withRouter,
  withFirebase,
  withStyles(useStyles),
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm };
