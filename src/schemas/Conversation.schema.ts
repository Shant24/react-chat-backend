import { Schema } from 'mongoose';

const ConversationSchema = new Schema(
  {
    uniqueId: {
      type: String,
      unique: true,
      required: [true, 'UniqueId is required!'],
    },

    name: {
      type: String,
      default: '',
      required: false,
    },

    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      min: [2, 'Required minimum 2 participants!'],
      max: 10,
      required: [true, 'Participants ids are required!'],
    },

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: undefined,
      required: false,
    },
  },
  { timestamps: true },
);

export default ConversationSchema;
