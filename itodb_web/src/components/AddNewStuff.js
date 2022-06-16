import React, {useEffect} from "react";
import { Col, Row, Button as ButtonDefault } from "reactstrap";
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import '../App.css';
import axios from "axios";
import Typography from '@mui/material/Typography';
import {
    API_STUFF_URL,
    API_SUBSTUFF_URL,
    API_STUFFBYTREE_URL,
    API_NEWSTUFF_URL,
    API_NEWSUBSTUFF_URL
} from "../constants";
import MessageBox from './MessageBox'
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import FormControl, { useFormControl}  from '@mui/material/FormControl';
import Menu from '@mui/material/Menu';
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
  width: 550,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};

const promise = new Promise((resolve) => {
    resolve()
});
var state = false
export default function AddSTuffModal(props) {

  var [modalopen, setModalOpen] = React.useState(false);

  const handleNsModalToggleChange = (event, newTgState) => {
    setNsToggle(newTgState);
    var req = ''
    if (newTgState === 'subStuff') {
      req = API_NEWSUBSTUFF_URL
    } else {
      req = API_NEWSTUFF_URL
    }
    axios.get(req).then((response) => {
        console.log(response.data)
        ns_types = (response.data)['types'];
        ns_models = (response.data)['models'];
        var rows = [];
        var p_rows = [];
        for (var i = 0; i < ns_types.length; i++) {
          rows[i] = ns_types[i];
        };
        for (var i = 0; i < ns_models.length; i++) {
          p_rows[i] = ns_models[i];
        };
        setNsTypeLst(rows);
        setNsSeType(rows[0])
        setNsModelLst(p_rows);
        setNsSeModel(p_rows[0])
      }
    );
  };
  const handleNsTypeChange = (event) => {
    setNsSeType(event.target.value);
  };
  const handleNsModelChange = (event) => {
    setNsSeModel(event.target.value);
  };
  const handleNsManufacturerChange = (event) => {
    setNsSeManufacturer(event.target.value);
  };
  const handleNsSellerChange = (event) => {
    setNsSeSeller(event.target.value);
  };
  const handleNsTargetObjectChange = (event) => {
    setNsSeTargetObject(event.target.value);
  };
  const handleNsWarehouseChange = (event) => {
    setNsSeWarehouse(event.target.value);
  };
  const handleStuffDatePurchaseChange = (newValue) => {
    setStuffDatePurchase(newValue);
  };
  const [nsSnPropsError, setNsSnPropsError] = React.useState({'error': false, 'helpertext': ''})
  const nameStuffForm = React.useRef(null)
  const [nsSeType, setNsSeType] = React.useState('');
  const [nsSeModel, setNsSeModel] = React.useState('');
  const [nsSeManufacturer, setNsSeManufacturer] = React.useState('');
  const [nsSeSeller, setNsSeSeller] = React.useState('');
  const [nsSeTargetObject, setNsSeTargetObject] = React.useState('');
  const [nsSeWarehouse, setNsSeWarehouse] = React.useState('');
  const [nsToggle, setNsToggle] = React.useState('stuff');
  var [nsTypeLst, setNsTypeLst] = React.useState([])
  var [nsModelLst, setNsModelLst] = React.useState([])
  var [nsManufacturerLst, setNsManufacturerLst] = React.useState([])
  var [nsWarehouseLst, setNsWarehouseLst] = React.useState([])
  var [nsSellerLst, setNsSellerLst] = React.useState([])
  var [nsObjectLst, setNsObjectLst] = React.useState([])
  const [stuffDatePurchase, setStuffDatePurchase] = React.useState(new Date('2000-01-01T21:11:54'));
  var ns_types = []
  var ns_models = []
  var ns_manufacturer = []
  var ns_warehouse = []
  var ns_seller = []
  var ns_object = []
  var tr_objects = []
  var tr_subObject = []
  const handleModalClose = () => {
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

  const handleModalOpen = () => {

    axios.get(API_NEWSTUFF_URL).then((response) => {
      console.log(response.data)
      ns_types = (response.data)['types'];
      ns_models = (response.data)['models'];
      ns_manufacturer = (response.data)['manufacturer'];
      ns_warehouse = (response.data)['warehouse'];
      ns_seller = (response.data)['seller'];
      ns_object = (response.data)['object']
      var ns_rows = [];
      var ns_p_rows = [];
      var ns_pp_rows = [];
      var ns_ppp_rows = [];
      var ns_pppp_rows = [];
      var ns_ppppp_rows = [];
      for (var i = 0; i < ns_types.length; i++) {
        ns_rows[i] = ns_types[i];
      }
      ;
      for (var i = 0; i < ns_models.length; i++) {
        ns_p_rows[i] = ns_models[i]
      }
      ;
      for (var i = 0; i < ns_manufacturer.length; i++) {
        ns_pp_rows[i] = ns_manufacturer[i]
      }
      ;
      for (var i = 0; i < ns_warehouse.length; i++) {
        ns_ppp_rows[i] = ns_warehouse[i]
      }
      ;
      for (var i = 0; i < ns_seller.length; i++) {
        ns_pppp_rows[i] = ns_seller[i]
      }
      ;
      for (var i = 0; i < ns_object.length; i++) {
        ns_ppppp_rows[i] = ns_object[i]
      }
      ;
      setNsTypeLst(ns_rows);
      setNsSeType(ns_rows[0]);
      setNsModelLst(ns_p_rows);
      setNsSeModel(ns_p_rows[0]);
      setNsManufacturerLst(ns_pp_rows);
      setNsWarehouseLst(ns_ppp_rows);
      setNsSellerLst(ns_pppp_rows);
      setNsObjectLst(ns_ppppp_rows);
      setStuffDatePurchase(new Date());
      setNsToggle('stuff');
      setModalOpen(true);

    });
  }
  const addNewTableStuffSave = (event, props) => {
    console.log(nsToggle)
    const form = nameStuffForm.current
    const serial = `${form['ns_serial'].value}`
    if (serial.length === 0) {
      setNsSnPropsError({'error': true, 'helpertext': 'Error'})
    } else {
      const type = document.getElementById("seType").textContent
      const model = document.getElementById("seModel").textContent
      const manufacturer = document.getElementById("seManufacturer").textContent
      const seller = document.getElementById("seSeller").textContent
      const object_target = document.getElementById("seTargetObject").textContent
      const date_purchase = (document.getElementById("new_stuff_datepurchase").value).replaceAll('/', '.')
      const date_transfer = ""
      const object_fact = document.getElementById("seWarehouse").textContent
      const comment = document.getElementById("new_stuff_comment").value
      const user = "ksv"
      const event = "Добавлен в базу"
      var state = ''
      if (nsToggle === 'stuff') {
        state = 'Оборудование'
      } else {
        state = 'Комплектующее'
      }
      axios.post(API_NEWSTUFF_URL, {
        type, model, serial, manufacturer, seller, date_purchase, object_target,
        object_fact, date_transfer, comment, state, user, event
      })
        .then(res => {
          if (res.statusText !== 'Created') {
            alert('Ошибка добавления новой записи в базу!')
          }
        })
      reloadTableCallback()
    }
  }

  if (state === false) {
    if (props.show == 'true') {
      handleModalOpen()
      console.log('MODAL OPEN')
      promise.then((e) => {state = true})
    }
  }

  return <Modal
    open={modalopen || false}
    onClose={handleModalClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    disableEscapeKeyDown={true}
    onBackdropClick={handleModalClose}
  >
    <Box sx={modalstyle}>
      <Row style={{marginLeft: "-32px", marginTop: "0px", width: "500px", textAlign: "center"}}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          <ToggleButtonGroup
            color="primary"
            value={nsToggle}
            exclusive
            onChange={handleNsModalToggleChange}
          >
            <ToggleButton value="stuff">Оборудование</ToggleButton>
            <ToggleButton value="subStuff">Комплектующее</ToggleButton>
          </ToggleButtonGroup>
        </Typography>
      </Row>
      <Row>
        <Col>
          <Row style={{marginTop: "23px"}}><span>Тип</span></Row>
          <Row style={{marginTop: "28px"}}><span>Модель</span></Row>
          <Row style={{marginTop: "25px"}}><span>Серийный номер</span></Row>
          <Row style={{marginTop: "28px"}}><span>Производитель</span></Row>
          <Row style={{marginTop: "28px"}}><span>Поставщик</span></Row>
          <Row style={{marginTop: "28px"}}><span>Целевой объект</span></Row>
          <Row style={{marginTop: "50px"}}><span>Дата поступления</span></Row>
          <Row style={{marginTop: "41px"}}><span>Поступил на</span></Row>
          <Row style={{marginTop: "52px"}}><span>Комментарий</span></Row>
        </Col>
        <Col>
          <Row style={{marginTop: "20px", width: "288px", paddingLeft: "12px"}}>
            <FormControl variant="standard" sx={{m: 0, minWidth: 120}}>
              <Select
                labelId="seType"
                id="seType"
                value={nsSeType || nsTypeLst[0]}
                onChange={handleNsTypeChange}
                label="Age"
              >
                {nsTypeLst.map(type => {
                  return <MenuItem key={type} value={type}>{type}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Row>
          <Row style={{marginTop: "20px", width: "288px", paddingLeft: "12px"}}>
            <FormControl variant="standard" sx={{m: 0, minWidth: 120}}>
              <Select
                labelId="seModel"
                id="seModel"
                value={nsSeModel || nsModelLst[0]}
                onChange={handleNsModelChange}
                label="Age"
              >
                {nsModelLst.map(type => {
                  return <MenuItem key={type} value={type}>{type}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Row>
          <Row style={{marginTop: "17px", height: "60px", width: '300px'}}>
            <form ref={nameStuffForm}>
              <TextField
                sx={{width: "276px"}}
                error={nsSnPropsError['error']}
                helperText={nsSnPropsError['helpertext']}
                id="ns_serial"
                name={"ns_serial1"}
                defaultValue=""
                variant="standard"
              />
            </form>
          </Row>
          <Row style={{marginTop: "-9px", width: "288px", paddingLeft: "12px"}}>
            <FormControl variant="standard" sx={{m: 0, minWidth: 120}}>
              <Select
                labelId="seManufacturer"
                id="seManufacturer"
                value={nsSeManufacturer || nsManufacturerLst[0]}
                onChange={handleNsManufacturerChange}
                label="Age"
              >
                {nsManufacturerLst.map(type => {
                  return <MenuItem key={type} value={type}>{type}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Row>
          <Row style={{marginTop: "20px", width: "288px", paddingLeft: "12px"}}>
            <FormControl variant="standard" sx={{m: 0, minWidth: 120}}>
              <Select
                labelId="seSeller"
                id="seSeller"
                value={nsSeSeller || nsSellerLst[0]}
                onChange={handleNsSellerChange}
                label="Age"
              >
                {nsSellerLst.map(type => {
                  return <MenuItem key={type} value={type}>{type}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Row>
          <Row style={{marginTop: "20px", width: "288px", paddingLeft: "12px"}}>
            <FormControl variant="standard" sx={{m: 0, minWidth: 120}}>
              <Select
                labelId="seTargetObject"
                id="seTargetObject"
                value={nsSeTargetObject || nsObjectLst[0]}
                onChange={handleNsTargetObjectChange}
                label="Age"
              >
                {nsObjectLst.map(type => {
                  return <MenuItem key={type} value={type}>{type}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Row>
          <Row style={{marginTop: "30px"}}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="дд/мм/гг"
                  inputFormat="dd/MM/yyyy"
                  value={stuffDatePurchase}
                  onChange={handleStuffDatePurchaseChange}
                  renderInput={(params) => <TextField id="new_stuff_datepurchase" {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </Row>
          <Row style={{marginTop: "20px", width: "288px", paddingLeft: "12px"}}>
            <FormControl variant="standard" sx={{}}>
              <Select
                labelId="seWarehouse"
                id="seWarehouse"
                value={nsSeWarehouse || nsWarehouseLst[0]}
                onChange={handleNsWarehouseChange}
                label="Age"
              >
                {nsWarehouseLst.map(type => {
                  return <MenuItem key={type} value={type}>{type}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Row>
          <Row>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': {marginTop: 4, width: '276px'},
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="new_stuff_comment"
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
          onClick={addNewTableStuffSave}
          style={{
            marginTop: "20px",
            marginLeft: "auto",
            marginRight: "10px",
            width: "100px",
            minWidth: "120px",
            height: "30px",
            padding: "0rem"
          }}
        >
          <a style={{paddingBottom: "10px"}}>Добавить</a>
        </ButtonDefault>
      </Row>
    </Box>
  </Modal>
}
