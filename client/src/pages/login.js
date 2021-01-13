import React from 'react';
import '../css/login.css';

class Login extends React.Component {
    render() {
        if(this.props.username === null) {
            return(
                <div className="login-page">
                    Login
                </div>
            )
        }
        else {
            return(
                <div className="login-page">
                    You're already signed in as {this.props.username}
                </div>
            )
        }
    }
}

export default Login;