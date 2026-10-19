const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const { validateTaskPayload } = require('../lib/taskValidation');
const isValidObjectId = (value) => Task.db.base.Types.ObjectId.isValid(value);

// All routes require authentication
router.use(authMiddleware);

// Get all tasks for user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const { errors, updates } = validateTaskPayload(req.body, { requireTitle: true });

    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] });
    }
    
    const task = new Task({
      userId: req.user.id,
      title: updates.title,
      description: updates.description ?? '',
      status: updates.status || 'todo',
      priority: updates.priority || 'medium',
      dueDate: updates.dueDate ?? null,
      tag: updates.tag ?? '',
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    const { errors, updates } = validateTaskPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }
    
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (updates.title !== undefined) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.status !== undefined) task.status = updates.status;
    if (updates.priority !== undefined) task.priority = updates.priority;

    if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
    if (updates.tag !== undefined) task.tag = updates.tag;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
