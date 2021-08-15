import { Request, Response } from 'express';

import { IConversation } from '../types/conversation';
import { ConversationModel } from '../models';

class ConversationController {
  getAll(req: Request, res: Response) {
    const authUserId: string = '61192146ceb5613aabfc91e9';

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
    const userId: string = '61192146ceb5613aabfc91e9';

    ConversationModel.findById({ participants: userId, id })
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

  async create(req: Request, res: Response) {
    const { conversation }: { conversation: IConversation } = req.body;

    if (!conversation) {
      return res.status(400).json({ error: { message: 'Bad request!' } });
    }

    const { participants } = conversation;

    // TODO: adjust this functionality and add unique ConversationSchema participants
    try {
      await ConversationModel.find({ participants }).then((value) => {
        if (value.length) {
          throw { error: { message: 'This conversation already exists!' } };
        }
      }).catch((err) => {
        throw err;
      });

      await ConversationModel.find({ participants: participants.reverse() }).then((value) => {
        if (value.length) {
          throw { error: { message: 'This conversation already exists!' } };
        }
      }).catch((err) => {
        throw err;
      });

      const newConversation = new ConversationModel({ participants });

      newConversation.save()
        .then((value: IConversation) => {
          value
            .populate('participants', 'fullName avatar, lastSeen')
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

    } catch (err) {
      res.status(400).json(err);
    }
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
