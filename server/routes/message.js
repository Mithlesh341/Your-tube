
import express from 'express';
import { addMessage, getMessagesByGroup } from '../controllers/message.js';

const router = express.Router();

router.post('/add', addMessage);          // Save message
router.get('/:groupId', getMessagesByGroup);  // Fetch messages by group

export default router;
