import express from 'express';
import { 
  getDeviceSettings, 
//   calculateRuleBasedSettings,
//   calculateContextAwareSettings 
} from '../controllers/automationController.js';

const router = express.Router();

// Get optimized device settings
router.post('/calculate', getDeviceSettings);

export default router;
