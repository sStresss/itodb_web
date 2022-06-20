import React, {useEffect} from "react";
import { Col, Row, Button as ButtonDefault } from "reactstrap";
import '../App.css';
import axios from "axios";
import Typography from '@mui/material/Typography';
import {
  API_SUBSTUFF_URL,
  API_NEWSTUFF_URL,
  API_NEWSUBSTUFF_URL,
  API_EDITSTUFFSINGLE_URL
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

export default function EditStuffSingleModal(props) {

  var [modalopen, setModalOpen] = React.useState(false);
  async function editTableStufSinglefSave() {
    let pk = props.show[1][0]
    await axios.put(API_EDITSTUFFSINGLE_URL + pk, {type: document.getElementById("seType").textContent,
      model: document.getElementById("seModel").textContent,
      serial: document.getElementById("edit_stuff_serialnum").value,
      manufacturer: document.getElementById("seManufacturer").textContent,
      seller: document.getElementById("seSeller").textContent,
      date_purchase: (document.getElementById("edit_stuff_datepurchase").value).replaceAll('/', '.'),
      object_target: document.getElementById("seTargetObject").textContent,
      comment: document.getElementById("edit_stuff_comment").value,
      user: localStorage.getItem('user')})
    reloadTableCallback()
    }

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
  var [nsTypeLst, setNsTypeLst] = React.useState([])
  var [nsModelLst, setNsModelLst] = React.useState([])
  var [nsManufacturerLst, setNsManufacturerLst] = React.useState([])
  var [nsWarehouseLst, setNsWarehouseLst] = React.useState([])
  var [nsSellerLst, setNsSellerLst] = React.useState([])
  var [nsObjectLst, setNsObjectLst] = React.useState([])
  var [serialNumber, setSerialNumber] = React.useState()
  var [comment, setComment] = React.useState()
  const [stuffDatePurchase, setStuffDatePurchase] = React.useState(new Date('2000-01-01T21:11:54'));
  var ns_types = []
  var ns_models = []
  var ns_manufacturer = []
  var ns_warehouse = []
  var ns_seller = []
  var ns_object = []

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
    // console.log('MAN: '+props.show[2]['manufacturer'])
    var ns_types_rows = [];
    var ns_models_rows = [];
    var ns_manufacturer_rows = [];
    var ns_warehouse_rows = [];
    var ns_seller_rows = [];
    var ns_object_rows = [];
    await axios.get(API_NEWSTUFF_URL).then((response) => {
      ns_types = (response.data)['types'];
      ns_models = (response.data)['models'];
      ns_manufacturer = (response.data)['manufacturer'];
      ns_warehouse = (response.data)['warehouse'];
      ns_seller = (response.data)['seller'];
      ns_object = (response.data)['object']
      for (var i = 0; i < ns_types.length; i++) {
        ns_types_rows[i] = ns_types[i];
      };
      for (var i = 0; i < ns_models.length; i++) {
        ns_models_rows[i] = ns_models[i]
      };
      for (var i = 0; i < ns_manufacturer.length; i++) {
        ns_manufacturer_rows[i] = ns_manufacturer[i]
      };
      for (var i = 0; i < ns_warehouse.length; i++) {
        ns_warehouse_rows[i] = ns_warehouse[i]
      };
      for (var i = 0; i < ns_seller.length; i++) {
        ns_seller_rows[i] = ns_seller[i]
      };
      for (var i = 0; i < ns_object.length; i++) {
        ns_object_rows[i] = ns_object[i]
      };


    });
    if (props.show[2]['state'] == 'Комплектующее') {
      await axios.get(API_NEWSUBSTUFF_URL).then((response) => {
          ns_types = (response.data)['types'];
          ns_models = (response.data)['models'];
          for (var i = 0; i < ns_types.length; i++) {
            ns_types_rows[i] = ns_types[i];
          };
          for (var i = 0; i < ns_models.length; i++) {
            ns_models_rows[i] = ns_models[i];
          };
      });
    }


    setNsTypeLst(ns_types_rows);
    setNsSeType(props.show[2]['type']);

    setNsModelLst(ns_models_rows);
    setNsSeModel(props.show[2]['model']);

    setNsManufacturerLst(ns_manufacturer_rows);
    setNsSeManufacturer(props.show[2]['manufacturer']);

    setNsWarehouseLst(ns_warehouse_rows);
    setNsSeWarehouse(props.show[2]['warehouse'])

    setNsSellerLst(ns_seller_rows);
    setNsSeSeller(props.show[2]['seller'])

    setNsObjectLst(ns_object_rows);
    setNsSeTargetObject(props.show[2]['object_target'])

    setSerialNumber(props.show[2]['serial'])

    setStuffDatePurchase(new Date(props.show[2]['date_purchase'].split('.')[2]+'-'+props.show[2]['date_purchase'].split('.')[1]+'-'+props.show[2]['date_purchase'].split('.')[0]+'T21:11:54'));

    setComment(props.show[2]['comment'])

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
                          id="edit_stuff_serialnum"
                          name={"ns_serial1"}
                          defaultValue={serialNumber}
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
                            renderInput={(params) => <TextField id="edit_stuff_datepurchase" {...params} />}
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
                          id="edit_stuff_comment"
                          label="Комментарий"
                          multiline
                          rows={4}
                          defaultValue={comment}
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
                      marginTop: "20px",
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
