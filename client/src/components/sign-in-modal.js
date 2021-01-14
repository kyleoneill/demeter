import React from 'react';
import {
    Modal,
    Button,
    Form,
    Input,
    Label
} from 'semantic-ui-react';
import '../css/login.css';
import {createUser, login} from '../api';

class LoginModal extends React.Component {
    state = {
        modalOpen: false,
        modalName: "Login",
        username: "",
        password: "",
        passwordConfirm: "",
        errorText: ""
    };
    handleOpen = () => this.setState({
        modalOpen: true,
        modalName: "Login",
        username: "",
        password: "",
        passwordConfirm: "",
        errorText: ""
    });
    handleClose = () => this.setState({
        modalOpen: false,
        modalName: "Login",
        username: "",
        password: "",
        passwordConfirm: "",
        errorText: ""
    });
    handleSwitch = () => {
        if(this.state.modalName === "Login") {
            this.setState({
                modalName: "Create Account",
                username: "",
                password: "",
                passwordConfirm: "",
                errorText: ""
            });
        }
        else {
            this.setState({
                modalName: "Login",
                username: "",
                password: "",
                passwordConfirm: "",
                errorText: ""
            });
        }
    };
    handleUsernameChange = (e) => {
        this.setState({username: e.target.value})
    };
    handlePasswordChange = (e) => {
        this.setState({password: e.target.value})
    };
    handlePasswordConfirmChange = (e) => {
        this.setState({passwordConfirm: e.target.value})
    };
    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.modalName === "Login") {
            if(this.state.username !== "" && this.state.password !== "") {
                login(this.state.username, this.state.password).then((res) => {
                    let user = this.state.username;
                    this.handleClose();
                    this.props.handleLogin(user, res.data.token);
                }).catch((e) => {
                    let errorMessage = "Login failed"
                    if(e.message.includes("404")) {
                        errorMessage = "Username not found";
                    }
                    else if(e.message.includes("406")) {
                        errorMessage = "Incorrect password";
                    }
                    this.setState({errorText: errorMessage});
                })
            }
        }
        else {
            if(this.state.username !== "" && this.state.password !== "" && this.state.passwordConfirm !== "" && this.state.password === this.state.passwordConfirm) {
                if(this.state.password.length >= 8) {
                    createUser(this.state.username, this.state.password).then((res) => {
                        let user = this.state.username;
                        this.handleClose();
                        this.props.handleLogin(user, res.data.token);
                    }).catch((e) => {
                        let errorMessage = "Failed to create new user";
                        if(e.message.includes("226")) {
                            errorMessage = "Username is already taken";
                        }
                        this.setState({errorText: errorMessage});
                    });
                }
                else {
                    this.setState({errorText: "Password must be at least 8 characters"});
                }
            }
            else {
                this.setState({errorText: "Each field must be set and passwords must match"});
            }
        }
    };
    render() {
        return(
            <div>
                <Button onClick={this.handleOpen}>Login</Button>
                <Modal
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    className="login-page"
                    closeIcon
                >
                    <Modal.Header>{this.state.modalName}</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={(e) => {
                            this.handleSubmit(e);
                        }}>
                            <Form.Field>
                                <label>Username</label>
                                <Input 
                                    placeholder="Username"
                                    onChange={this.handleUsernameChange}
                                    value={this.state.username}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Password</label>
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    onChange={this.handlePasswordChange}
                                    value={this.state.password}
                                />
                            </Form.Field>
                            {this.state.modalName !== "Login" && 
                                <Form.Field>
                                    <label>Confirm Password</label>
                                    <Input
                                        placeholder="Confirm Password"
                                        type="password"
                                        onChange={this.handlePasswordConfirmChange}
                                        value={this.state.passwordConfirm}
                                    />
                                </Form.Field>
                            }
                            {this.state.errorText !== "" &&
                            <Form.Field>
                                <Label basic color="red">{this.state.errorText}</Label>
                            </Form.Field>
                            }
                            <Button>{this.state.modalName}</Button>
                        </Form>
                    </Modal.Content>
                    <div className="modal-footer">
                        <p>{this.state.modalName === "Login" ? "Don't have an account?" : "Already have an account?"}
                            <span className="form-switch" onClick={this.handleSwitch}>{this.state.modalName === "Login" ? " Create one" : " Login"}</span>
                        </p>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default LoginModal;