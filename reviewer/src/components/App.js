import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

import Login from '../pages/login';
import Register from '../pages/register';
import Start from '../pages/start';
import Home from '../pages/home';
import PrivateRoute from '../components/privateRoute';
import Movies from '../pages/movies';
import Books from '../pages/books';
import Games from '../pages/games';
import MyReviews from '../pages/my-reviews';
import EditReview from '../pages/edit-review';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={Start} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/home" component={Home} />
            <PrivateRoute exact path="/home/movies" component={Movies} />
            <PrivateRoute exact path="/home/books" component={Books} />
            <PrivateRoute exact path="/home/games" component={Games} />
            <PrivateRoute
              exact
              path="/home/:category/my-reviews"
              component={MyReviews}
            />
            <PrivateRoute
              exact
              path="/home/:category/my-reviews/edit"
              component={EditReview}
            />
            <Redirect to="/" />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
