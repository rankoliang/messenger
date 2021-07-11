export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      if (message.senderId === convo.otherUser.id) {
        convoCopy.unreadCount = (convoCopy.unreadCount || 0) + 1;
      }

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

const lastReadMessage = (messages, otherUser) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];

    if (message.senderId !== otherUser.id && message.read === true) {
      return message;
    }
  }
};

export const setMessagesToReadInStore = (state, conversationId, callback) => {
  // Could improve performance by normalizing state and being able
  // To access conversation directly by id
  return state.map((conversation) => {
    if (conversation.id === conversationId) {
      const newMessages = conversation.messages.map((message) => {
        if (callback(message.senderId, conversation.otherUser.id)) {
          return {
            ...message,
            read: true,
          };
        } else {
          return message;
        }
      });

      return {
        ...conversation,
        messages: newMessages,
        lastReadMessageId: lastReadMessage(newMessages, conversation.otherUser)
          ?.id,
      };
    } else {
      return conversation;
    }
  });
};

export const SET_SENT_ONLY = (senderId, otherUserId) =>
  senderId !== otherUserId;

export const SET_RECEIVED_ONLY = (senderId, otherUserId) =>
  senderId === otherUserId;

export const readConversationInStore = (state, conversationId) => {
  return state.map((conversation) => {
    if (conversation.id === conversationId) {
      return {
        ...conversation,
        unreadCount: 0,
        lastReadMessageId: lastReadMessage(
          conversation.messages,
          conversation.otherUser
        )?.id,
      };
    } else {
      return conversation;
    }
  });
};
