import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import MainBlock from '../Common/main-block';
import { Button, TextField, Grid } from '@material-ui/core';
import { compose } from 'recompose';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const PasswordForgetPage = () => (
  <MainBlock title="Recover Password">
    <PasswordForgetForm />
  </MainBlock>
);

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
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
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
    const { email, error } = this.state;
    const { classes } = this.props;
    const isInvalid = email === '';

    return (
      <div className={classes.root}>
        <form onSubmit={this.onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
                type="email"
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={2}>
              <Button fullWidth type="submit" disabled={isInvalid} variant="contained" color="primary" >Reset Password</Button>
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





export default PasswordForgetPage;

const PasswordForgetForm = compose(
  withRouter,
  withFirebase,
  withStyles(useStyles),
)(PasswordForgetFormBase);

export { PasswordForgetForm };
