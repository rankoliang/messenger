const { Op, fn, col } = require('sequelize');
const db = require('../db');
const Message = require('./message');

const Conversation = db.define('conversation', {});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id],
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id],
      },
    },
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

// query of unread conversation counts, batched to reduce database calls
Conversation.unreadCounts = async ({ userId, ...query }) => {
  return await Conversation.findAll({
    ...query,
    attributes: ['id', [fn('COUNT', col('unreadMessage.id')), 'unreadCount']],
    include: {
      model: Message,
      as: 'unreadMessage',
      attributes: [],
      where: {
        senderId: {
          [Op.ne]: userId,
        },
      },
    },
    group: ['conversation.id'],
    raw: true,
  }).then((counts) =>
    counts.reduce((map, { id, unreadCount }) => {
      map.set(id, Number(unreadCount));

      return map;
    }, new Map())
  );
};

module.exports = Conversation;
