import mongoose from 'mongoose';

import { IMessage } from '../types/message';
import { MessageSchema } from '../schemas';

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
