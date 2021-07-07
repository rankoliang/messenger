const router = require('express').Router();
const { User, Conversation, Message } = require('../../db/models');
const { Op } = require('sequelize');
const onlineUsers = require('../../onlineUsers');

const latestMessage = (conversation) =>
  conversation.messages[conversation.messages.length - 1];

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ['id'],
      order: [[Message, 'createdAt', 'ASC']],
      include: [
        { model: Message, order: ['createdAt', 'DESC'] },
        {
          model: User,
          as: 'user1',
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ['id', 'username', 'photoUrl'],
          required: false,
        },
        {
          model: User,
          as: 'user2',
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ['id', 'username', 'photoUrl'],
          required: false,
        },
      ],
    });

    const conversationIds = conversations.map(
      (conversation) => conversation.dataValues.id
    );

    const unreadCounts = await Conversation.unreadCounts({
      userId,
      where: { id: conversationIds },
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.has(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = latestMessage(convoJSON)?.text;
      convoJSON.unreadCount = unreadCounts.get(convoJSON.id) || 0;
      conversations[i] = convoJSON;
    }

    conversations.sort((a, b) => {
      if (a.messages.length === 0 && b.messages.length === 0) {
        return 0;
      } else if (a.messages.length === 0) {
        return 1;
      } else if (b.messages.length === 0) {
        return -1;
      }

      return latestMessage(b).createdAt - latestMessage(a).createdAt;
    });

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.patch('/:conversationId/read', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const userId = req.user.id;

    const { conversationId } = req.params;

    const { otherUserId } = req.body;

    // Checks if the conversation exists and that the user is part of it
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId,
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
    });

    if (conversation) {
      await Message.update(
        { read: true },
        {
          where: {
            conversationId,
            senderId: otherUserId,
          },
        }
      );

      res.sendStatus(201);
    } else {
      // Conversation was not found or the user is not part of the convo
      res.sendStatus(403);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
