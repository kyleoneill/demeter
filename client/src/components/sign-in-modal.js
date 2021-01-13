import React from 'react';
import {
    Modal,
    Button,
    Form,
    Input
} from 'semantic-ui-react';
import '../css/login.css';

class LoginModal extends React.Component {
    state = {
        modalOpen: false,
        modalName: "Login",
        username: "",
        password: "",
        passwordConfirm: ""
    };
    handleOpen = () => this.setState({
        modalOpen: true,
        modalName: "Login",
        username: "",
        password: "",
        passwordConfirm: ""
    });
    handleClose = () => this.setState({
        modalOpen: false,
        modalName: "Login",
        username: "",
        password: "",
        passwordConfirm: ""
    });
    handleSwitch = () => {
        if(this.state.modalName === "Login") {
            this.setState({
                modalName: "Create Account",
                username: "",
                password: "",
                passwordConfirm: ""
            });
        }
        else {
            this.setState({
                modalName: "Login",
                username: "",
                password: "",
                passwordConfirm: ""
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
    handleLoginSubmit = (e) => {
        e.preventDefault();
        if(this.state.modalName === "Login") {
            if(this.state.username !== "" && this.state.password !== "") {
                this.props.handleLogin(this.state.username, this.state.password);
                return true;
            }
            return false;
        }
        else {
            if(this.state.username !== "" && this.state.password !== "" && this.state.passwordConfirm !== "" && this.state.password === this.state.passwordConfirm) {
                this.props.handleCreateAccount(this.state.username, this.state.password);
                return true;
            }
            return false;
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
                            let res = this.handleLoginSubmit(e);
                            if(res) {this.handleClose()};
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