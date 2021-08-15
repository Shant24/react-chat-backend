import { Document } from 'mongoose';

export interface IConversation extends Document<string> {
  participants: string[];
  lastMessage?: string;
}
