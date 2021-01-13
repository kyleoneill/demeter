import React from 'react';
import {
    Button,
    Form,
    Input,
    Label
} from 'semantic-ui-react';
import '../css/create-user.css';
import {createUser} from '../api';

function passwordIsValid(password) {
    if(password.length >= 8) {
        return true;
    }
    else {
        return false;
    }
}

class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            passwordConfirm: "",
            usernameErrorText: "",
            passwordErrorText: "",
            errorText: ""
        }
    }
    handleUsernameChange = (e) => {
        this.setState({username: e.target.value})
    }
    handlePasswordChange = (e) => {
        this.setState({password: e.target.value})
    }
    handlePasswordConfirmChange = (e) => {
        this.setState({passwordConfirm: e.target.value})
    }
    handleSubmit = async () => {
        if(this.state.username !== "" && this.state.password !== "" && this.state.password === this.state.passwordConfirm) {
            if(passwordIsValid(this.state.password)) {
                try {
                    let res = await createUser(this.state.username, this.state.password);
                    if(res.status === 200) {
                        //TODO - success
                    }
                    else if(res.status === 226) {
                        let username = this.state.username;
                        this.setState({
                            passwordErrorText: "",
                            errorText: `Username ${username} is already taken`,
                            usernameErrorText: ""
                        })
                    }
                    else {
                        this.setState({
                            passwordErrorText: "",
                            errorText: "An unknown error has occured",
                            usernameErrorText: ""
                        })
                    }
                    console.log(res);
                }
                catch(e) {
                    console.log(e)
                }
            }
            else {
                this.setState({
                    passwordErrorText: "This password is not valid, make sure it's at least 8 characters.",
                    errorText: "",
                    usernameErrorText: ""
                });
            }
        }
        else {
            this.setState({
                errorText: "Please make sure that the username and password are filled out and that the password matches the password confirmation.",
                passwordErrorText: "",
                usernameErrorText: ""
            });
        }
    }
    render() {
        if(this.props.username === null) {
            return(
                <div className="create-account-page">
                    <Form className="create-user-form">
                        <Form.Field>
                            <label>Username</label>
                            <Input placeholder="Username" onChange={this.handleUsernameChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <Input placeholder="Password" type="password" onChange={this.handlePasswordChange} />
                            {this.state.passwordErrorText !== "" && 
                                <Label basic color="red" pointing>{this.state.passwordErrorText}</Label>
                            }
                        </Form.Field>
                        <Form.Field>
                            <label>Confirm Password</label>
                            <Input placeholder="Confirm Password" type="password" onChange={this.handlePasswordConfirmChange} />
                        </Form.Field>
                        {this.state.errorText !== "" &&
                            <Form.Field>
                                <Label basic color="red">{this.state.errorText}</Label>
                            </Form.Field>
                        }
                        <Button type="submit" onClick={this.handleSubmit}>Submit</Button>
                    </Form>
                </div>
            )
        }
        else {
            return(
                <div className="create-account-page">
                    You already have an account. If you wish to create another one, please log out first.
                </div>
            )
        }
    }
}

export default CreateAccount;