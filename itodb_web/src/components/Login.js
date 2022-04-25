import React, { useState } from 'react';
// import './myApp.css';
import PropTypes from 'prop-types';
import {API_LOGINCHECK_URL} from "../constants";
import axios from "axios";

async function loginUser(credentials) {
    return fetch('http://localhost:8080/login', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(credentials)
    })
      .then(data => data.json())

}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
      let check = 'false'
      await axios.post(API_LOGINCHECK_URL, { username, password }).then(res => {
        console.log()
        check = res.data['res']
      })
      if (check == 'success') {
        var token = await loginUser({
          username,
          password
        });
        setToken(token);
      }
      else {
        console.log('SOSI HUI')
      }

  }

  return(
    <div>
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)}/>
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)}/>
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}