import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import MainBlock from '../Common/main-block';
import { withAuthorization, withEmailVerification } from '../Session';
import PasswordChangeForm from './pw-change';
import { PasswordForgetForm } from './pw-forgot';

const AccountPage = ({ authUser }) => (
  <MainBlock title="Account">
      <PasswordForgetForm />
      <br/>
      <br/>
      <PasswordChangeForm />
  </MainBlock>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

const condition = authUser => !!authUser;

export default compose(
  connect(mapStateToProps),
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);
