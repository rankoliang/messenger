import axios from 'axios';
import socket from '../../socket';
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  setReceivedMessagesToRead,
  readConversation,
} from '../conversations';
import { setActiveChat } from '../activeConversation';
import { gotUser, setFetchingStatus } from '../user';

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem('messenger-token');
  config.headers['x-access-token'] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get('/auth/user');
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit('go-online');
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post('/auth/register', credentials);
    await localStorage.setItem('messenger-token', data.token);
    dispatch(gotUser(data));
    socket.emit('go-online');
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || 'Server Error' }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post('/auth/login', credentials);
    await localStorage.setItem('messenger-token', data.token);
    // Force socket to reconnect and reauthenticate with the new token
    socket.disconnect().connect();
    dispatch(gotUser(data));
    socket.emit('go-online');
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || 'Server Error' }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete('/auth/logout');
    await localStorage.removeItem('messenger-token');
    dispatch(gotUser({}));
    socket.emit('logout');
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/api/conversations');
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post('/api/messages', body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit('new-message', {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

export const setActiveConversation = (conversation) => async (dispatch) => {
  try {
    dispatch(setActiveChat(conversation.otherUser.username));

    if (!conversation?.id) {
      return;
    }

    // Updates messages in the conversation to read
    await axios.patch(`/api/conversations/${conversation.id}/read`, {
      otherUserId: conversation.otherUser.id,
    });

    dispatch(setReceivedMessagesToRead(conversation.id));
    dispatch(readConversation(conversation.id));

    // sends an event to the server to alert the other user
    socket.emit('read-sent-messages', {
      conversationId: conversation.id,
      otherUserId: conversation.otherUser.id,
    });
  } catch (err) {
    console.error(err);
  }
};
