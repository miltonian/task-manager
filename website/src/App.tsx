import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { PageHome } from './pages/PageHome';
import { PageLogin } from './pages/PageLogin';
import { Navbar } from './components/Navbar';
import { PageTask } from './pages/PageTask';

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
