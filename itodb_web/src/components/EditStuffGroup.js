import React, {useEffect} from "react";
import { Col, Row, Button as ButtonDefault } from "reactstrap";
import '../App.css';
import axios from "axios";
import Typography from '@mui/material/Typography';
import {
  API_SUBSTUFF_URL,
  API_EDITSTUFFGROUP_URL
} from "../constants";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import FormControl, { useFormControl}  from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import ToggleButtonGroup from "./AddNewStuff";

const modalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 340,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};

const promise = new Promise((resolve) => {
    resolve()
});
var state = false

export default function EditStuffGroupModal(props) {

  var [modalopen, setModalOpen] = React.useState(false);
  async function editTableStufSinglefSave() {
    await axios.post(API_EDITSTUFFGROUP_URL, {ids: props.show[1], comment: document.getElementById("edit_stuff_comment").value})
    reloadTableCallback()
    }

  const handleTransferModalClose = () => {
    setModalOpen(false);
    promise.then(()=> {
      props.stateCallback()
      state = false})
  }

  const reloadTableCallback = () => {
    setModalOpen(false);
    promise.then(()=> {
      props.stateSaveCallback()
      state = false})
  }

  async function handleModalOpen() {
    setModalOpen(true);
  }

  if (state === false) {
    if (props.show[0] === 'true') {
      promise.then((e) => {
        handleModalOpen()
        state = true;
      })
    }
  }

  return  <Modal
            open={modalopen || false}
            onClose={handleTransferModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableEscapeKeyDown={true}
            onBackdropClick={handleTransferModalClose}

            >
              <Box sx={modalstyle}>
                <Row>
                  <Col>
                    <Row>
                      <Box
                        component="form"
                        sx={{
                          '& .MuiTextField-root': {marginTop: 0, width: '276px'},
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          id="edit_stuff_comment"
                          label="Комментарий"
                          multiline
                          rows={4}
                          defaultValue=""
                        />
                      </Box>
                    </Row>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <ButtonDefault
                    color="primary"
                    className="float-right"
                    onClick={editTableStufSinglefSave}
                    style={{
                      marginTop: "0px",
                      marginLeft: "auto",
                      marginRight: "10px",
                      width: "100px",
                      minWidth: "120px",
                      height: "30px",
                      padding: "0rem"
                    }}
                  >
                    <a style={{paddingBottom: "10px"}}>Сохранить</a>
                  </ButtonDefault>
                </Row>
              </Box>
        </Modal>
}
