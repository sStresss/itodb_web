import React, { Component } from "react";
import {Col, Row} from "reactstrap";
import  "../animate.min.css"

class Header extends Component {
  render() {
    return (
      <div className="" style={{backgroundColor: '#151B26', height: '60px', textAlign: 'left !important', flex: '0 0 0%', maxWidth:"240"}}>
        <Row style={{width: "240px", cursor:"pointer"}}>
          {/*<Col xs="auto" >*/}
            {/*<img className={"wow animate__animated animate__rotateIn"} src={"./sinaps_.png"} style={{height:'45px', marginTop: '7px',  marginLeft: '30px', animationDuration: '5s'}} alt="SINAPS POWER!"/>*/}
          {/*</Col>*/}
          <Col>
            <h1 style={{ marginLeft: "18px", textAlign: 'left', color: 'white', fontFamily: 'Aeroport', fontSize: '30px', paddingTop:'25px'}}>
                DATABASE
            </h1>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Header;