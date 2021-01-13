import React from 'react';
import '../css/home.css';

class Home extends React.Component {
    render() {
        return (
            <div className="home-page">
                Hi there, {this.props.username != null ? this.props.username : "guest"}
            </div>
        )
    }
}

export default Home;