import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import MainBlock from '../Common/main-block';
import { Button, Grid, makeStyles, TextField, Typography, withStyles } from '@material-ui/core';

const SignInPage = () => (
  <MainBlock>
    <SignInForm />
  </MainBlock>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
}));

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
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
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <form onSubmit={this.onSubmit}>
          <Typography variant="h4" gutterBottom>
            Sign In
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs>
              <TextField
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
            <Grid item xs>
              <TextField
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs>
              <Button type="submit" disabled={isInvalid} variant="contained" color="primary" >Sign In</Button>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs>
              <Link to={ROUTES.PASSWORD_FORGET} color="inherit">Forgot Password?</Link>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs>
              Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
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

const SignInForm = compose(
  withRouter,
  withFirebase,
  withStyles(useStyles),
)(SignInFormBase);


export default SignInPage;

export { SignInForm };
