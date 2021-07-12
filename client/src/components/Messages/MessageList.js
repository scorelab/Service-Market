import React from 'react';
import { Divider, List, makeStyles } from '@material-ui/core';
import MessageItem from './MessageItem';

const useStyles = makeStyles((theme) => ({

  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

export default function MessageList(props) {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {props.messages.map(message => (
        <div>
          <MessageItem
            key={message.uid}
            message={message}
            onActionTaken={props.onActionTaken}
          />
          <Divider variant="middle"/>
        </div>
      ))}


    </List>

  )
};

