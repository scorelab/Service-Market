import { Divider, IconButton, ListItem, ListItemText, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import React, { Component } from 'react';

class MessageItem extends Component {

  render() {
    const { message, onActionTaken } = this.props;

    return (
      <ListItem>
        <ListItemText
          primary={message.type}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
              >
                {message.subject + ' by ' + message.from}
              </Typography>
            </React.Fragment>
          }
        />

        <Divider orientation="vertical" />

        <IconButton key={'btnOK'+message.uid} edge="end" onClick={()=>onActionTaken(message, true)}>
          <CheckCircleIcon />
        </IconButton>
        <IconButton key={'btnNK'+message.uid} edge="end" onClick={()=>onActionTaken(message, false)}>
          <CancelIcon />
        </IconButton>
      </ListItem>
    );
  }
}

export default MessageItem;
