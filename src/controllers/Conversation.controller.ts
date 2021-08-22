import { Response } from 'express';

import { CustomRequest } from '../types/packages/express';
import { IConversation } from '../types/conversation';
import { ConversationModel } from '../models';
import { getUniqueIdFromIds } from '../helpers/unique';

class ConversationController {
  getAll(req: CustomRequest, res: Response) {
    const userId = req.user?._id;

    ConversationModel.find({ participants: userId })
      .populate('participants', 'fullName avatar lastSeen')
      .populate('lastMessage', 'user text audio attachments isRead isTyping createdAt')
      .exec((err, conversations) => {
        if (err) {
          res.status(404).json({ error: { message: 'Something went wrong!' } });
        }

        if (!conversations) {
          return res.status(404).json({ error: { message: 'Conversations not found!' } });
        }

        res.status(200).json(conversations);
      });
  }

  getById(req: CustomRequest, res: Response) {
    const { id } = req.params;

    const userId = req.user?._id;

    ConversationModel.findOne({ _id: id, participants: userId })
      .populate('participants', 'fullName avatar lastSeen')
      .populate('lastMessage', 'user text audio attachments isRead isTyping createdAt')
      .then((conversation: IConversation | null) => {
        if (!conversation) {
          return res.status(404).json({ error: { message: 'Conversation not found!' } });
        }

        res.status(200).json(conversation);
      })
      .catch(() => {
        res.status(404).json({ error: { message: 'Something went wrong!' } });
      });
  }

  create(req: CustomRequest, res: Response) {
    const { conversation }: { conversation: { name: string; participants: string[]; } } = req.body;

    if (!conversation || !conversation.participants?.length) {
      return res.status(400).json({ error: { message: 'Bad request!' } });
    }

    const { name, participants } = conversation;
    const userId = req.user?._id || '';

    const participantsArr: string[] = [userId, ...participants];

    const uniqueId = getUniqueIdFromIds(participantsArr);

    const newConversation = new ConversationModel({
      uniqueId,
      name,
      participants: participantsArr,
    });

    newConversation.save()
      .then((value: IConversation) => {
        value
          .populate('participants', 'fullName avatar lastSeen')
          .execPopulate((err, populatedConversation) => {
            if (err) {
              return res.status(400).json({ error: { message: 'Bad request!' } });
            }

            if (!populatedConversation) {
              return res.status(404).json({ error: { message: 'Conversations not found!' } });
            }

            console.log('Conversation created');
            res.status(201).json(populatedConversation);
          });
      })
      .catch((e) => {
        res.status(400).json({ error: { message: e.message } });
      });
  }

  delete(req: CustomRequest, res: Response) {
    const { id } = req.params;

    ConversationModel.findByIdAndRemove(id)
      .then((conversation: IConversation | null) => {
        if (!conversation) {
          return res.status(404).json({ error: { message: 'Conversation not found!' } });
        }

        res.status(200).json({ message: `Conversation removed!` });
      })
      .catch(() => {
        res.status(404).json({ error: { message: 'Something went wrong!' } });
      });
  }
}

export default ConversationController;
