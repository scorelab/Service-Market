import { Box, Button, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import MainBlock from '../Common/main-block';

import { withFirebase } from '../Firebase';
import MessageList from './MessageList';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      loading: false,
    };
  }

  componentDidMount() {
    if (!this.props.messages.length) {
      this.setState({ loading: true });
    }
    this.onListenForMessages();
  }

  componentDidUpdate(props) {
    if (props.limit !== this.props.limit) {
      this.onListenForMessages();
    }
  }

  onListenForMessages = () => {
    this.props.firebase
      .messages()
      .orderByChild('to')
      .equalTo(this.props.authUser.uid)
      .limitToLast(this.props.limit)
      .on('value', snapshot => {
        this.props.onSetMessages(snapshot.val());
        this.setState({ loading: false });
      });
  };

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onActionTaken = (msg, isAccepted) => {
    const { subjectId, ...subSnapshot } = msg;
    var that = this
    var status = isAccepted ? "Approved" : "Rejected";
    this.props.firebase.subscriptions().orderByKey()
      .equalTo(subjectId[0])
      .once('value', function (snap) {
        var subList = snap.val()[subjectId[0]].subList
        subList.find(v => v.serviceId === subjectId[1]).status = status;
        that.props.firebase.subscription(subjectId[0]).update({
          'subList': subList
        });

      });
    this.props.firebase.message(msg.uid).remove();

  };


  onNextPage = () => {
    this.props.onSetMessagesLimit(this.props.limit + 5);
  };

  render() {
    const { messages } = this.props;
    const { loading } = this.state;

    return (
      <div>
        {loading && <Box padding={10}>Loading...</Box>}

        {messages && (
          <MessageList
            messages={messages}
            onActionTaken={this.onActionTaken}
          />
        )}
        {!loading && messages && (
          <Button fullwidth type="button" onClick={this.onNextPage}>
            More
          </Button>
        )}

        {!messages && <div>No messages ...</div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  messages: Object.keys(state.messageState.messages || {}).map(
    key => ({
      ...state.messageState.messages[key],
      uid: key,
    }),
  ),
  limit: state.messageState.limit,
});

const mapDispatchToProps = dispatch => ({
  onSetMessages: messages =>
    dispatch({ type: 'MESSAGES_SET', messages }),
  onSetMessagesLimit: limit =>
    dispatch({ type: 'MESSAGES_LIMIT_SET', limit }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Messages);
