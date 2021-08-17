import { Request, Response } from 'express';

import { IConversation } from '../types/conversation';
import { ConversationModel } from '../models';
import { getUniqueIdFromIds } from '../helpers/unique';

class ConversationController {
  getAll(req: Request, res: Response) {
    // TODO: take userId fro JWT Token
    const authUserId: string = '611af638b80661134cd680fb';

    ConversationModel.find({ participants: authUserId })
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

  getById(req: Request, res: Response) {
    const { id } = req.params;

    // TODO: take userId fro JWT Token
    const userId: string = '611af638b80661134cd680fb';

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

  create(req: Request, res: Response) {
    const { conversation }: { conversation: { name: string; participants: string[]; } } = req.body;

    if (!conversation || !conversation.participants?.length) {
      return res.status(400).json({ error: { message: 'Bad request!' } });
    }

    const { name, participants } = conversation;

    // TODO: take userId fro JWT Token
    const meId = '611af638b80661134cd680fb';

    const participantsArr: string[] = [meId, ...participants]

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

  delete(req: Request, res: Response) {
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
