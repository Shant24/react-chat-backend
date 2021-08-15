import { Document, ObjectId } from 'mongoose';

interface IAttachment {
  filename: string;
  url: string;
}

export interface IMessage extends Document<string> {
  cId: string;
  user: ObjectId;
  text?: string;
  audio?: string;
  attachments?: IAttachment[];
  isRead: boolean;
  isTyping?: boolean;
}
