import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { PageHome } from './PageHome';
import { PageLogin } from './PageLogin';
import { Navbar } from './Navbar';
import { PageTask } from './PageTask';

export default function App() {
  const UnauthenticatedContainer = () => <Route component={PageLogin} />;

  const AuthenticatedContainer = () => {
    return (
      <div>
        <Navbar />
        <Route exact path={'/task/:taskId'} component={PageTask} />
        <Route exact path={'/'} component={PageHome} />
      </div>
    );
  };

  return (
    <Router>
      <div>
        <Switch>
          <Route path='/login' component={UnauthenticatedContainer} />
          <Route path={'/'} component={AuthenticatedContainer} />
          <Redirect to={'/'} />
        </Switch>
      </div>
    </Router>
  );
}
