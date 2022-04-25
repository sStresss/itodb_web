import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React, { Component, Fragment, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from "./components/Main";
import Preferences from "./components/Preferences"
// import "./myApp.css"
import Login from './components/Login';
import useToken from './components/useToken';



export default function App() {
    const { token, setToken } = useToken();

    if(!token) {
      return <Login setToken={setToken}/>
    }
    return (
        <BrowserRouter>
          <Routes>
            <Route path={"/dashboard"} element={<Fragment><Main/></Fragment>}/>
          </Routes>
        </BrowserRouter>
    );
  }