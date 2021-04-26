import React from 'react';
import { Link } from 'react-router-dom';
import { CACHED_USER } from '../Request';

export const Navbar: React.FunctionComponent<{}> = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: 20 }}>
      <div style={{ flex: 1 }}>
        <Link to='/'>
          <h2>Task Manager</h2>
        </Link>
      </div>
      <a
        onClick={() => {
          localStorage.removeItem(CACHED_USER);
          window.location.href = '/login';
        }}
      >
        Logout
      </a>
    </div>
  );
};
