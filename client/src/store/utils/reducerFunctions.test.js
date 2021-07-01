import {
  setMessagesToReadInStore,
  readConversationInStore,
  SET_SENT_ONLY,
  SET_RECEIVED_ONLY,
} from './reducerFunctions';

describe('reducerFunctions', () => {
  const conversations = [
    {
      id: 1,
      otherUser: {
        id: 2,
      },
      unreadCount: 0,
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
      unreadCount: 2,
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
      unreadCount: 1,
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

  describe('setMessagesToRead', () => {
    describe('with the SET_SENT_ONLY flag', () => {
      it('sets the read status of all sent messages to true', () => {
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

        const nextConvos = setMessagesToReadInStore(
          conversations,
          2,
          SET_SENT_ONLY
        );

        expect(allSentRead(nextConvos)).toBe(true);
      });

      it('does not set the read status of received messages to true', () => {
        const allReceivedRead = pipe(
          getConversation(2),
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

        const nextConvos = setMessagesToReadInStore(
          conversations,
          2,
          SET_SENT_ONLY
        );

        expect(allReceivedRead(nextConvos)).toBe(false);
      });
    });

    describe('with the SET_RECEIVED_ONLY flag', () => {
      it('does not set the read status of all sent messages to true', () => {
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

        const nextConvos = setMessagesToReadInStore(
          conversations,
          2,
          SET_RECEIVED_ONLY
        );

        expect(allSentRead(nextConvos)).toBe(false);
      });

      it('does sets the read status of received messages to read', () => {
        const allReceivedRead = pipe(
          getConversation(2),
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

        const nextConvos = setMessagesToReadInStore(
          conversations,
          2,
          SET_RECEIVED_ONLY
        );

        expect(allReceivedRead(nextConvos)).toBe(true);
      });
    });
  });

  describe('readConversationInStore', () => {
    it('sets the unreadCount of the conversation to 0', () => {
      const conversation = getConversation(2)(conversations);

      expect(conversation.unreadCount).toBe(2);

      const nextConvo = getConversation(2)(
        readConversationInStore(conversations, 2)
      );

      expect(nextConvo.unreadCount).toBe(0);
    });
  });
});

const getConversation = (id) => (convos) =>
  convos.find((convo) => convo.id === id);

// calls functions from left to right to the given value
const pipe =
  (...functions) =>
  (value) =>
    functions.reduce((previousValue, fn) => fn(previousValue), value);
