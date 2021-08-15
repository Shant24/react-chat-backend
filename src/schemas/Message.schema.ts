import { Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    cId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: [true, 'Conversation id is required!'] },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'User id is required!'] },
    text: { type: String, trim: true, required: false, default: undefined },
    audio: { type: String, trim: true, required: false, default: undefined },
    attachments: {
      type: [
        {
          filename: { type: String, trim: true, required: [true, 'Attachments filename is required!']},
          url: { type: String, trim: true, required: [true, 'Attachments url is required!'] },
        },
      ],
      required: false,
      default: undefined,
    },
    isRead: { type: Boolean, required: false, default: false },
    isTyping: { type: Boolean, required: false, default: false },
  },
  { timestamps: true },
);

export default MessageSchema;
