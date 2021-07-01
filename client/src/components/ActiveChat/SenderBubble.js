import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import SeenIcon from './SeenIcon';

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
}));

const SenderBubble = (props) => {
  const classes = useStyles();
  const { time, text, read } = props;

  return (
    <Box className={classes.root}>
      <Box className={classes.info}>
        <Typography className={classes.date}>{time}</Typography>
        <SeenIcon read={read} className={classes.seenIcon} />
      </Box>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>{text}</Typography>
      </Box>
    </Box>
  );
};

export default SenderBubble;
