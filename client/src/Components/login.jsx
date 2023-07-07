import React, { useState,useEffect } from 'react';
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google'
import jwt_decode from "jwt-decode";
import axios from 'axios';
import Cookies from 'js-cookie';

import { ToastContainer, toast } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';

import { EuiFlexGroup, EuiForm, EuiFlexItem, EuiTitle, EuiFieldText, EuiSpacer, EuiButton, EuiText, EuiImage } from '@elastic/eui';
import { useNavigate } from 'react-router-dom';

const image = require('./Abstraction.png');

export const Login = () => {
  const notify = () => {
    toast.success("Login Up Successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false
    });
  }
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;

        // Store the token in a cookie
        Cookies.set('token', token);

        // Redirect to the home page
        navigate('/home');
      } else {
        const errorMessage = data.error || 'Invalid Login';
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 20000
        });
        // window.alert(errorMessage);
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error("An error occurred while logging in. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 20000
      });
      // window.alert('An error occurred while logging in. Please try again.');
    }
  };

  return (
    <>
      <EuiFlexGroup className="login">
      <EuiFlexItem className="login-left">
        <EuiTitle className="login-left-first">
          <h1>Discover a world of exclusive content and features.</h1>
        </EuiTitle>
        <EuiTitle className="login-left-second">
          <h2>Don't miss out!</h2>
        </EuiTitle>
        <EuiImage src={image} className="login-left-image" alt="" />
      </EuiFlexItem>
      <EuiFlexItem className="login-content">
        <EuiFlexGroup justifyContent="center" direction="column" className="login-content-list">
          <EuiFlexItem grow={false}>
            <EuiTitle>
              <h1>Login</h1>
            </EuiTitle>
          </EuiFlexItem>
          <EuiSpacer size="l" />
          <EuiForm method="POST">
            <EuiFlexItem grow={false}>
              <EuiFieldText
                type="email"
                placeholder="Email"
                value={email}
                className="login-content-field"
                onChange={(e) => setEmail(e.target.value)}
              />
            </EuiFlexItem>
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />
            <EuiFlexItem grow={false}>
              <EuiFieldText
                type="password"
                placeholder="Password"
                value={password}
                className="login-content-field"
                onChange={(e) => setPassword(e.target.value)}
              />
            </EuiFlexItem>
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />
         
            <EuiFlexItem grow={false}>
              <EuiButton color="primary" type="submit" onClick={loginUser} fill>
                Login
              </EuiButton>
            </EuiFlexItem>
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />

            <EuiFlexItem grow={false}>
              <GoogleOAuthProvider clientId="169913165441-vckun6gils9uptouppnpvo9es0rap3ra.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={async(credentialResponse) => {
                    const undecodedToken =credentialResponse.credential;
                    Cookies.set('undecodedToken', undecodedToken);

                    try {
                      const response = await axios.post('/google/login', {
                        token: undecodedToken,
                      });
                    
                      const { msg, token } = response.data;
                      // Handle the response messages from the backend API
                      // window.alert(msg);
                      notify();
                
                      // Store the token in a cookie
                      Cookies.set('token', token);
                      navigate("/home");
                    } catch (error) {
                      const errorMessage = error.response.data.msg;
                      toast.error(errorMessage, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 20000
                      });
                      // window.alert(errorMessage);
                      console.log('Error occurred during authentication:', error);
                    }
                  }
                }
                />
            </GoogleOAuthProvider>
            </EuiFlexItem>
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />

           
            <EuiFlexItem grow={false}>
              <EuiText className="login-content-signuplink">
                <p>If you haven’t signed up, please </p>
                <a href="./signup">Sign Up.</a>
              </EuiText>
            </EuiFlexItem>
          </EuiForm>
        </EuiFlexGroup>
      </EuiFlexItem>
      <ToastContainer />
    </EuiFlexGroup>
    </>
 
  );
};
