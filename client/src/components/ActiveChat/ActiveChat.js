import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Input, Header, Messages } from './index';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveConversation } from '../../store/utils/thunkCreators';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 8,
    flexDirection: 'column',
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
}));

const ActiveChat = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const user = useSelector((state) => state.user);
  const conversation =
    useSelector(
      (state) =>
        state.conversations &&
        state.conversations.find(
          (conversation) =>
            conversation.otherUser.username === state.activeConversation
        )
    ) || {};

  const onInputFocus = async () => {
    await dispatch(setActiveConversation(conversation));
  };

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
              lastReadMessageId={conversation.lastReadMessageId}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              onFocus={onInputFocus}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
