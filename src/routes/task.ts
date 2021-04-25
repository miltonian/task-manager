import express from 'express';
import { Task } from '../entity/Task';
import { getRepository } from 'typeorm';
import moment from 'moment';

const router = express.Router();

/**
 * Get all tasks
 */
router.get('/', async (req, res) => {
  const tasks = await getRepository(Task).find({
    order: { status: 'DESC', dueDate: 'DESC', name: 'ASC' },
  });
  res.json(tasks);
});

router.get('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    res.status(400).json({ error: 'Task ID is required' });
  }

  const task = await getRepository(Task).findOne({
    where: { id: taskId },
    order: { status: 'DESC', dueDate: 'DESC', name: 'ASC' },
  });
  res.json(task);
});

/**
 * New task
 */
router.post('/', async (req, res) => {
  const newTask = req.body as TaskAPI.UpdateTaskRequest;
  if (!newTask) {
    return res.status(400).json({ error: `We didn't see anything to save.` });
  }
  const { name, description, status, dueDate } = newTask;
  if (!name || !description || !status || !dueDate) {
    return res
      .status(400)
      .json({ error: 'Name, description, status, and due date are required' });
  }

  const resp = await getRepository(Task).save({
    ...newTask,
    id: undefined,
    dateUpdated: moment().format('YYYY-MM-DD'),
  });
  res.json({ success: !!resp });
});

/**
 * Update task
 */
router.put('/:taskId', async (req, res) => {
  const taskId = Number(req.params.taskId);
  if (!taskId) {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  const updates = req.body as Partial<TaskAPI.UpdateTaskRequest>;
  if (!updates || !(taskId > 0)) {
    return res.status(400).json({ error: `We didn't see anything to save.` });
  }

  const taskRepo = getRepository(Task);
  const task = await taskRepo.findOne(taskId);
  if (!task) {
    return res.status(400).json({ error: 'This task does not exist' });
  }

  const resp = await taskRepo.save({
    ...task,
    ...updates,
    id: Number(taskId),
    dateUpdated: moment().format(),
  });
  res.json({ success: !!resp });
});

/**
 * Delete task
 */
router.delete('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    return res.status(400).json({ error: 'Task ID is required' });
  }
  const taskRepo = getRepository(Task);
  const task = await taskRepo.findOne(taskId);
  if (!task) {
    return res.status(400).json({ error: 'This task does not exist' });
  }
  await taskRepo.delete(task.id);
  res.json({ success: true });
});

export default router;
