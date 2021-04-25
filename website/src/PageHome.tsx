import { Button, List, Card } from 'antd';
import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { makeRequest } from './Request';
import moment from 'moment';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { onUpdateTask } from './PageTask';

export const PageHome = (props: RouteComponentProps) => {
  const [tasks, setTasks] = React.useState<TaskAPI.Task[]>();
  const [initialCall, setInitialCall] = React.useState<boolean>(false);
  const history = useHistory();

  const getTasks = async () => {
    setInitialCall(true);
    const resp = await makeRequest<TaskAPI.Task[]>(`/api/task`);
    resp && setTasks(resp);
  };

  !initialCall && getTasks();

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex' }}>
        <h1 style={{ flex: 1 }}>Tasks</h1>
        <Button onClick={() => history.push('/task/new')}>Add New</Button>
      </div>
      {tasks && <TaskList tasks={tasks} refresh={getTasks} />}
    </div>
  );
};

const formatDueDate = (dueDate: string) => {
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

interface TaskListProps {
  tasks: TaskAPI.Task[];
  refresh: () => Promise<void>;
}
const TaskList: React.FunctionComponent<TaskListProps> = ({
  tasks,
  refresh,
}) => {
  const history = useHistory();
  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      renderItem={(task) => {
        return (
          <List.Item>
            <Card
              title={
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 1 }}>
                    <Checkbox
                      checked={task.status === 'Completed'}
                      style={{ marginRight: 10 }}
                      onChange={async () => {
                        const resp = await onUpdateTask({
                          ...task,
                          status: task.status === 'New' ? 'Completed' : 'New',
                        });
                        resp && refresh();
                      }}
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
      }}
      dataSource={tasks}
    />
  );
};
