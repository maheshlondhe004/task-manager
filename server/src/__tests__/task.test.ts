import { Task } from '../modules/task-management/entities/task.entity';

describe('Task Entity', () => {
  it('should create a new task instance', () => {
    const task = new Task();
    task.title = 'Test Task';
    task.description = 'Test Description';
    task.status = 'TODO';
    task.isCompleted = false;

    expect(task).toBeInstanceOf(Task);
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('Test Description');
    expect(task.status).toBe('TODO');
    expect(task.isCompleted).toBe(false);
  });
});
