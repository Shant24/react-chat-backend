import { Document } from 'mongoose';

export interface IConversation extends Document<string> {
  uniqueId: string;
  name: string;
  participants: string[];
  lastMessage?: string;
}
