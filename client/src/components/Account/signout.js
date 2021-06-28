import { Button } from '@material-ui/core';
import React from 'react';
import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <Button onClick={firebase.doSignOut} variant="contained" >
    Sign Out
  </Button>
);
export default withFirebase(SignOutButton);
