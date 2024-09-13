// models/Message.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;