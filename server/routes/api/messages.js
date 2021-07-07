const router = require('express').Router();
const { Conversation, Message } = require('../../db/models');
const { Op } = require('sequelize');
const onlineUsers = require('../../onlineUsers');

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({
        where: {
          id: conversationId,
          [Op.or]: {
            user1Id: senderId,
            user2Id: senderId,
          },
        },
      });
    } else {
      // if we don't have conversation id, find a conversation to make sure it doesn't already exist
      conversation = await Conversation.findConversation(senderId, recipientId);
    }

    if (conversationId && !conversation) {
      // A request to send a message to an invalid conversation was made
      res.sendStatus(403);
    } else if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.has(sender.id)) {
        sender.online = true;
      }
    }

    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
