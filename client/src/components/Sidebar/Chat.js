import React from 'react';
import { Box, Badge } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { withStyles } from '@material-ui/core/styles';
import { setActiveConversation } from '../../store/utils/thunkCreators';
import { useDispatch } from 'react-redux';

const styles = {
  root: {
    display: 'flex',
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
  badge: {
    width: '100%',
  },
};

const StyledBadge = withStyles(() => ({
  badge: {
    fontSize: 16,
    height: 26,
    minWidth: 26,
    borderRadius: 13,
    top: '50%',
    fontWeight: 'bold',
    paddingLeft: 8,
    paddingRight: 8,
    right: 26,
  },
}))(Badge);

const Chat = ({
  classes,
  conversation,
  conversation: { unreadCount, otherUser },
}) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setActiveConversation(conversation));
  };

  return (
    <Box onClick={handleClick} className={classes.root}>
      <StyledBadge
        color="primary"
        badgeContent={unreadCount}
        variant="standard"
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        className={classes.badge}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={conversation} />
      </StyledBadge>
    </Box>
  );
};

export default withStyles(styles)(Chat);
