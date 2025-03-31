import { Request, Response } from 'express';
import { Trainer } from '../models/Trainer';
import { User } from '../models/User';
import { validationResult } from 'express-validator';

// Get all trainers
export const getAllTrainers = async (req: Request, res: Response) => {
  try {
    const trainers = await Trainer.find()
      .populate('userId', 'firstName lastName email')
      .select('-__v');
    
    res.json(trainers);
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single trainer
export const getTrainer = async (req: Request, res: Response) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .populate('userId', 'firstName lastName email')
      .select('-__v');

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.json(trainer);
  } catch (error) {
    console.error('Get trainer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create trainer
export const createTrainer = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      userId,
      skills,
      experience,
      bio,
      hourlyRate,
      availability
    } = req.body;

    // Check if user exists and is a trainer
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'trainer') {
      return res.status(400).json({ message: 'User is not a trainer' });
    }

    // Check if trainer profile already exists
    const existingTrainer = await Trainer.findOne({ userId });
    if (existingTrainer) {
      return res.status(400).json({ message: 'Trainer profile already exists' });
    }

    const trainer = new Trainer({
      userId,
      skills,
      experience,
      bio,
      hourlyRate,
      availability
    });

    await trainer.save();

    res.status(201).json(trainer);
  } catch (error) {
    console.error('Create trainer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update trainer
export const updateTrainer = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      skills,
      experience,
      bio,
      hourlyRate,
      availability,
      status
    } = req.body;

    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    // Update fields
    if (skills) trainer.skills = skills;
    if (experience) trainer.experience = experience;
    if (bio) trainer.bio = bio;
    if (hourlyRate) trainer.hourlyRate = hourlyRate;
    if (availability) trainer.availability = availability;
    if (status) trainer.status = status;

    await trainer.save();

    res.json({
      message: 'Trainer updated successfully',
      trainer
    });
  } catch (error) {
    console.error('Update trainer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete trainer
export const deleteTrainer = async (req: Request, res: Response) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    await trainer.remove();

    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('Delete trainer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update trainer availability
export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { availability } = req.body;
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    trainer.availability = availability;
    await trainer.save();

    res.json({
      message: 'Availability updated successfully',
      availability: trainer.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update trainer documents
export const updateDocuments = async (req: Request, res: Response) => {
  try {
    const { documents } = req.body;
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    trainer.documents = documents;
    await trainer.save();

    res.json({
      message: 'Documents updated successfully',
      documents: trainer.documents
    });
  } catch (error) {
    console.error('Update documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 