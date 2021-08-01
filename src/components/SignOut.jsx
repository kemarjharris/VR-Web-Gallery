import React, { Component } from 'react';
import axios from 'axios';
import { signOutQuery } from '../requests';
import { Button } from '@material-ui/core';

class SignOut extends Component {
    constructor() {
        super();
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    handleSignOut(event) {
        event.preventDefault();
        axios({
            url: 'http://localhost:4000/graphql',
            method: 'POST',
            data: {
                query: signOutQuery
            },
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        }).then(function (result) {
            if (result.data.errors) {
                console.log(result.data.errors);
                let errorBox = document.getElementById('error-box');
                errorBox.innerHTML = `${result.data.errors[0].message}`;
            } else {
                window.location.href = "/";
            }
        }).catch(function (err) {
            console.log(err);
        });
    }

    render() {
        // https://gist.github.com/rendro/525bbbf85e84fa9042c2https://gist.github.com/rendro/525bbbf85e84fa9042c2
        let entries = Object.fromEntries(document.cookie.split(/; */).map(c => {
            const [ key, ...v ] = c.split('=');
            return [ key, decodeURIComponent(v.join('=')) ];
        }));
        if (!entries.username) return null;
        return (
            <React.Fragment>
                <div id='error-box' />
                <Button variant="contained" onClick={(event) => this.handleSignOut(event)}> Sign Out </Button>
            </React.Fragment>
        );
    }
}

export default SignOut;

