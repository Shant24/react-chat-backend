import { Response } from 'express';

import { CustomRequest } from '../types/packages/express';
import { IMessage } from '../types/message';
import { ConversationModel, MessageModel } from '../models';

class MessageController {
  async getAllById(req: CustomRequest, res: Response) {
    const { cId } = req.params;

    try {
      const messages = await MessageModel.find({ cId });

      if (!messages) {
        return res.status(404).json({ error: { message: 'Messages not found!' } });
      }

      res.status(200).json(messages);
    } catch {
      res.status(404).json({ error: { message: 'Something went wrong!' } });
    }
  }

  async getById(req: CustomRequest, res: Response) {
    const { id } = req.params;

    try {
      const message = await MessageModel.findById(id);

      if (!message) {
        return res.status(404).json({ error: { message: 'Message not found!' } });
      }

      res.status(200).json(message);
    } catch {
      res.status(404).json({ error: { message: 'Something went wrong!' } });
    }
  }

  async create(req: CustomRequest, res: Response) {
    const { message }: { message: IMessage } = req.body;

    if (!message) {
      return res.status(400).json({ error: { message: 'Bad request!' } });
    }

    const userId = req.user?._id;
    const { cId, text, audio, attachments, isTyping } = message;

    try {
      const oldConversation = await ConversationModel.findOne({ _id: cId, participants: userId });

      if (!oldConversation) {
        return res.status(400)
          .json({ error: { message: 'You have not permission to send message in this conversation' } });
      }

      const newMessage = new MessageModel({ cId, user: userId, text, audio, attachments, isTyping });

      const savedMessage = await newMessage.save();

      if (!savedMessage) {
        return res.status(400).json({ error: { message: 'Something went wrong!' } });
      }

      await ConversationModel.updateOne(
        { _id: cId },
        { lastMessage: savedMessage._id },
        { runValidators: true },
      );

      console.log('Message created');
      res.status(201).json(savedMessage);

    } catch (error) {
      res.status(400).json({ error: { message: error.message } });
    }
  }

  async delete(req: CustomRequest, res: Response) {
    const { id } = req.params;

    try {
      const removedMessage = await MessageModel.findByIdAndRemove(id);

      if (!removedMessage) {
        return res.status(404).json({ error: { message: 'Message not found!' } });
      }

      const findMessages = await MessageModel.find({ cId: removedMessage.cId });

      await ConversationModel
        .updateOne(
          { _id: removedMessage.cId },
          (findMessages.length
            ? { lastMessage: findMessages[findMessages.length - 1]._id }
            : { $unset: { lastMessage: undefined } }),
        );

      res.status(200).json({ message: `Message removed!` });
    } catch {
      res.status(404).json({ error: { message: 'Something went wrong!' } });
    }
  }
}

export default MessageController;
