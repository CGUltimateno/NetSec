import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import * as CryptoJS from 'crypto-js'



const SECRET_KEY = "aelwfhlaef";


export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: { username: "" }
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({ redirect: "/home" });
        this.setState({ currentUser: currentUser, userReady: true })
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />
        }

        const { currentUser } = this.state;
        let originalFirstName = '';
        let originalLastName = '';
        console.log(currentUser)
            try {
                let bytesFirstName = CryptoJS.AES.decrypt(currentUser.FirstName, SECRET_KEY);
                originalFirstName = bytesFirstName.toString(CryptoJS.enc.Utf8);

                let bytesLastName = CryptoJS.AES.decrypt(currentUser.LastName, SECRET_KEY);
                originalLastName = bytesLastName.toString(CryptoJS.enc.Utf8);

                console.log(originalFirstName, originalLastName)
            } catch (error) {
                console.error("Decryption error:", error);
                // Handle decryption error, e.g., set default values or show an error message
            }
        return (
            <div className="container">
                {(this.state.userReady) ?
                    <div>
                        <header className="jumbotron">
                            <h3>
                                <strong>{currentUser.username}</strong> Profile
                            </h3>
                        </header>
                        <p>
                            <strong>Token:</strong>{" "}
                            {currentUser.accessToken.substring(0, 20)} ...{" "}
                            {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
                        </p>
                        <p>
                            <strong>Id:</strong>{" "}
                            {currentUser.id}
                        </p>
                        <p>
                            <strong>Email:</strong>{" "}
                            {currentUser.email}
                        </p>
                        <p>
                            <strong>Full Name:</strong>{" "}
                            {originalFirstName} {originalLastName}
                        </p>
                        <p>
                            <strong>Authorities:</strong>
                        </p>
                        <ul>
                            {currentUser.roles &&
                                currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
                        </ul>
                    </div> : null}
            </div>
        );
    }
}