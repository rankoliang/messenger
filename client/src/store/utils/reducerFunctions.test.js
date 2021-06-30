import { setMessagesToRead } from './reducerFunctions';

describe('readConversation', () => {
  const conversations = [
    {
      id: 1,
      messages: [
        {
          conversationId: 1,
          read: true,
        },
      ],
    },
    {
      id: 2,
      messages: [
        {
          conversationId: 2,
          read: false,
        },
        {
          conversationId: 2,
          read: false,
        },
        {
          conversationId: 2,
          read: false,
        },
        {
          conversationId: 2,
          read: false,
        },
      ],
    },
    {
      id: 3,
      messages: [
        {
          conversationId: 3,
          read: true,
        },
        {
          conversationId: 3,
          read: true,
        },
        {
          conversationId: 3,
          read: false,
        },
      ],
    },
  ];

  it('sets the read status of all messages to true', () => {
    const getConversation = (id) => (convos) =>
      convos.find((convo) => convo.id === id);

    // Gets the conversation with an id of 3 then checks if the conversation is read
    const allRead = pipe(getConversation(3), (convo) => {
      return convo.messages.every(({ read }) => read);
    });

    expect(allRead(conversations)).toBe(false);

    const nextConvos = setMessagesToRead(conversations, 3);

    expect(allRead(nextConvos)).toBe(true);
  });
});

// calls functions from left to right to the given value
const pipe =
  (...functions) =>
  (value) =>
    functions.reduce((previousValue, fn) => fn(previousValue), value);
