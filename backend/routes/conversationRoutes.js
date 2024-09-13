// routes/conversationRoutes.js
import express from 'express';
const router = express.Router();
import {createConversation,getConversations, getConversationById, updateConversation, deleteConversation } from '../controllers/conversationController.js';

router.post('/', createConversation);
router.get('/', getConversations);
router.get('/:id', getConversationById);
router.put('/:id', updateConversation);
router.delete('/:id', deleteConversation);

export default router; 
