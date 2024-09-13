// controllers/conversationController.js
import Conversation from '../models/Conversation.js';

export const createConversation = async (req, res) => {
  try {
    const conversation = new Conversation(req.body);
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.status(200).json(conversations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    res.status(200).json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
