import { Message } from '../models/message.model.js';

export const saveMessageService = async (sender, flat, content) => {
  try {
    const message = new Message({ sender, flat, content });
    await message.save();
    return message;
  } catch (error) {
    throw new Error(`Error saving message: ${error.message}`);
  }
};

export const getUserMessageService = async (filters) => {
  try {
    const messages = await Message.find(filters)
      .populate('flat')
      .populate('sender');
    return messages;
  } catch (error) {
    throw new Error(`Error retrieving user messages: ${error.message}`);
  }
};

export const getMessagesService = async (id) => {
  try {
    const messages = await Message.find({ flat: id })
      .populate('flat')
      .populate('sender');
    return { messages };
  } catch (error) {
    throw new Error(`Error retrieving messages: ${error.message}`);
  }
};
