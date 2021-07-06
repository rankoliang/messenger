const ConnectionCounter = require('./ConnectionCounter');

const onlineUsers = new ConnectionCounter();
module.exports = onlineUsers;
