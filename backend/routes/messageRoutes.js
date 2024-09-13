// routes/messageRoutes.js
import express from 'express';
const router = express.Router();
import {createMessage,getMessages, getMessageById , updateMessage, deleteMessage} from '../controllers/messageController.js';

router.post('/', createMessage);
router.get('/', getMessages);
router.get('/:id', getMessageById);
router.put('/:id', updateMessage);
router.delete('/:id', deleteMessage);

export default router; 
