import React from 'react';
import './App.css';
import Home from './pages/home';
import Login from './pages/login';
import User from './pages/user';
import CreateAccount from './pages/create-user';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LoginModal from './components/sign-in-modal';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null
    }
  }
  handleLogin = (username, password) => {
    this.setState({username: username});
  }
  handleCreateAccount = (username, password) => {
    console.log("create account callback")
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="app-name">Demeter</h1>
          <div className="header-account-manager">
            {this.state.username === null && <LoginModal handleLogin={this.handleLogin} handleCreateAccount={this.handleCreateAccount}/>}
            {this.state.username !== null && <p>Signed in as {this.state.username}</p>}
          </div>
        </header>
        <Router>
          <div>
            <nav className="header-nav-bar">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                  {this.state.username !== null ? <Link to="/user">{this.state.username}</Link> : <Link to="/login">Login</Link>}
                  {this.state.username === null && <Link to="/create-account">Create Account</Link>}
                </li>
              </ul>
            </nav>
            <Switch>
              <Route path="/login">
                <Login username={this.state.username} />
              </Route>
              <Route path="/user">
                <User username={this.state.username} />
              </Route>
              <Route path="/create-account">
                <CreateAccount username={this.state.username} />
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
