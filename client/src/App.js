import React, { Component } from 'react';
// import logo from './logo.svg';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

import Shell from './components/Shell';
import SimulatorShell from './Containers/Simulator/SimulatorShell';

import './App.css';

import { Provider } from "react-redux";
import configureStore from "./store";
import config from './config';
import AuthHelper from './AuthHelper';
import { Paper, Grid, Button, IconButton, Typography } from '@material-ui/core';
import { DeveloperMode } from '@material-ui/icons';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: true,
      user: null,
      token: ''
    };
  }


  googleResponse = (response) => {
        console.log('response', response);
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        let url = config.instance.getAdminApiUrl() + 'auth/google';
        console.log('url', url);
        console.log('access_token', response.access_token);
        axios.get(url, {
          headers: {
            access_token: response.accessToken
          }
        }).then((res) => {
          console.log('res',res);
          const token = res.headers['x-auth-token'];
          localStorage.setItem("auth-token", token);
          this.setState({
            isAuthenticated: true,
            user: res.data
          });
    });
  };

  render() {
    return (
      <Provider store={configureStore()}>
        <Shell />
      </Provider>
    );
  }
}

export default App;

const styles = {
  grid: {
    marginTop: '10%',
    marginLeft: '20%',
    marginRight: '20%',
    marginBottom: '20%',
    border: '3px solid #831057',
    borderRadius: '10px',
    padding: '10%',
    paddingTop: '14%'
  },
}