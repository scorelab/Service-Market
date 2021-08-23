import { Button,Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import MainBlock from '../Common/main-block';
import { withFirebase } from '../Firebase';

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return needsEmailVerification(this.props.authUser) ? (
        <MainBlock>
          {this.state.isSent ? (
            <Typography variant="body1" color="textSecondary" component="p">
              E-Mail confirmation sent: Check you E-Mails (Spam folder
              included) for a confirmation E-Mail. Refresh this page
              once you confirmed your E-Mail.
            </Typography>
          ) : (
            <Typography variant="body1" color="textSecondary" component="p">
              Verify your E-Mail: Check you E-Mails (Spam folder
              included) for a confirmation E-Mail or send another
              confirmation E-Mail.
            </Typography>
          )}
          <br></br>
          <Button onClick={this.onSendEmailVerification} type="button" variant="contained" color="primary" >
            Send confirmation E-Mail
          </Button>

        </MainBlock>
      ) : (
        <Component {...this.props} />
      );
    }
  }

  const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

  return compose(
    withFirebase,
    connect(mapStateToProps),
  )(WithEmailVerification);
};

export default withEmailVerification;
