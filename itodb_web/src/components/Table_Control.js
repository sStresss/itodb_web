import React from "react";
import '../App.css';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Col, Row, Button as ButtonDefault } from "reactstrap";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl, { useFormControl}  from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import {API_NEWSTUFF_URL, API_NEWSUBSTUFF_URL, API_OBJECTS_URL, API_STUFF_URL, API_SUBOBJECTS_URL, API_TRANSFERSTUFF_URL} from "../constants";
import { DataGrid } from '@mui/x-data-grid';
import {makeStyles} from "@mui/styles";
import MessageBox from './MessageBox'


window.sessionStorage.setItem('filterViewStuff', 'true');
window.sessionStorage.setItem('filterViewSubStuff', 'true');

var metricConfirm = false
const ITEM_HEIGHT = 48;
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
const filtermodalstyle = {
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
const metricmodalstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    height:"minContent",
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
};
const promise = new Promise((resolve) => {
    resolve()
});

export default function Table_Control(props)  {

    const style = makeStyles({
         root: {
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            border: 0,
            borderRadius: 3,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            color: 'white',
            height: 48,
            padding: '0 30px',
        },
    });
    const classes = style()
    var [metricRows, setMetricRows] = React.useState([])
    var [metricTblHeight, setMetricTblHeight] = React.useState(0)
    const [filterViewToggle, setFilterViewToggle] = React.useState(() => ['view_stuff', 'view_subStuff']);
    const [trTargetObj, setTrTargetObj] = React.useState('');
    const [trTargetSubObj, setTrTargetSubObj] = React.useState('');
    var [stuffTblStateParent, setStuffTblStateParent] = React.useState('Главная');
    var [stuffTblStateChild, setStuffTblStateChild] = React.useState('');
    var [stuffTblStateSrch, setStuffTblStateSrch] = React.useState('');
    const [srchTypeLst, setSrchTypeLst] = React.useState(['серийный номер', 'целевой объект']);
    var [srchTypeObj, setSrchTypeObj] = React.useState('')
    var [mesBoxState, setMesBoxState] = React.useState(false)
    var [mesBoxMessage, setMesBoxMessage] = React.useState('')
    const openMesBox = () => {
        setMesBoxMessage('Список оборудования пуст!')
        setMesBoxState(true);
    }
    const closeMesBox = () => {
        setMesBoxState(false)
    }

    if (props.updateData[0] !== 'false' ) {
        document.getElementById('srchTextField').value = '';
        document.getElementById('connectTblStateSrch').hidden = true;
        document.getElementById('connectTblStateSpaceSrch').hidden = true;
        if (props.updateData[1] !== 'none') {
            if (stuffTblStateParent !== props.updateData[4]) {
                setStuffTblStateParent(props.updateData[4]);
            }
            if (props.updateData[5] !== '') {
                if (stuffTblStateChild !== props.updateData[5]) {
                    setStuffTblStateChild(props.updateData[5]);
                    document.getElementById('connectTblStateSpace').hidden = false;
                    document.getElementById('connectTblStateChild').hidden = false;
                }
            } else {
                if (stuffTblStateChild !== props.updateData[5]) {
                    setStuffTblStateChild(props.updateData[5]);
                    document.getElementById('connectTblStateSpace').hidden = true;
                    document.getElementById('connectTblStateChild').hidden = true;
                }
            }
        }
        else {
            if (stuffTblStateParent !== props.updateData[4]) {
                setStuffTblStateParent('Главная');
                document.getElementById('connectTblStateSpace').hidden = true;
                document.getElementById('connectTblStateChild').hidden = true;
            }
        }
    }

    const handleModalFilterOpen = (event) => {
        console.log('123321123321')
        setModalFilterOpen(true)
    }
    const handleSrchTypeChange = (event) => {
        setSrchTypeObj(event.target.value);
        promise.then(()=>{
            props.srch('', document.getElementById('srchType').textContent);
            props.srch(document.getElementById('srchTextField').value, document.getElementById('srchType').textContent);
        })
    }

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
    const handleTrTargetSubObj = (event) => {
        setTrTargetSubObj(event.target.value);
    };
    const [stuffTransferDate, setStuffTransferDate] = React.useState(new Date('2000-01-01T21:11:54'));
    const [anchorEl, setAnchorEl] = React.useState(null);
    var [modalFilterOpen, setModalFilterOpen] = React.useState(false)
    var [modalMetricOpen, setModalMetricOpen] = React.useState(false)
    var [transferModalOpen, setTransferModalOpen] = React.useState(false);

    const menuopen = Boolean(anchorEl);
    const handleTransferDateChange = (newValue) => {
        setStuffTransferDate(newValue);
    };
    var [trObjectLst, setTrObjectLst] = React.useState([])
    var [trSubObjectLst, setTrSubObjectLst] = React.useState([])
    var [trSubObjectFullLst, setTrSubObjectFullLst] = React.useState([])
    var tr_objects = []
    var tr_subObject = []

    const handleFilterViewModalToggleChange = (event, newTgState) => {
        // setFilterViewToggle(newTgState);
        if (newTgState.length) {
          setFilterViewToggle(newTgState);
        }
    };
    const setFilter = () => {
        let stuffCheck = false
        let subStuffCheck = false
        for (let i=0;i<filterViewToggle.length;i++) {
            if (filterViewToggle[i] === 'view_stuff') {stuffCheck = true}
            if (filterViewToggle[i] === 'view_subStuff') {subStuffCheck = true}
        }
        if (stuffCheck === true) {window.sessionStorage.setItem('filterViewStuff', 'true')}
        else {window.sessionStorage.setItem('filterViewStuff', 'false')}
        if (subStuffCheck === true) {window.sessionStorage.setItem('filterViewSubStuff', 'true')}
        else {window.sessionStorage.setItem('filterViewSubStuff', 'false')}
        setModalFilterOpen(false)
        updateTable()
    }
    const handleMainMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMainMenuClose = (event) => {
        setAnchorEl(null);
    };



    const updateTable = () =>{
        console.log('parent: '+ stuffTblStateParent)
        console.log('child: '+ stuffTblStateChild)
        promise.then(()=>{
            props.update('control','','')
            document.getElementById('connectTblStateSpace').hidden = true;
            setStuffTblStateParent(stuffTblStateParent)
            if (stuffTblStateChild !== '' && stuffTblStateChild !== undefined) {
                document.getElementById('connectTblStateSpace').hidden = false;
                setStuffTblStateChild(stuffTblStateChild)
        }
        })
    }

    const handleModalFilterClose = (event) => {setModalFilterOpen(false)}
    const handleModalMetricClose = (event) => {
        setModalMetricOpen(false)
        props.metricConfirm();
        metricConfirm = false}
    const [metric, setMetric] = React.useState([])

    if (props.metricData.length !== 0) {
        if (metricConfirm === false) {
            promise.then(()=>{
                setMetricRows(props.metricData);
                let tblHeight = (props.metricData.length*30) + 70;
                setMetricTblHeight(tblHeight);
                metricConfirm = true;
                setModalMetricOpen(true)
            })
        }
    }

    const handleModalMetricOpen = (event) => {
        props.getMetric()
    }
    const handleTransferModalClose = () => setTransferModalOpen(false);
    const deleteTableStuff = event => {
        handleMainMenuClose()
        for (let ind in props.selectedLst) {
            let pk = props.selectedLst[ind]
            axios.delete(API_STUFF_URL + pk).then(res=>{
                if (parseInt(ind, 10)  === parseInt((((props.selectedLst).length)-1),10)) {updateTable()};
            });
        };
    }
    const transferTableStuff = event => {

        handleMainMenuClose();
        if (props.selectedLst.length === 0) {
            alert('Оборудование не выбрано!')
        }
        else {
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
                        setTransferModalOpen(true);
                    }
                )
            });
        }
    }
    const transferTableStuffSave = () => {

        setTransferModalOpen(false);
        let object = document.getElementById('trTargetObj').textContent
        let subObject = document.getElementById('trTargetSubObj').textContent
        let date = document.getElementById('transDate').value
        for (let ind in props.selectedLst) {
            let pk = (props.selectedLst)[ind]
            axios.put(API_TRANSFERSTUFF_URL + pk, {object, subObject, date}).then(res=> {
                if (parseInt(ind, 10)  === parseInt((((props.selectedLst).length))-1,10)) {updateTable()};
            })
        }
    }
    const srchCallBack = (e) => {
        let srchData = document.getElementById('srchTextField').value
        promise.then(()=>{
            if (srchData.length !== 0) {
                setStuffTblStateSrch(srchData);
                document.getElementById('connectTblStateSpaceSrch').hidden = false;
                document.getElementById('connectTblStateSrch').hidden = false;
            }
            else {
                document.getElementById('connectTblStateSpaceSrch').hidden = true;
                document.getElementById('connectTblStateSrch').hidden = true;
            }
                        props.srch('', document.getElementById('srchType').textContent);
            props.srch(srchData, document.getElementById('srchType').textContent);
        });
    }
    var [sortModel, setSortModel] = React.useState([
        {
          field: 'state',
          sort: 'desc',
        },
    ]);
    const openFolder = () => {
        window.open('myproto://\\\\SINAPS-INZH-01\\itoDB\\netconfsource\\001');

    }
    const exit = () => {
        localStorage.removeItem('token')
        window.location.reload()
    }

    const metricColumns = [
        { field: 'type', headerName: 'Тип объекта', width: 190 },
        { field: 'model', headerName: 'Модель', width: 190 },
        { field: 'count', headerName: 'Кол-во', width: 90 }
        ];
    const metricTbl = <DataGrid
                        sx={{
                border: 0,
                height: metricTblHeight,
                marginTop: -0,
                '& .MuiDataGrid-cell:hover': {
                  color: 'primary.main',
                },
                '& .MuiDataGrid-columnHeaderTitle':{
                    fontWeight: 'bold'
                }
              }}
                        className={classes}
                        rows={metricRows}
                        columns={metricColumns}
                        disableSelectionOnClick
                        hideFooter={true}
                        rowHeight = {30}
                        sortModel = {sortModel}
                        onSelectionModelChange={(ids) => {
                            props.selectedLst(ids);
                        }}
                        onSortModelChange={(model) => setSortModel(model)}
                      />

    const filterModal = <Modal
            open={modalFilterOpen || false}
            onClose={handleModalFilterClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onBackdropClick = {handleModalFilterClose}
            disableEscapeKeyDown={true}
            >
            <Box sx={filtermodalstyle}>
                <Row style={{borderBottom: "1px solid #fff", marginLeft: "-32px", marginTop: "-15px", width: "365px",  }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" >
                        <span style={{ paddingLeft: "20px", paddingBottom: "-10px"}}>Режим отображения</span>
                    </Typography>
                </Row>
                <Row style={{  marginLeft: "-100px", marginTop: "10px", width: "500px", textAlign:"center" }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" >
                        <ToggleButtonGroup
                          color="primary"
                          value={filterViewToggle}
                          onChange={handleFilterViewModalToggleChange}
                        >
                            <ToggleButton value="view_stuff">Оборудование</ToggleButton>
                            <ToggleButton value="view_subStuff">Комплектующее</ToggleButton>
                        </ToggleButtonGroup>
                    </Typography>
                    <ButtonDefault
                        color="primary"
                        className="float-right"
                        onClick={setFilter}
                        style={{ marginTop: "20px", marginLeft: "282px", marginRight: "10px", width: "100px", minWidth: "120px", height: "30px", padding: "0rem"}}
                    >
                        <a  style={{ paddingBottom: "10px" }}>Сохранить</a>
                    </ButtonDefault>
                </Row>
            </Box>
        </Modal>
    const metricModal = <Modal
            open={modalMetricOpen || false}
            onClose={handleModalMetricClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onBackdropClick = {handleModalMetricClose}
            disableEscapeKeyDown={true}
            >
            <Box sx={metricmodalstyle}>
                <Row style={{  marginLeft: "-10px", marginTop: "-10px", width: "500px", textAlign:"center" }}>
                    <div style={{bgColor:"red"}}>
                        {metricTbl}
                    </div>
                </Row>
            </Box>
        </Modal>
    const transferModal = <Modal
                open={transferModalOpen || false}
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
    return (
        <div>
            <Row style={{marginTop:"0px", MarginLeft:"0px", width:"158%"}}>
                <IconButton
                    sx={{width:"45px",height:"45px", marginLeft:"16px", marginRight:"0px", marginTop:"8px"}}
                    aria-label="filter"
                    id="filter"
                    onClick={(e)=>{handleModalMetricOpen(e)}}
                >
                    <img src={"./metric.png"} style={{height:'27px'}}/>
                </IconButton>
                <a id={"connectTblStateParent"} style={{marginLeft:"-9px", marginTop:"10px", fontFamily: 'Aeroport', fontSize: '24px', width:"max-content"}}>{stuffTblStateParent}</a>
                <a id={"connectTblStateSpace"} style={{marginLeft:"-17px", marginTop:"10px", fontFamily: 'Aeroport', fontSize: '24px', width:"max-content"}} hidden={true}>»</a>
                <a id={"connectTblStateChild"} style={{marginLeft:"-17px", marginTop:"10px", fontFamily: 'Aeroport', fontSize: '24px', width:"max-content"}} hidden={true}>{stuffTblStateChild}</a>
                <a id={"connectTblStateSpaceSrch"} style={{marginLeft:"-17px", marginTop:"10px", fontFamily: 'Aeroport', fontSize: '24px', width:"max-content"}} hidden={true}>»</a>
                <a id={"connectTblStateSrch"} style={{marginLeft:"-17px", marginTop:"10px", fontFamily: 'Aeroport', fontSize: '24px', width:"max-content"}} hidden={true}>{stuffTblStateSrch}</a>
                <IconButton
                        sx={{width:"45px",height:"45px", marginLeft:"auto", marginRight:"0px", marginTop:"7px", color:"#5f5f5f"}}
                        aria-label="filter"
                        id="filter"
                        onClick={(e)=>{handleModalFilterOpen(e)}}
                    >
                        <img src={"./filter.png"} style={{height:'23px'}}/>
                </IconButton>
                <TextField
                    sx = {{
                        fontWeight:"8px",
                        width: "170px",
                        marginLeft:"0px",
                        marginRight:"0px",
                        marginY:"14px",
                        ".css-1480iag-MuiInputBase-root-MuiInput-root:before": {
                            border:"none",
                        },
                        ".css-1480iag-MuiInputBase-root-MuiInput-root:after": {
                            border:"none"
                        }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                            position='start'
                            onClick={(e)=> {srchCallBack(e)}}
                            >
                            <IconButton
                                varinat="text"
                                className="float-right"
                                style={{height:"25px", width:"15px", minWidth:"25px", borderRadius:"0px", paddingTop:"3px"}}
                            >
                                <SearchIcon sx={{cursor:'pointer', height:"24px", marginTop:"5px"}} />
                            </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    id="srchTextField"
                    name={"srchTextField"}
                    defaultValue=""
                    variant="standard"
                    placeholder="поиск"
                />
                <FormControl variant="standard"
                             sx={{ minWidth: 100,
                                 maxWidth:160,
                                 marginTop: 1.7,
                                 ".css-1480iag-MuiInputBase-root-MuiInput-root:before": {
                                   border: 'none'
                                 }
                             }}>
                    <Select
                      labelId="srchType"
                      id="srchType"
                      value={srchTypeObj || srchTypeLst[0]}
                      onChange={handleSrchTypeChange}
                      label="Age"
                    >
                      {srchTypeLst.map(type=> {
                        return <MenuItem key={type} value={type}>{type}</MenuItem>
                      })}
                    </Select>
                </FormControl>
                <IconButton
                    sx={{width:"40px",height:"40px", marginLeft:"0px", marginRight:"0px", marginTop:"10px"}}
                    aria-label="more"
                    id="long-button"
                    aria-controls={menuopen ? 'long-menu' : undefined}
                    aria-expanded={menuopen ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleMainMenuClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    sx={{
                      '& .MuiPaper-root': {
                        borderRadius: 0,
                      },
                      '& .MuiMenu-list': {
                        padding: '0px',
                      },
                      '& .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root': {
                        fontSize: '12px',
                      },
                      '& .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root:hover': {
                        backgroundColor:"rgb(75, 110, 175)",
                        color:"white"
                      },
                    }}
                    anchorEl={anchorEl}
                    open={menuopen}
                    onClose={handleMainMenuClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '16ch',
                      },
                    }}
                    componentsProps={{
                        root: {
                          onContextMenu: (e) => {
                            e.preventDefault();
                            handleMainMenuClose();
                          }

                        },
                      }}
                >
                    <MenuItem onClick={deleteTableStuff}>Удалить</MenuItem>
                    <MenuItem onClick={transferTableStuff}>Переместить</MenuItem>
                    <MenuItem onClick={exit}>Выход</MenuItem>
                </Menu>
                {transferModal}
                {filterModal}
                {metricModal}
                <MessageBox message={mesBoxMessage} modalState={mesBoxState} close={closeMesBox}/>
            </Row>
        </div>
    );
}