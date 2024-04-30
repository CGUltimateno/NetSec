import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import * as CryptoJS from 'crypto-js'



const SECRET_KEY = "YWGbHGpyfKZflZ2vy9gQn1+e2Rdqbx3aRVjsomaOum/FQA1m0KKDCyhi0sZPtrQ0";


export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: { username: "", FirstName: "", LastName: ""  }
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({ redirect: "/home" });
        this.setState({ currentUser: currentUser, userReady: true })
    }

    decrypt = (text) => {

        const key = CryptoJS.SHA512(SECRET_KEY).toString().substring(0, 32);
       
    
        const bytes = CryptoJS.AES.decrypt(text, key, { });
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />
        }


        const { currentUser } = this.state;
        let originalFirstName = this.decrypt(currentUser.FirstName);
        let originalLastName = this.decrypt(currentUser.LastName);

        
        
       
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
                            <strong>First Name :</strong>{" "}
                            {originalFirstName} 
                        </p>
                        <p>
                        <strong>LastName :</strong>{" "}
                            {originalLastName} 
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