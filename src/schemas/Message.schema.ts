import { Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    cId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation id is required!'],
    },

    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User\'s id is required!'],
    },

    text: {
      type: String,
      trim: true,
      default: undefined,
      required: false,
    },

    audio: {
      type: String,
      trim: true,
      default: undefined,
      required: false,
    },

    attachments: {
      type: [
        {
          filename: {
            type: String,
            trim: true,
            required: [true, 'Attachments filename is required!'],
          },
          url: {
            type: String,
            trim: true,
            required: [true, 'Attachments url is required!'],
          },
        },
      ],
      default: undefined,
      required: false,
    },

    isRead: {
      type: Boolean,
      default: false,
      required: false,
    },

    isTyping: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { timestamps: true },
);

export default MessageSchema;
