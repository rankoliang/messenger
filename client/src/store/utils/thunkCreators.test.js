import { postMessage } from './thunkCreators';
import axios from 'axios';
import { addConversation, setNewMessage } from '../conversations';

jest.mock('axios');

describe('postMessage', () => {
  let body;
  let data;

  const dispatch = jest.fn();

  beforeEach(() => {
    data = {
      message: {
        recipientId: body.recipientId,
        text: body.text,
        conversationId: body.conversationId,
      },
    };

    axios.post.mockResolvedValue({ data });
  });

  describe('when there is no existing conversation', () => {
    beforeAll(() => {
      body = {
        text: 'message text',
        recipientId: 2,
        conversationId: null,
        sender: 1,
      };
    });

    it('adds a new conversation', async () => {
      await postMessage(body)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        addConversation(body.recipientId, data.message)
      );
    });
  });

  describe('when there is an existing conversation', () => {
    beforeAll(() => {
      body = {
        text: 'message text',
        recipientId: 2,
        conversationId: 1,
        sender: 1,
      };
    });

    it('sets a new message', async () => {
      await postMessage(body)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setNewMessage(data.message));
    });
  });
});
