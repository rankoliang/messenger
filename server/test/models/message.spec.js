const chai = require('chai');
const { Message } = require('../../db/models/index');

const { checkPropertyExists } = require('sequelize-test-helpers');

describe('MessageModel', () => {
  const message = new Message();

  context('properties', () => {
    ['text', 'senderId', 'read'].forEach(checkPropertyExists(message));
  });
});
