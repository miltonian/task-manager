import { Task } from '../entity/Task';
import { getRepository } from 'typeorm';
import moment from 'moment';
import { createAuthenticatedUser, prepareDB } from '../test-helpers';
import { User } from '../entity/User';
import request from 'supertest';
import app from '../app';

describe('Task endpoints', () => {
  let authToken: string;

  const DEFAULT_TASK: Omit<
    TaskAPI.Task,
    'id' | 'dateCreated' | 'dateUpdated'
  > = {
    name: 'Important Task',
    dueDate: moment().add(2).format('YYYY-MM-DD'),
    description: 'Here is some instruction',
    status: 'New',
  };

  beforeEach(async () => {
    await prepareDB();

    const { token } = await createAuthenticatedUser();
    authToken = token;
  });

  describe('GET /task', () => {
    test('Returns all tasks', async () => {
      const taskRepo = getRepository(Task);
      await taskRepo.save({ ...DEFAULT_TASK });
      await taskRepo.save({ ...DEFAULT_TASK });
      await taskRepo.save({ ...DEFAULT_TASK });
      const resp = await request(app)
        .get('/api/task')
        .set('Authorization', `Bearer ${authToken}`);

      expect(resp.body.length).toEqual(3);
    });

    test('Returns a single task', async () => {
      const taskRepo = getRepository(Task);
      let task: Task = await taskRepo.save({ ...DEFAULT_TASK });
      await request(app)
        .get(`/api/task/${task.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      task = await taskRepo.findOne(task.id);
      expect(task.name).toEqual(DEFAULT_TASK.name);
      expect(task.description).toEqual(DEFAULT_TASK.description);
      expect(task.status).toEqual(DEFAULT_TASK.status);
      expect(task.dueDate).toEqual(moment(DEFAULT_TASK.dueDate).toDate());
    });
  });

  describe('POST /task', () => {
    test('Create new task', async () => {
      const taskRepo = getRepository(Task);

      const resp = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send(DEFAULT_TASK);

      const taskId = resp.body.id;

      const task = await taskRepo.findOne(taskId);
      expect(task.name).toEqual(DEFAULT_TASK.name);
      expect(task.description).toEqual(DEFAULT_TASK.description);
      expect(task.status).toEqual(DEFAULT_TASK.status);
      expect(task.dueDate).toEqual(moment(DEFAULT_TASK.dueDate).toDate());
    });

    test('Create new task with no payload', async () => {
      const taskRepo = getRepository(Task);
      const countBefore = taskRepo.count();
      const resp = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send();

      const countAfter = taskRepo.count();
      expect(resp.body.id).toBeFalsy();
      expect(countBefore).toEqual(countAfter);
    });

    test('Create new task with partial payload', async () => {
      const taskRepo = getRepository(Task);
      const countBefore = taskRepo.count();
      const resp = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: DEFAULT_TASK.name });

      const countAfter = taskRepo.count();
      expect(resp.body.id).toBeFalsy();
      expect(countBefore).toEqual(countAfter);
    });
  });

  describe('PUT /task/:taskId', () => {
    async function updateTask(payload: Partial<Task>, taskId: number) {
      const taskRepo = getRepository(Task);

      let task = await taskRepo.findOne(taskId);
      await request(app)
        .put(`/api/task/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      for (const [key, value] of Object.entries(payload)) {
        expect(task[key as keyof Task] === value).toEqual(false);
        task = await taskRepo.findOne(task.id);
        expect(task[key as keyof Task]).toEqual(value);
      }
    }

    test('Update a task name', async () => {
      const task = await getRepository(Task).save({ ...DEFAULT_TASK });
      await updateTask({ name: 'New Task Name' }, task.id);
    });
    test('Update a task due date', async () => {
      const task = await getRepository(Task).save({ ...DEFAULT_TASK });
      await updateTask(
        {
          dueDate: moment(task.dueDate).add(7, 'days').toDate(),
        },
        task.id
      );
    });
    test('Update a task description', async () => {
      const task = await getRepository(Task).save({ ...DEFAULT_TASK });
      await updateTask({ description: 'New task description' }, task.id);
    });
    test('Update a task status', async () => {
      const task = await getRepository(Task).save({ ...DEFAULT_TASK });
      await updateTask(
        { status: task.status === 'Completed' ? 'New' : 'Completed' },
        task.id
      );
    });
  });

  describe('DELETE /task/:taskId', () => {
    test('Delete a task', async () => {
      const taskRepo = getRepository(Task);
      let task: Task = await taskRepo.save({ ...DEFAULT_TASK });
      await request(app)
        .delete(`/api/task/${task.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      task = await taskRepo.findOne(task.id);
      expect(task).toBeFalsy();
    });

    test('Delete an empty task id', async () => {
      const resp = await request(app)
        .delete(`/api/task`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(resp.status).toEqual(404);
    });

    test('Delete a nonexistent task', async () => {
      const resp = await request(app)
        .delete(`/api/task/999`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(resp.status).toEqual(400);
    });
  });
});
