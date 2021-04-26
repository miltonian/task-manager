import React from 'react';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { makeRequest } from '../Request';
import { TaskList } from '../components/TaskList';

export const PageHome = () => {
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
      <TaskList tasks={tasks || []} refresh={getTasks} />
    </div>
  );
};
