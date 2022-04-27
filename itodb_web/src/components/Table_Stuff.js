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


var srchState = null;
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

console.log('REFRESH!')
const search = (srch) => {
    let res = null
    console.log('srch: ' + srch)
    if (srch === undefined) {
        res = null
    }
    else {
        if (srch.toString().length === 0) {
            res = false
        }
        else {
            res = true;
        }
    }
    console.log(res)
    return res
};

const promise = new Promise((resolve) => {
    resolve()
});

// const reload = () => {
//     Table_Stuff.reload()
// }


export default function Table_Stuff(props)  {


    var [srchDataTemp, setSrchDataTemp] = React.useState('');
    const [stuff, setStuff] = React.useState(new Array(0));
    const [stuffTemp, setStuffTemp] = React.useState(new Array(0));
    var [srchData, setSrchData] = React.useState('');
    var [sortModel, setSortModel] = React.useState([
        {
          field: 'state',
          sort: 'desc',
        },
    ]);
    var rows = []
    var i = 0;
    var j = 0;
    React.useEffect(() => {
        axios.get(API_STUFF_URL).then((response) => {
            let resLst = getFilter(response.data)
            setStuffTemp(resLst);
            setStuff(resLst);
            });
        },
    []);
    if (stuff.length !==0) {
        for(i=0; i < stuff.length; i++) {
            rows[i] = {id: stuff[i].pk,type: stuff[i].type , model: stuff[i].model, serial: stuff[i].serial, manufacturer: stuff[i].manufacturer,
                seller: stuff[i].seller, date_purchase: stuff[i].date_purchase, object_target: stuff[i].object_target,
                object_fact: stuff[i].object_fact, date_transfer: stuff[i].date_transfer, comment: stuff[i].comment, state:stuff[i].state};
        }
    }
    const style = makeStyles({
         root: {
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            border: 0,
            borderRadius: 3,
            color: 'white',
            height: 48,
            padding: '0 30px',
        },
    });

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
                }
                ;
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
    const [nsSnPropsError, setNsSnPropsError] = React.useState({'error':false, 'helpertext': ''})
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
    const handleModalClose = () => setModalOpen(false);
    var ns_types = []
    var ns_models = []
    var ns_manufacturer = []
    var ns_warehouse = []
    var ns_seller = []
    var ns_object = []
    var tr_objects = []
    var tr_subObject = []
    var [modalopen, setModalOpen] = React.useState(false);
    const addTableStuff = event => {
        handleModalOpen()
    }
    const handleModalOpen = (event) => {
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
        for(var i=0; i < ns_types.length; i++) {
            ns_rows[i] = ns_types[i];
        };
        for(var i=0; i < ns_models.length; i++) {
            ns_p_rows[i] = ns_models[i]
        };
        for(var i=0; i < ns_manufacturer.length; i++) {
            ns_pp_rows[i] = ns_manufacturer[i]
        };
        for(var i=0; i < ns_warehouse.length; i++) {
            ns_ppp_rows[i] = ns_warehouse[i]
        };
        for(var i=0; i < ns_seller.length; i++) {
            ns_pppp_rows[i] = ns_seller[i]
        };
        for(var i=0; i < ns_object.length; i++) {
            ns_ppppp_rows[i] = ns_object[i]
        };
        setNsTypeLst(ns_rows);
        setNsSeType(ns_rows[0]);
        setNsModelLst(ns_p_rows);
        setNsSeModel(ns_p_rows[0]);
        setNsManufacturerLst(ns_pp_rows);
        setNsWarehouseLst(ns_ppp_rows);
        setNsSellerLst(ns_pppp_rows);
        setNsObjectLst(ns_ppppp_rows);
        setStuffDatePurchase(new Date('2000-01-01T21:11:54'));
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
        }
        else {
            const type = document.getElementById("seType").textContent
            const model = document.getElementById("seModel").textContent
            const manufacturer = document.getElementById("seManufacturer").textContent
            const seller = document.getElementById("seSeller").textContent
            const object_target = document.getElementById("seTargetObject").textContent
            const date_purchase = (document.getElementById("new_stuff_datepurchase").value).replaceAll('/', '.')
            const date_transfer = ""
            const object_fact = document.getElementById("seWarehouse").textContent
            const comment = document.getElementById("new_stuff_comment").value
            var state = ''
            if (nsToggle === 'stuff') {state = 'Оборудование'}
            else {state = 'Комплектующее'}
            axios.post(API_NEWSTUFF_URL, { type, model, serial, manufacturer, seller, date_purchase, object_target,
                object_fact, date_transfer, comment, state })
                .then(res=> {
                    // let p_rows = rows
                    // console.log(p_rows[p_rows.length])
                    //  let row = {id: 1, type:'123', model:'312', serial:'123', manufacturer:'312', seller:'123', date_purchase:'123', object_target:'123', object_fact:'31', date_transfer:'123', comment:'12321', state:'Оборудование'}
                    // setStuff(...row)
                    // promise.then(()=>{props.reload()})
                    // console.log(this.props.updateTableCallback())
                    // let p_rows = stuff
                    // p_rows[p_rows.length] = row
                    // console.log(p_rows)
                    reload()
                    if (res.statusText !== 'Created') {
                        alert('Ошибка добавления новой записи в базу!')
                    }
                })
                // console.log(props.update)
            setModalOpen(false);
        }
    }

    const reload = () => {
        promise.then(()=> {props.reload('control', '', '')})
    }

    const columns = [
      { field: 'type', headerName: 'Тип', width: 200},
      { field: 'model', headerName: 'Модель', width: 150 },
      { field: 'serial', headerName: 'Серийный номер', width: 170 },
      { field: 'manufacturer', headerName: 'Производитель', width: 140},
      { field: 'seller', headerName: 'Поставщик', width: 150},
      { field: 'date_purchase', headerName: 'Дата пост.'},
      { field: 'object_target', headerName: 'Цел. объект', width:150},
      { field: 'object_fact', headerName: 'Факт. объект', width:150},
      { field: 'date_transfer', headerName: 'Дата пер.'},
      { field: 'comment', headerName: 'Комментарий', width:282},
      { field: 'state', headerName:'state', hide:true}
    ];
    const getFilter = (dataLst) => {
        let res = []
        let filterViewStuff = window.sessionStorage.getItem('filterViewStuff');
        let filterViewSubStuff = window.sessionStorage.getItem('filterViewSubStuff');
        console.log('=====================')
        console.log(filterViewStuff)
        console.log(filterViewSubStuff)
        console.log('=====================')

        if (filterViewStuff === 'true' && filterViewSubStuff === 'true') {
            console.log('FILTER ALL')
            return dataLst
        }
        else {
            let j = 0;
            let i =0;
            if (filterViewSubStuff === 'false') {
                console.log('FILTER STUFF')
                for (i=0;i<dataLst.length;i++) {
                    console.log(dataLst[i]['state'])
                    if (dataLst[i]['state'] === 'Оборудование') {
                        res[j] = dataLst[i];
                        j++
                    }
                }
                return res
            }
            else {
                console.log('FILTER SUBSTUFF')
                for (i=0;i<dataLst.length;i++) {
                    if (dataLst[i]['state'] === 'Комплектующее') {
                        res[j] = dataLst[i];
                        j++
                    }
                }
                return res
            }
        }
    }
    const classes = style()
    if (!stuff) return null;
    const Table = <DataGrid
            sx={{
                cursor: 'pointer',
                marginTop: 0,
                '& .MuiDataGrid-cell:hover': {
                  color: 'primary.main',
                },
                '& .MuiDataGrid-columnHeaderTitle':{
                    fontWeight: 'bold'
                },
                border:0
              }}
            className={classes}
            rows={rows}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            hideFooter={true}
            rowHeight = {30}
            sortModel = {sortModel}
            onSelectionModelChange={(ids) => {
                props.selectedLst(ids);
            }}
            onSortModelChange={(model) => setSortModel(model)}
          />
    const stuffModal =  <Modal
                            open={modalopen || false}
                            onClose={handleModalClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            disableEscapeKeyDown={true}
                        >
                            <Box sx={modalstyle}>
                                <Row style={{  marginLeft: "-32px", marginTop: "0px", width: "500px", textAlign:"center" }}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2" >
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
                                            <Row style={{marginTop:"23px"}}><span>Тип</span></Row>
                                            <Row style={{marginTop:"28px"}}><span>Модель</span></Row>
                                            <Row style={{marginTop:"25px"}}><span>Серийный номер</span></Row>
                                            <Row style={{marginTop:"28px"}}><span>Производитель</span></Row>
                                            <Row style={{marginTop:"28px"}}><span>Поставщик</span></Row>
                                            <Row style={{marginTop:"28px"}}><span>Целевой объект</span></Row>
                                            <Row style={{marginTop:"50px"}}><span>Дата поступления</span></Row>
                                            <Row style={{marginTop:"41px"}}><span>Поступил на</span></Row>
                                            <Row style={{marginTop:"52px"}}><span>Комментарий</span></Row>
                                        </Col>
                                        <Col>
                                            <Row style={{marginTop:"20px", width:"288px", paddingLeft:"12px"}}>
                                                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                                                    <Select
                                                      labelId="seType"
                                                      id="seType"
                                                      value={nsSeType || nsTypeLst[0]}
                                                      onChange={handleNsTypeChange}
                                                      label="Age"
                                                    >
                                                      {nsTypeLst.map(type=> {
                                                        return <MenuItem key={type} value={type}>{type}</MenuItem>
                                                      })}
                                                    </Select>
                                                </FormControl>
                                            </Row>
                                            <Row style={{marginTop:"20px", width:"288px", paddingLeft:"12px"}}>
                                                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                                                    <Select
                                                      labelId="seModel"
                                                      id="seModel"
                                                      value={nsSeModel || nsModelLst[0]}
                                                      onChange={handleNsModelChange}
                                                      label="Age"
                                                    >
                                                      {nsModelLst.map(type=> {
                                                        return <MenuItem key={type} value={type}>{type}</MenuItem>
                                                      })}
                                                    </Select>
                                                </FormControl>
                                            </Row>
                                            <Row style={{marginTop:"17px", height:"60px", width:'300px'}}>
                                                <form ref={nameStuffForm}>
                                                    <TextField
                                                        sx = {{width:"276px"}}
                                                        error = {nsSnPropsError['error']}
                                                        helperText = {nsSnPropsError['helpertext']}
                                                        id="ns_serial"
                                                        name={"ns_serial1"}
                                                        defaultValue=""
                                                        variant="standard"
                                                    />
                                                </form>
                                            </Row>
                                            <Row style={{marginTop:"-9px", width:"288px", paddingLeft:"12px"}}>
                                                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                                                    <Select
                                                      labelId="seManufacturer"
                                                      id="seManufacturer"
                                                      value={nsSeManufacturer || nsManufacturerLst[0]}
                                                      onChange={handleNsManufacturerChange}
                                                      label="Age"
                                                    >
                                                      {nsManufacturerLst.map(type=> {
                                                        return <MenuItem key={type} value={type}>{type}</MenuItem>
                                                      })}
                                                    </Select>
                                                </FormControl>
                                            </Row>
                                            <Row style={{marginTop:"20px", width:"288px", paddingLeft:"12px"}}>
                                                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                                                    <Select
                                                      labelId="seSeller"
                                                      id="seSeller"
                                                      value={nsSeSeller || nsSellerLst[0]}
                                                      onChange={handleNsSellerChange}
                                                      label="Age"
                                                    >
                                                      {nsSellerLst.map(type=> {
                                                        return <MenuItem key={type} value={type}>{type}</MenuItem>
                                                      })}
                                                    </Select>
                                                </FormControl>
                                            </Row>
                                            <Row style={{marginTop:"20px", width:"288px", paddingLeft:"12px"}}>
                                                  <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                                                    <Select
                                                      labelId="seTargetObject"
                                                      id="seTargetObject"
                                                      value={nsSeTargetObject || nsObjectLst[0]}
                                                      onChange={handleNsTargetObjectChange}
                                                      label="Age"
                                                    >
                                                      {nsObjectLst.map(type=> {
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
                                                      value={stuffDatePurchase}
                                                      onChange={handleStuffDatePurchaseChange}
                                                      renderInput={(params) => <TextField id="new_stuff_datepurchase" {...params} />}
                                                    />
                                                  </Stack>
                                                </LocalizationProvider>
                                            </Row>
                                            <Row style={{marginTop:"20px", width:"288px", paddingLeft:"12px"}}>
                                                  <FormControl variant="standard" sx={{  }}>
                                                    <Select
                                                      labelId="seWarehouse"
                                                      id="seWarehouse"
                                                      value={nsSeWarehouse || nsWarehouseLst[0]}
                                                      onChange={handleNsWarehouseChange}
                                                      label="Age"
                                                    >
                                                      {nsWarehouseLst.map(type=> {
                                                        return <MenuItem key={type} value={type}>{type}</MenuItem>
                                                      })}
                                                    </Select>
                                                </FormControl>
                                            </Row>
                                            <Row>
                                                <Box
                                                  component="form"
                                                  sx={{
                                                    '& .MuiTextField-root': { marginTop: 4, width: '276px' },
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
                                        style={{ marginTop: "20px", marginLeft: "auto", marginRight: "10px", width: "100px", minWidth: "120px", height: "30px", padding: "0rem"}}
                                    >
                                        <a  style={{ paddingBottom: "10px" }}>Добавить</a>
                                    </ButtonDefault>
                                </Row>
                            </Box>
                        </Modal>
    const loadTableData = () => {
        if ((props.update)[0] === 'true') {
            if ((props.update)[1] === 'none') {
            axios.get(API_STUFF_URL).then((response) => {
                document.getElementById('connect_state').innerText = 'global';
                setStuffTemp(response.data);
                setStuff(response.data);
            })}
            else {
                if ((props.update)[1] === 'tree_parent') {
                    const type = 'parent';
                    const pid = (props.update)[2];
                    console.log('pid: '+pid.toString())
                    console.log('connect: '+document.getElementById('connect_pid').value)
                    axios.post(API_STUFFBYTREE_URL, {type, pid}).then((response) => {
                        document.getElementById('connect_state').innerText = 'tree_parent';
                        document.getElementById('connect_pid').value = (props.update)[2];
                        let resLst = getFilter(response.data);
                        setStuffTemp(resLst);
                        setStuff(resLst);
                    })
                }
                if ((props.update)[1] === 'tree_child') {
                    const type = 'child';
                    const pid = (props.update)[2];
                    const cid = (props.update)[3];
                    axios.post(API_STUFFBYTREE_URL, {type, pid, cid}).then((response) => {
                        document.getElementById('connect_state').innerText = 'tree_child';
                        document.getElementById('connect_pid').innerText = (props.update)[2];
                        document.getElementById('connect_cid').innerText = (props.update)[3];
                        setStuffTemp(response.data);
                        setStuff(response.data);
                    })
                }
                if ((props.update)[1] === 'control') {
                    axios.get(API_STUFF_URL).then((response) => {
                        console.log(document.getElementById('connect_state').textContent)
                        if (document.getElementById('connect_state').textContent === 'global') {
                            axios.get(API_STUFF_URL).then((response) => {
                                let resLst = getFilter(response.data);
                                setStuffTemp(resLst);
                                setStuff(resLst);
                                props.setUpdateTree('true')
                            })
                        }
                        if (document.getElementById('connect_state').textContent === 'tree_parent') {
                            const type = 'parent';
                            const pid = document.getElementById('connect_pid').value;
                            console.log('connect: '+document.getElementById('connect_pid').value)
                            axios.post(API_STUFFBYTREE_URL, {type, pid}).then((response) => {
                                let resLst = getFilter(response.data);
                                setStuffTemp(resLst);
                                setStuff(resLst);
                                props.setUpdateTree('true')
                            })
                        }
                        if (document.getElementById('connect_state').textContent === 'tree_child') {
                            const type = 'child';
                            const pid = document.getElementById('connect_pid').textContent;
                            const cid = document.getElementById('connect_cid').textContent;
                            axios.post(API_STUFFBYTREE_URL, {type, pid, cid}).then((response) => {
                                let resLst = getFilter(response.data);
                                setStuffTemp(resLst);
                                setStuff(resLst);
                                props.setUpdateTree('true')
                            })
                        }

                    })
                }
            }
            return Table
        }
    }
    loadTableData();
    console.log('111')
    const p_srchState = (event) => search(props.srch);
    if (p_srchState === true) {
        console.log('srch!')
        let p_rows = new Array(0);
        let j = 0
        promise.then(()=> {
            // if (props.srch !== srchDataTemp) {srchState = null}
            if (srchState === null) {
                srchState = true;
                console.log('NEW SEARCH')
                if (props.srchType === 'Серийный номер') {
                    for(i=0; i < stuffTemp.length; i++) {
                        if (stuffTemp[i]['serial'].startsWith(props.srch)) {
                             p_rows[j] = {pk: i,type: stuffTemp[i]['type'],
                                 model: stuffTemp[i]['model'],
                                 serial: stuffTemp[i]['serial'],
                                 manufacturer: stuffTemp[i]['manufacturer'],
                                 seller: stuffTemp[i]['seller'],
                                 date_purchase: stuffTemp[i]['date_purchase'],
                                 object_target: stuffTemp[i]['object_target'],
                                 object_fact: stuffTemp[i]['object_fact'],
                                 date_transfer: stuffTemp[i]['date_transfer'],
                                 comment: stuffTemp[i]['comment'],
                                 state: stuffTemp[i]['state']};
                             j++;
                        }

                    };
                }
                else {
                     for(i=0; i < stuffTemp.length; i++) {
                         if (stuffTemp[i]['object_fact'].startsWith(props.srch)) {
                             p_rows[j] = {
                                 pk: i,
                                 type: stuffTemp[i]['type'],
                                 model: stuffTemp[i]['model'],
                                 serial: stuffTemp[i]['serial'],
                                 manufacturer: stuffTemp[i]['manufacturer'],
                                 seller: stuffTemp[i]['seller'],
                                 date_purchase: stuffTemp[i]['date_purchase'],
                                 object_target: stuffTemp[i]['object_target'],
                                 object_fact: stuffTemp[i]['object_fact'],
                                 date_transfer: stuffTemp[i]['date_transfer'],
                                 comment: stuffTemp[i]['comment'],
                                 state: stuffTemp[i]['state']
                             };
                             j++;
                         };
                    };
                }

                setStuff(p_rows);
            }
        })
    }
    else {
        if (p_srchState === false) {
            promise.then(()=> {
                srchState = null;
                console.log('go back!')
                setStuff(stuffTemp);

            })
        }
    }
    if (props.getMetricData === true) {
        let p_rows = []
        var rows = []
        let j = 0
        if (stuffTemp.length !== 0) {
            p_rows[0] = [stuff[0]['type'], stuff[0]['model'], 0]
            for (let i = 0; i < stuffTemp.length; i++) {
                let check = false
                for (j = 0; j < p_rows.length; j++) {
                    if (p_rows[j][0] === stuff[i]['type'] && p_rows[j][1] === stuff[i]['model']) {
                        p_rows[j][2]++
                        check = true
                    }
                }
                if (check === false) {
                    p_rows[p_rows.length] = [stuff[i]['type'], stuff[i]['model'], 1]
                }
            }
            for (i = 0; i < p_rows.length; i++) {
                rows[i] = {id: i, type: p_rows[i][0], model: p_rows[i][1], count: p_rows[i][2].toString()}
            }
        }

        props.setMetricData(rows);
    }

    return (
    <Row style={{ height: 825, width: '159%', marginTop:"-11px", borderTop:"1px solid #B4B4B4"}} >
        <span id={"connect_state"} hidden={true}>global</span>
        <span id={"connect_pid"} hidden={true}></span>
        <span id={"connect_cid"} hidden={true}></span>
        <IconButton
            sx={{width:"40px",height:"41px", marginLeft:"17px", marginRight:"-8px", marginTop:"7px", color:"#5f5f5f", position:"absolute",zIndex:1}}
            aria-label="filter"
            id="filter"
            onClick={addTableStuff}
        >
            <img src={"./add.png"} style={{height:'10px'}} />
        </IconButton>
        {Table}
        {stuffModal}
    </Row>
    );
}

// boxShadow:"0px 5px 5px #B4B4B4 inset"