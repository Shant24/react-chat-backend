import mongoose from 'mongoose';

import { IConversation } from '../types/conversation';
import { ConversationSchema } from '../schemas';

const ConversationModel = mongoose.model<IConversation>('Conversation', ConversationSchema);

export default ConversationModel;
