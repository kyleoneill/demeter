import React from 'react';

class User extends React.Component {
    render() {
        if(this.props.username === null) {
            return(
                <div className="user-page">
                    You are not signed in
                </div>
            )
        }
        else {
            return(
                <div className="user-page">
                    User page for {this.props.username}
                </div>
            )
        }
    }
}

export default User;