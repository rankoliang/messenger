import io from 'socket.io-client';
import store from './store';
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setSentMessagesToRead,
} from './store/conversations';
import { logout } from './store/utils/thunkCreators';
import { clearOnLogout } from './store/index';

const socket = io(window.location.origin, {
  auth: (sendAuth) => {
    const token = localStorage.getItem('messenger-token');

    sendAuth({ token });
  },
});

socket.on('connect', () => {
  console.log('connected to server');

  socket.on('add-online-user', (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on('remove-offline-user', (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on('new-message', (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });

  socket.on('read-sent-messages', (conversationId) => {
    store.dispatch(setSentMessagesToRead(conversationId));
  });

  socket.on('connect_error', (err) => {
    if (err.message === 'Authentication Error') {
      store.dispatch(logout());
      store.dispatch(clearOnLogout());
    }

    // TODO implement feedback for the user
    console.error(err.message);
  });
});

export default socket;
