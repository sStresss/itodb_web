import React, { useState } from 'react';
import { Col, Container, Row } from "reactstrap";
// import './myApp.css';
import PropTypes from 'prop-types';
import {API_LOGINCHECK_URL} from "../constants";
import axios from "axios";
import '../loginStyle.css'

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
    <div style={{backgroundImage:'url(\'./login_background.jpg\'', backgroundSize:"cover", minHeight:"100vh", textAlign:"center"}}>
      <div className="container" >
        <div className="row" style={{marginLeft:"250px", paddingTop:"300px"}}>
          <div className="col-lg-2 col-md-2" style={{textAlign:"center"}}></div>
          <div className="col-lg-5 col-md-5 login-box">
            <div className="col-lg-11 login-form">
              <div className="col-lg-12 login-form" style={{marginLeft:"15px"}}>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-control-label">ЛОГИН</label>
                    <input type="text" className="form-control" onChange={e => setUserName(e.target.value)}/>
                  </div>
                  <div className="form-group">
                    <label className="form-control-label">ПАРОЛЬ</label>
                    <input type="password" className="" i onChange={e => setPassword(e.target.value)}/>
                  </div>

                  <div className="col-lg-12 loginbttm">
                    <div className="col-lg-6 login-btm login-text">
                    </div>
                    <div className="col-lg-6 login-btm login-button" style={{textAlign:"right"}}>
                      <button type="submit" className="btn-outline-primary btn">ВХОД</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

