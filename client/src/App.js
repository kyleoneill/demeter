import React from 'react';
import './App.css';
import Home from './pages/home';
import User from './pages/user';
import Recipes from './pages/recipe';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import {
  Button,
} from 'semantic-ui-react';
import LoginModal from './components/sign-in-modal';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      token: null
    }
  }

  componentDidMount() {
    this.setState({
      username: localStorage.getItem("username"),
      token: localStorage.getItem("token")
    });
  }

  handleLogin = async (username, token) => {
    this.setState({username: username, token: token});
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
  }
  handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    this.setState({username: null, token: null});
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="app-name">Demeter</h1>
          <div className="header-account-manager">
            {this.state.username === null && <LoginModal handleLogin={this.handleLogin}/>}
            {this.state.username !== null && <Button onClick={this.handleLogout}>Logout</Button>}
          </div>
        </header>
        <Router>
          <div>
            <nav className="header-nav-bar">
              <ul>
                <li>
                  <NavLink to="/" activeClassName="selected" exact={true}>Home</NavLink>
                </li>
                <li>
                  <NavLink to="/recipes" activeClassName="selected">Recipes</NavLink>
                </li>
              </ul>
            </nav>
            <Switch>
              <Route path="/user">
                <User username={this.state.username} />
              </Route>
              <Route path="/recipes">
                <Recipes username={this.state.username} token={this.state.token}/>
              </Route>
              <Route path="/">
                <Home username={this.state.username} />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
