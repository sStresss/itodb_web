import React, { Component } from "react";
import Modal from '@mui/material/Modal';
import { Col, Row, Button as ButtonDefault } from "reactstrap";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../App.css';

const promise = new Promise((resolve) => {
    resolve()
});
const modalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 365,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};
var state=false

export default function DialogBoxDelStuff(props) {
  var [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => {setModalOpen(true)};
  const handleModalClose = (event) => {setModalOpen(false)};
  const handleModalCallbackTrue = (event) => {props.callback(true); setModalOpen(false)}
  const handleModalCallbackFalse = (event) => {props.callback(false); setModalOpen(false)}
  if (props.show === true) {
    promise.then((e) => {
      handleModalOpen()
      state = true;
    })
  }
  const modal = <Modal
            open={modalOpen || false}
            onClose={(e)=>{handleModalClose(e)}}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onBackdropClick = {(e)=>{handleModalCallbackFalse(e)}}
            disableEscapeKeyDown={true}
            >
              <Box sx={modalstyle}>
                  <Row style={{borderBottom: "1px solid #fff", marginLeft: "-32px", marginTop: "-15px", width: "340px",  textAlign:'center'}}>
                      <Typography id="modal-modal-title" variant="h6" component="h2" >
                          <span style={{ paddingLeft: "20px", paddingBottom: "-10px"}}>Вы уверены?</span>
                      </Typography>
                  </Row>
                  <Row style={{  marginLeft: "-100px", marginTop: "10px", width: "500px", textAlign:"center" }}>
                      <ButtonDefault
                          color="primary"
                          className="float-right"
                          style={{ marginTop: "5px", marginLeft: "122px", marginRight:"0px", width: "80px", minWidth: "120px", height: "30px", padding: "0rem"}}
                          onClick={(e)=>{handleModalCallbackTrue(e)}}
                      >
                        <a  style={{ paddingBottom: "10px" }}>Ок</a>
                      </ButtonDefault>
                      <ButtonDefault
                          color="primary"
                          className="float-right"
                          style={{ marginTop: "5px", marginLeft: "10px", width: "80px", minWidth: "120px", height: "30px", padding: "0rem"}}
                          onClick={(e)=>{handleModalCallbackFalse(e)}}
                      >
                        <a  style={{ paddingBottom: "10px" }}>Отмена</a>
                      </ButtonDefault>
                  </Row>
              </Box>
          </Modal>
    return (
      <div>
        <Row>
          {modal}
        </Row>
      </div>

    );
}