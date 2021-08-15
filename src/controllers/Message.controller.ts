import { Request, Response } from 'express';

import { IMessage } from '../types/message';
import { ConversationModel, MessageModel } from '../models';

class MessageController {
  getAllById(req: Request, res: Response) {
    const { cId } = req.params;

    MessageModel.find({ cId })
      .populate('user', 'fullName avatar')
      .exec((err, messages) => {
        if (err) {
          res.status(404).json({ error: { message: 'Something went wrong!' } });
        }

        if (!messages) {
          return res.status(404).json({ error: { message: 'Messages not found!' } });
        }

        res.status(200).json(messages);
      });
  }

  getById(req: Request, res: Response) {
    const { id } = req.params;

    MessageModel.findById(id)
      .populate('user', 'fullName avatar')
      .exec((err, message) => {
        if (err) {
          return res.status(404).json({ error: { message: 'Something went wrong!' } });
        }

        if (!message) {
          return res.status(404).json({ error: { message: 'Message not found!' } });
        }

        res.status(200).json(message);
      });
  }

  create(req: Request, res: Response) {
    const { message }: { message: IMessage } = req.body;

    if (!message) {
      return res.status(400).json({ error: { message: 'Bad request!' } });
    }

    const { cId, user, text, audio, attachments, isTyping } = message;

    const newMessage = new MessageModel({ cId, user, text, audio, attachments, isTyping });

    newMessage.save()
      .then((value: IMessage) => {
        value.populate('user', 'fullName avatar').execPopulate(async (err, populatedMessage) => {
          if (err) {
            return res.status(404).json({ error: { message: 'Something went wrong!' } });
          }

          if (!populatedMessage) {
            return res.status(404).json({ error: { message: 'Message not found!' } });
          }

          await ConversationModel
            .updateOne({ _id: cId }, { lastMessage: populatedMessage._id }, { runValidators: true });

          console.log('Message created');
          res.status(201).json(populatedMessage);
        });
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  }

  delete(req: Request, res: Response) {
    const { id } = req.params;

    MessageModel.findByIdAndRemove(id)
      .then((message: IMessage | null) => {
        if (!message) {
          return res.status(404).json({ error: { message: 'Message not found!' } });
        }

        res.status(200).json({ message: `Message removed!` });
      })
      .catch(() => {
        res.status(404).json({ error: { message: 'Something went wrong!' } });
      });
  }
}

export default MessageController;
