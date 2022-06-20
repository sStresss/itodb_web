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
  const [lblWrName, setLblWrName] =useState(true);
  const [lblWrPwd, setLblWrPwd] =useState(true);


  const handleSubmit = async e => {
    e.preventDefault();
      let check = 'false'
      let mes = ''
      await axios.post(API_LOGINCHECK_URL, { username, password }).then(res => {
        console.log()
        check = res.data['res']
        mes = res.data['mes']
      })
      if (check == 'success') {
        var token = await loginUser({
          username,
          password
        });
        setToken(token);
        localStorage.setItem('user', username);
      }
      else {
        if (mes == 'wr_name') {setLblWrName(false) }
        else {setLblWrPwd(false)}
      }

  }

  return(
    <div style={{backgroundImage:'url(\'./login_background_black.jpg\'', backgroundSize:"cover", minHeight:"100vh", textAlign:"center"}}>
      <div className="container" >
        <div className="row" style={{marginLeft:"250px", paddingTop:"300px"}}>
          <div className="col-lg-2 col-md-2" style={{textAlign:"center"}}></div>
          <div className="col-lg-5 col-md-5 login-box">
            <div className="col-lg-11 login-form">
              <div className="col-lg-12 login-form" style={{marginLeft:"15px"}}>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <Row>
                      <Col style={{minHeight:"80px", maxHeight:"80px", marginTop:"20px"}}>
                        <label className="form-control-label">ЛОГИН</label>
                        <br/>
                        <input type="text" className="inp" style={{borderBottom:"1px solid", marginTop: "5px", color:"#ECF0F5"}} onChange={e => {setUserName(e.target.value); setLblWrName(true); setLblWrPwd(true)}}/>
                        <a id={'label_wrong_name'} style={{color:'red', fontSize:'14px'}} hidden={lblWrName}>неверный логин</a>
                      </Col>
                    </Row>
                  </div>
                  <div className="form-group">
                    <Row>
                      <Col style={{minHeight:"90px", marginTop:"-20px"}}>
                        <label className="form-control-label">ПАРОЛЬ</label>
                        <br/>
                        <input type="password" className="inp" i onChange={e => {setPassword(e.target.value); setLblWrName(true); setLblWrPwd(true)}} style={{color:"#ECF0F5"}}/>
                        <a id={'label_wrong_pwd'} style={{color:'red', fontSize:'14px'}} hidden={lblWrPwd}>неверный пароль</a>
                      </Col>
                    </Row>
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

