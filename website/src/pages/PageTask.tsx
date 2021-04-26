import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { makeRequest } from '../Request';
import {
  Button,
  Input,
  message,
  Row,
  DatePicker,
  Radio,
  Popconfirm,
} from 'antd';
import { Column } from './PageLogin';
import moment from 'moment';
import { isEqual } from 'lodash';

const EMPTY_TASK: TaskAPI.UpdateTaskRequest = {
  id: -1,
  name: '',
  description: '',
  status: 'New',
  dueDate: '',
};

export const PageTask = (props: RouteComponentProps<{ taskId?: string }>) => {
  const { taskId } = props.match.params;
  const [task, setTask] = React.useState<TaskAPI.Task>();
  const [initialCall, setInitialCall] = React.useState<boolean>(false);

  const getTask = async () => {
    setInitialCall(true);
    if (!taskId || taskId === 'new') return;
    const resp = await makeRequest<TaskAPI.Task | { error: string }>(
      `/api/task/${taskId}`
    );
    if ('error' in resp) {
      return message.error(resp.error);
    }

    setTask(resp);
  };

  !initialCall && getTask();

  if (taskId !== 'new' && !task) {
    return <div>Task could not be found</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <TaskForm task={task} />
    </div>
  );
};

export const onUpdateTask = async (updates: TaskAPI.UpdateTaskRequest) => {
  const path = updates.id === -1 ? `task` : `task/${updates.id}`;
  const resp = await makeRequest<TaskAPI.Task | { error: string }>(
    `/api/${path}`,
    updates.id === -1 ? 'POST' : 'PUT',
    updates
  );
  if ('error' in resp) {
    message.error(resp.error);
    return;
  }
  message.success(`Task has been updated`);
  return resp;
};

export const TaskForm: React.FunctionComponent<{
  task: TaskAPI.Task | undefined;
}> = ({ task }) => {
  const [values, setValues] = React.useState<TaskAPI.UpdateTaskRequest>(
    task || EMPTY_TASK
  );
  const history = useHistory();

  const statusOptions: TaskAPI.Status[] = ['New', 'Completed'];

  React.useEffect(() => setValues(task || EMPTY_TASK), [task]);

  const onDelete = async () => {
    const resp = await makeRequest<{ success?: boolean; error?: string }>(
      `/api/task/${values.id}`,
      'DELETE'
    );
    if (resp.error) {
      return message.error(resp.error);
    }
    message.success(`Task deleted`);
    history.replace('/');
  };

  return (
    <div>
      <Row>
        <Column>
          Name
          <Input
            placeholder={'Name'}
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          Due Date
          <DatePicker
            placeholder={moment().add(1, 'day').format('MM/DD/YYYY')}
            value={values.dueDate ? moment(values.dueDate) : undefined}
            onChange={(v) =>
              v && setValues({ ...values, dueDate: v?.format('YYYY-MM-DD') })
            }
          />
        </Column>
      </Row>
      <Row>
        <Column>
          Description
          <Input.TextArea
            placeholder={'Description'}
            value={values.description}
            rows={5}
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
          />
        </Column>
      </Row>
      <Row>
        <Column>
          Status
          <Radio.Group
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value })}
          >
            {statusOptions.map((o) => (
              <Radio key={o} value={o}>
                {o}
              </Radio>
            ))}
          </Radio.Group>
        </Column>
      </Row>
      <div style={{ display: 'flex', marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <Button
            type='primary'
            disabled={isEqual(task, values)}
            onClick={async () => {
              const task = await onUpdateTask(values);
              values.id === -1 && task && history.replace('/');
            }}
          >
            Save
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={() => history.push('/')}>
            Cancel
          </Button>
        </div>
        {values.id !== -1 && (
          <Popconfirm
            title={'Are you sure you want to delete this task?'}
            onConfirm={onDelete}
          >
            <Button danger>Delete Task</Button>
          </Popconfirm>
        )}
      </div>
    </div>
  );
};
