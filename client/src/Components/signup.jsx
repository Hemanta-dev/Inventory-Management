import React, { useState } from 'react';
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google'
import jwt_decode from "jwt-decode";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, NavLink } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';

import { EuiFlexGroup, EuiFlexItem, EuiForm, EuiTitle, EuiTextArea, EuiFieldText, EuiSpacer, EuiButton, EuiText, EuiImage } from "@elastic/eui";
const image = require('./Abstraction.png');



const Signup = () => {
  const notify = () => {
    toast.success("User Sign Up Successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false
    });
  }
  
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    location: ""
  });

  let name, value;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const postData = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, location } = user;

    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password,
        confirmPassword,
        location
      })
    });
    const data = await response.json();
    if (response.ok) {
        notify();
        console.log("Sign Up Successfully");
        navigate("/");
      } else {
        const errors = data.errors;
        if (errors) {
          const errorMessage = Object.values(errors).join("\n");
          toast.error(errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 20000
          });
          console.log("Backend Errors:", errorMessage);
        } else {
          toast.error("Invalid Sign Up!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 20000
          });
          console.log("Invalid Sign Up");
        }
      }
      
  };

  return (
    
     

     <EuiFlexGroup className="login">
      <EuiFlexItem className="login-left">
        <EuiTitle className="login-left-first">
          <h1>Login for exclusive content and features. </h1>
        </EuiTitle>
        <EuiTitle className="login-left-second">
          <h2>Don't miss out!</h2>
        </EuiTitle>
        <EuiImage src={image} className="login-left-image" />
      </EuiFlexItem>
      <EuiFlexItem className="login-content signup-content">
        <EuiFlexGroup justifyContent="center" direction="column" className="login-content-list">
          <EuiFlexItem grow={false}>
            <EuiTitle>
              <h1>Signup</h1>
            </EuiTitle>
          </EuiFlexItem>
          <EuiSpacer size="l" />
 
          <EuiForm method="POST">
            <EuiFlexItem grow={false}>
              <EuiFieldText
                placeholder="Email"
                name="email"
                className="login-content-field"
                value={user.email}
                onChange={handleInputs}
              />
            </EuiFlexItem>
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />

            <EuiFlexItem grow={false}>
              <EuiFieldText
                placeholder="Password"
                name="password"
                className="login-content-field"
                value={user.password}
                onChange={handleInputs}
              />
            </EuiFlexItem>
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />

            <EuiFlexItem grow={false}>
              <EuiFieldText
                placeholder="Confirm Password"
                name="confirmPassword"
                className="login-content-field"
                value={user.confirmPassword}
                onChange={handleInputs}
              />
            </EuiFlexItem>
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />

            <EuiFlexItem grow={false}>
              <EuiFieldText
                placeholder="location"
                name="location"
                className="login-content-field"
                value={user.location}
                onChange={handleInputs}
              />
            </EuiFlexItem>
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />

            <EuiFlexItem grow={false}>
              <EuiButton color="primary" fill type="submit" onClick={postData}>
                Sign Up
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
                      const response = await axios.post('/google/signup', {
                        token: undecodedToken,
                      });
                  
                      // Handle the response from your backend API
                   
                      notify();
                      // window.alert("Signup successfully done with Google");
                      console.log(response.data,"222222222222222222222222222222");
                    } catch (error) {
                      const errorMessage = error.response.data.message;
                      toast.error(errorMessage, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 20000
                      });
                      // window.alert(errorMessage);
                      console.log('Error occurred during authentication:', error)
                    }
                  }
                }

                   
                 
                  //   var decodedToken = jwt_decode(credentialResponse.credential);
                  //   console.log(decodedToken); 
          
                  // }}
                  // onError={() => {
                  //   console.log('Login Failed');
                  // }}
                />
            </GoogleOAuthProvider>
            </EuiFlexItem>
            <EuiSpacer size="l" />
            <EuiSpacer size="l" />

            <EuiFlexItem grow={false}>
              <EuiText className="login-content-signuplink">
                <p>already have account login, please </p>
                <NavLink to="/">Login</NavLink>
              </EuiText>
            </EuiFlexItem>
          </EuiForm>
        </EuiFlexGroup>
      </EuiFlexItem>
      <ToastContainer />
    </EuiFlexGroup>
 
  );
};

export default Signup;
