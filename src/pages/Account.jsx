import React, { Component } from 'react';
import axios from 'axios';
import { signInMutation, signUpMutation } from '../requests';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import '../style/Account.css';

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
    }

    handleChange(event) {
        const { target: { name, value } } = event;
        this.setState({ [name]: value });
    }

    submitCredentials(operation, hasSignedIn) {
        let sendCookie = null;
        hasSignedIn ? sendCookie = true : sendCookie = false;

        axios({
            url: 'http://localhost:4000/graphql',
            method: 'POST',
            data: {
                query: operation,
                variables: { _id: this.state.username, password: this.state.password }
            },
            withCredentials: sendCookie
        }).then(function (result) {
            if (result.data.errors) {
                let errorBox = document.getElementById('error-box');
                errorBox.innerHTML = `${result.data.errors[0].message}`;
            } else {
                if (hasSignedIn) {
                    window.location.href = window.location.origin + '/directory';
                } else {
                    window.location.href = window.location.origin;
                }
            }
        }).catch(function (err) {
            console.log(err);
        });
    }

    handleSignUp(event) {
        event.preventDefault();
        this.submitCredentials(signUpMutation, false);
    }

    handleSignIn(event) {
        event.preventDefault();
        this.submitCredentials(signInMutation, true);
    }

    render() {
        return (
            <React.Fragment>
                <div id='error-box' />
                <form id="form">
                    <TextField required id="username_field" label="Username" variant="outlined" value={this.state.username} autoComplete='off' name='username' onChange={this.handleChange} />

                    <TextField required id="password_field" type="password" label="Password" variant="outlined" value={this.state.password} autoComplete='off' name='password' onChange={this.handleChange} />

                    <Button id="register_button" variant="contained" onClick={this.handleSignUp}>Sign Up</Button>
                    <Button id="login_button" variant="contained" onClick={this.handleSignIn}>Sign In</Button>

                    <Link to="/credits"><Button id="credits_button" variant="contained" color="primary">Credits Page</Button></Link>
                </form>
            </React.Fragment>
        );
    }
}

export default Account;