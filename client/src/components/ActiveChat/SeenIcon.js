import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const useStyles = makeStyles(() => ({
  seenIcon: {
    fontSize: 13,
  },
}));

const SeenIcon = ({ read, className }) => {
  const classes = useStyles();

  if (read) {
    return (
      <CheckCircleOutlineIcon className={`${classes.seenIcon} ${className}`} />
    );
  } else {
    return (
      <VisibilityOffOutlinedIcon
        className={`${classes.seenIcon} ${className}`}
      />
    );
  }
};

export default SeenIcon;
