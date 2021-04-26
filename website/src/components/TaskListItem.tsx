import { List, Card, Checkbox } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';
import { onUpdateTask } from '../pages/PageTask';
import moment from 'moment';

interface TaskListItemProps {
  task: TaskAPI.Task;
  refresh: () => Promise<void>;
}
export const TaskListItem: React.FunctionComponent<TaskListItemProps> = ({
  task,
  refresh,
}) => {
  const history = useHistory();

  const onChange = async () => {
    const status = task.status === 'New' ? 'Completed' : 'New';
    const resp = await onUpdateTask({ ...task, status });
    resp && refresh();
  };

  return (
    <List.Item>
      <Card
        title={
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <Checkbox
                checked={task.status === 'Completed'}
                style={{ marginRight: 10 }}
                onChange={onChange}
              />
              <a onClick={() => history.push(`/task/${task.id}`)}>
                {task.name}
              </a>
            </div>
            {formatDueDate(task.dueDate)}
          </div>
        }
      >
        {task.description}
      </Card>
    </List.Item>
  );
};

export const formatDueDate = (dueDate: string) => {
  switch (moment(dueDate).endOf('day').diff(moment().endOf('day'), 'days')) {
    case -1:
      return 'Yesterday';
    case 0:
      return 'Today';
    case 1:
      return 'Tomorrow';
    default:
      return moment(dueDate).format('MM/DD/YYYY');
  }
};
