// import React, { Component } from "react";
import Modal from '@mui/material/Modal';
import { Col, Row, Button as ButtonDefault } from "reactstrap";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from "react";
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


export default function MessageBox(props) {
  var [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = (event) => {setModalOpen(true)};
  const handleModalClose = (event) => {console.log('dialogbox close event');props.close(); setModalOpen(false)};

  if (props.modalState === true) {
    console.log('NEED MODAL OPEN')
    promise.then((e) => handleModalOpen(e))}
  const modal = <Modal
            open={modalOpen || false}
            onClose={(e)=>{handleModalClose(e)}}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onBackdropClick = {(e)=>{handleModalClose(e)}}
            disableEscapeKeyDown={true}
            >
              <Box sx={modalstyle}>
                  <Row style={{borderBottom: "1px solid #fff", marginLeft: "-32px", marginTop: "-15px", width: "340px",  textAlign:'center'}}>
                      <Typography id="modal-modal-title" variant="h6" component="h2" >
                          <span style={{ paddingLeft: "20px", paddingBottom: "-10px"}}>{props.message}</span>
                      </Typography>
                  </Row>
                  <Row style={{  marginLeft: "-100px", marginTop: "10px", width: "500px", textAlign:"center" }}>
                      <Typography id="modal-modal-title" variant="h6" component="h2" ></Typography>
                      <ButtonDefault
                          color="primary"
                          className="float-right"
                          style={{ marginTop: "5px", marginLeft: "192px", width: "100px", minWidth: "120px", height: "30px", padding: "0rem"}}
                          onClick={(e)=>{handleModalClose(e)}}
                      >
                          <a  style={{ paddingBottom: "10px" }}>Ок</a>
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