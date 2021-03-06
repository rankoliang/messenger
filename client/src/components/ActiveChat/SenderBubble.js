import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Avatar } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 11,
    color: '#BECCE2',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    color: '#91A3C0',
    letterSpacing: -0.2,
    padding: 8,
    fontWeight: 'bold',
  },
  bubble: {
    background: '#F4F6FA',
    borderRadius: '10px 10px 0 10px',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5,
    '& *:not(:last-child)': {
      marginRight: 2,
    },
  },
  seenIcon: {
    color: '#BECCE2',
  },
  avatar: {
    height: 20,
    width: 20,
    marginTop: 6,
  },
}));

const SenderBubble = (props) => {
  const classes = useStyles();

  const { time, text, isLastReadMessage, otherUser } = props;

  return (
    <Box className={classes.root}>
      <Box className={classes.info}>
        <Typography className={classes.date}>{time}</Typography>
      </Box>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>{text}</Typography>
      </Box>
      {isLastReadMessage && (
        <Avatar
          alt={otherUser.username}
          src={otherUser.photoUrl}
          className={classes.avatar}
        ></Avatar>
      )}
    </Box>
  );
};

export default SenderBubble;
