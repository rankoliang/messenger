import { setSentMessagesToReadInStore } from './reducerFunctions';

describe('setSentMessagesToRead', () => {
  const conversations = [
    {
      id: 1,
      otherUser: {
        id: 2,
      },
      messages: [
        {
          conversationId: 1,
          senderId: 2,
          read: true,
        },
      ],
    },
    {
      id: 2,
      otherUser: {
        id: 3,
      },
      messages: [
        {
          conversationId: 2,
          senderId: 1,
          read: false,
        },
        {
          conversationId: 2,
          senderId: 1,
          read: false,
        },
        {
          conversationId: 2,
          senderId: 3,
          read: false,
        },
        {
          conversationId: 2,
          senderId: 3,
          read: false,
        },
      ],
    },
    {
      id: 3,
      otherUser: {
        id: 4,
      },
      messages: [
        {
          conversationId: 3,
          senderId: 4,
          read: true,
        },
        {
          conversationId: 3,
          senderId: 1,
          read: true,
        },
        {
          conversationId: 3,
          senderId: 4,
          read: false,
        },
      ],
    },
  ];

  it('sets the read status of all sent messages to true', () => {
    const getConversation = (id) => (convos) =>
      convos.find((convo) => convo.id === id);

    const allSentRead = pipe(
      getConversation(2),
      (convo) => {
        const messages = convo.messages;
        return messages.filter(
          ({ senderId }) => senderId !== convo.otherUser.id
        );
      },
      (messages) => {
        return messages.every(({ read }) => read);
      }
    );

    expect(allSentRead(conversations)).toBe(false);

    const nextConvos = setSentMessagesToReadInStore(conversations, 2);

    expect(allSentRead(nextConvos)).toBe(true);
  });

  it('does not set the read status of receivedMessagesToRead', () => {
    const getConversation = (id) => (convos) =>
      convos.find((convo) => convo.id === id);

    const allReceivedRead = pipe(
      getConversation(3),
      (convo) => {
        const messages = convo.messages;
        return messages.filter(
          ({ senderId }) => senderId === convo.otherUser.id
        );
      },
      (messages) => {
        return messages.every(({ read }) => read);
      }
    );

    expect(allReceivedRead(conversations)).toBe(false);

    const nextConvos = setSentMessagesToReadInStore(conversations, 2);

    expect(allReceivedRead(nextConvos)).toBe(true);
  });
});

// calls functions from left to right to the given value
const pipe =
  (...functions) =>
  (value) =>
    functions.reduce((previousValue, fn) => fn(previousValue), value);
