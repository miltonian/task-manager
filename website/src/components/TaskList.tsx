import React from 'react';
import { List } from 'antd';
import { TaskListItem } from './TaskListItem';

interface TaskListProps {
  tasks: TaskAPI.Task[];
  refresh: () => Promise<void>;
}
export const TaskList: React.FunctionComponent<TaskListProps> = ({
  tasks,
  refresh,
}) => (
  <List
    grid={{ gutter: 16, column: 1 }}
    renderItem={(task) => <TaskListItem task={task} refresh={refresh} />}
    dataSource={tasks}
  />
);
