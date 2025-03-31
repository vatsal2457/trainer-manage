import express from 'express';
import { body } from 'express-validator';
import {
  getAllTrainers,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  updateAvailability,
  updateDocuments
} from '../controllers/trainerController';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const trainerValidation = [
  body('userId').isMongoId().withMessage('Invalid user ID'),
  body('skills').isArray().withMessage('Skills must be an array'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('bio').isLength({ min: 50, max: 500 }).withMessage('Bio must be between 50 and 500 characters'),
  body('hourlyRate').isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  body('availability').isArray().withMessage('Availability must be an array')
];

const availabilityValidation = [
  body('availability').isArray().withMessage('Availability must be an array'),
  body('availability.*.day')
    .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    .withMessage('Invalid day'),
  body('availability.*.slots').isArray().withMessage('Slots must be an array')
];

const documentsValidation = [
  body('documents').isArray().withMessage('Documents must be an array'),
  body('documents.*.type').notEmpty().withMessage('Document type is required'),
  body('documents.*.url').isURL().withMessage('Invalid document URL')
];

// Routes
router.get('/', getAllTrainers);
router.get('/:id', getTrainer);

// Protected routes (require authentication)
router.post('/', auth, authorize('admin'), trainerValidation, createTrainer);
router.put('/:id', auth, authorize('admin', 'trainer'), trainerValidation, updateTrainer);
router.delete('/:id', auth, authorize('admin'), deleteTrainer);
router.put('/:id/availability', auth, authorize('admin', 'trainer'), availabilityValidation, updateAvailability);
router.put('/:id/documents', auth, authorize('admin', 'trainer'), documentsValidation, updateDocuments);

export default router; 