import { Schema } from 'mongoose';

const ConversationSchema = new Schema(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      min: [2, 'Minimum 2 participants are required!'],
      max: 10,
      unique: [true, 'This conversation already exists!'],
      required: [true, 'Participants ids are required!'],
    },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message', default: undefined },
  },
  { timestamps: true },
);

export default ConversationSchema;
