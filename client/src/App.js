import React from 'react';
import './App.css';
import Home from './pages/home';
import User from './pages/user';
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
      username: null,
      token: null
    }
  }
  handleLogin = async (username, token) => {
    console.log(`user: ${username}, token: ${token}`)
    this.setState({username: username, token: token})
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="app-name">Demeter</h1>
          <div className="header-account-manager">
            {this.state.username === null && <LoginModal handleLogin={this.handleLogin}/>}
            {this.state.username !== null && <p>Signed in as {this.state.username}</p>}
          </div>
        </header>
        <Router>
          <div>
            <nav className="header-nav-bar">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
              </ul>
            </nav>
            <Switch>
              <Route path="/user">
                <User username={this.state.username} />
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
