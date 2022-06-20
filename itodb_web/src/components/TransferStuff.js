import React, {useEffect} from "react";
import { Col, Row, Button as ButtonDefault } from "reactstrap";
import '../App.css';
import axios from "axios";
import Typography from '@mui/material/Typography';
import {
  API_STUFF_URL,
  API_SUBSTUFF_URL,
  API_STUFFBYTREE_URL,
  API_NEWSTUFF_URL,
  API_NEWSUBSTUFF_URL,
  API_TRANSFERSTUFF_URL,
  API_OBJECTS_URL,
  API_SUBOBJECTS_URL
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

const modalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};

const promise = new Promise((resolve) => {
    resolve()
});
var state = false

export default function TransferStuffModal(props) {

  var [modalopen, setModalOpen] = React.useState(false);
  const [trTargetObj, setTrTargetObj] = React.useState('');
  const [trTargetSubObj, setTrTargetSubObj] = React.useState('');
  var [trObjectLst, setTrObjectLst] = React.useState([])
  var [trSubObjectFullLst, setTrSubObjectFullLst] = React.useState([])
  var [trSubObjectLst, setTrSubObjectLst] = React.useState([])
  const [stuffTransferDate, setStuffTransferDate] = React.useState(new Date('2000-01-01T21:11:54'));
  const handleTransferDateChange = (newValue) => {
        setStuffTransferDate(newValue);
    };
  const transferTableStuffSave = () => {
        setModalOpen(false);
        let object = document.getElementById('trTargetObj').textContent
        let subObject = document.getElementById('trTargetSubObj').textContent
        let date = document.getElementById('transDate').value
        const user = localStorage.getItem('user')
        for (let ind in props.show[1]) {
            let pk = (props.show[1])[ind]

            axios.put(API_TRANSFERSTUFF_URL + pk, {object, subObject, date, user}).then(res=> {
                if (parseInt(ind, 10)  === parseInt((((props.show[1]).length))-1,10)) {
                  setModalOpen(false);
                  props.stateSaveCallback()
                  state = false
                };
            })
        }
    }
  const handleTrTargetSubObj = (event) => {
        setTrTargetSubObj(event.target.value);
    };
  const handleTrTargetObj = (event) => {
        console.log('GET TRANSFER DATA LSTS')
        setTrTargetObj(event.target.value);
        var p_lst = []
        var curParInd = 9999;
        p_lst = []
        let ind = 0
        console.log(trObjectLst)
        let curParName = event.target.value[0]
        for (let i=0; i<trObjectLst.length;i++) {
            if (curParName === trObjectLst[i][0]) {
                curParInd=trObjectLst[i][1];
                break
            }
        }
        for (let j=0; j<trSubObjectFullLst.length;j++) {
            console.log(curParInd)
            console.log(trSubObjectFullLst[j][1])
            if (curParInd === trSubObjectFullLst[j][1]) {
                console.log('CATCH!!!')
                p_lst[ind]=trSubObjectFullLst[j][0]
                ind++
            }
            console.log('==================')
        }
        console.log(trSubObjectLst)
        setTrSubObjectLst(p_lst);
        setTrTargetSubObj(p_lst[0]);
  };


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
  var tr_objects = []
  var tr_subObject = []
  const handleModalOpen = () => {
          console.log(props.selectedLst)
          setStuffTransferDate(new Date());
          axios.get(API_OBJECTS_URL).then((response) => {
              tr_objects = response.data
              var p_lst = []
              var pp_lst = []
              for (let i = 0; i < tr_objects.length; i++) {
                  p_lst[i] = [tr_objects[i].name, tr_objects[i].pk]
              }
              setTrObjectLst(p_lst);
              setTrTargetObj(p_lst[0]);
              axios.get(API_SUBOBJECTS_URL).then((response) => {
                  tr_subObject = response.data
                  p_lst = []
                  pp_lst = []
                  let ind = 0
                  for (let j = 0; j < tr_subObject.length; j++) {
                      pp_lst[j] = [tr_subObject[j].name, tr_subObject[j].connect]
                      if (tr_objects[0].pk === tr_subObject[j].connect) {
                          p_lst[ind] = [tr_subObject[j].name, tr_subObject[j].connect]
                          ind++
                      }
                  }
                  setTrSubObjectFullLst(pp_lst);
                  if (pp_lst.length !== 0) {setTrTargetSubObj(pp_lst[0])}
                  setTrSubObjectLst(p_lst);
              }).then(() => {
                      setModalOpen(true);
                  }
              )
          });
  }

  if (state === false) {
    if (props.show[0] === 'true') {

      console.log('TRANSFER MODAL WAS OPEN')
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

            >
            <Box sx={modalstyle}>
                <Row style={{borderBottom: "1px solid #aaaaaa", marginLeft: "-32px", marginTop: "-15px", width: "500px",  }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" >
                        <span style={{ paddingLeft: "20px", paddingBottom: "-10px"}}>Перемещение</span>
                    </Typography>
                </Row>
                    <Row>
                        <Col>
                            <Row style={{marginTop:"23px"}}><span>Куда переместить</span></Row>
                            <Row style={{marginTop:"28px"}}><span>Имя подобъекта</span></Row>
                            <Row style={{marginTop:"28px"}}><span>Дата перемещения</span></Row>
                        </Col>
                        <Col>
                            <Row style={{marginTop:"20px", width:"288px", paddingLeft:"12px"}}>
                                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                                    <Select
                                      labelId="trTargetObj"
                                      id="trTargetObj"
                                      value={trTargetObj || trObjectLst[0]}
                                      onChange={handleTrTargetObj}
                                      label="Age"
                                    >
                                      {trObjectLst.map(type=> {
                                        return <MenuItem key={type} value={type}>{type[0]}</MenuItem>
                                      })}
                                    </Select>
                                </FormControl>
                            </Row>
                            <Row style={{marginTop:"20px", width:"288px", paddingLeft:"12px"}}>
                                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                                    <Select
                                      labelId="transTargetSubObj"
                                      id="trTargetSubObj"
                                      value={trTargetSubObj || trSubObjectLst[0] || ''}
                                      onChange={handleTrTargetSubObj}
                                      label="Age"
                                    >
                                      {trSubObjectLst.map(type=> {
                                        return <MenuItem key={type} value={type}>{type}</MenuItem>
                                      })}
                                    </Select>
                                </FormControl>
                            </Row>
                            <Row style={{marginTop:"30px"}}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <Stack spacing={3}  >
                                    <DesktopDatePicker
                                      label="дд/мм/гг"
                                      inputFormat="dd/MM/yyyy"
                                      value={stuffTransferDate}
                                      onChange={handleTransferDateChange}
                                      renderInput={(params) => <TextField id="transDate" {...params} />}
                                    />
                                  </Stack>
                                </LocalizationProvider>
                            </Row>
                        </Col>
                    </Row>
                    <br/>
                <Row>
                    <ButtonDefault
                        color="primary"
                        className="float-right"
                        onClick={transferTableStuffSave}
                        style={{ marginTop: "20px", marginLeft: "auto", marginRight: "10px", width: "100px", minWidth: "120px", height: "30px", padding: "0rem"}}
                    >
                        <a  style={{ paddingBottom: "10px" }}>Переместить</a>
                    </ButtonDefault>
                </Row>
            </Box>
        </Modal>
}
