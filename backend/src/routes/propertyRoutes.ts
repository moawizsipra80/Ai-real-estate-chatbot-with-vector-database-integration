import { Router } from 'express';
import { 
  chatWithAI, 
  streamChatWithAI, 
  getProperties, 
  getPropertyById, 
  createProperty 
} from '../controllers/propertyController';

const router = Router();

// AI Assistant Endpoints
router.post('/ai/chat', chatWithAI);
router.post('/ai/chat/stream', streamChatWithAI);

// Property CRUD Endpoints
router.get('/properties', getProperties);
router.get('/properties/:id', getPropertyById);
router.post('/properties', createProperty);

export default router;
