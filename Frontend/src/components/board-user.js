import React, { Component } from "react";

import UserService from "../services/user.service";

export default class BoardUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: "Hello, ",
            user: JSON.parse(sessionStorage.getItem('user')) || {}
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="container">
                <header className="jumbotron">
                    <h3>{this.state.content} {this.state.user.username}</h3>
                </header>
            </div>
        );
    }
}