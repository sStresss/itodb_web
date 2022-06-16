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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl, { useFormControl}  from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import {makeStyles} from "@mui/styles";
import MessageBox from './MessageBox';


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

var path_tmp = ''
var metricDataLoadConfirm = false

export default function TableControl(props)  {

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
    var [stuffTblStateParent, setStuffTblStateParent] = React.useState('Главная');
    var [stuffTblStateChild, setStuffTblStateChild] = React.useState('');
    var [stuffTblStateSrch, setStuffTblStateSrch] = React.useState('');
    const [srchTypeLst, setSrchTypeLst] = React.useState(['серийный номер', 'целевой объект']);
    var [srchTypeObj, setSrchTypeObj] = React.useState('')
    var [mesBoxState, setMesBoxState] = React.useState(false)
    var [mesBoxMessage, setMesBoxMessage] = React.useState('')
    var [pathText, setPathText] = React.useState('Главная')
    const openMesBox = () => {
        setMesBoxMessage('Список оборудования пуст!')
        setMesBoxState(true);
    }
    const closeMesBox = () => {
        setMesBoxState(false)
    }

    const handleModalFilterOpen = (event) => {
        setModalFilterOpen(true)
    }
    const handleSrchTypeChange = (event) => {
        setSrchTypeObj(event.target.value);
        promise.then(()=>{
            // props.srch('', document.getElementById('srchType').textContent);
            props.srch(document.getElementById('srchTextField').value, document.getElementById('srchType').textContent);
        })
    }


    const [anchorEl, setAnchorEl] = React.useState(null);
    var [modalFilterOpen, setModalFilterOpen] = React.useState(false)
    var [modalInfoOpen, setModalInfoOpen] = React.useState(false)
    var [modalMetricOpen, setModalMetricOpen] = React.useState(false)

    const menuopen = Boolean(anchorEl);

    const handleFilterViewModalToggleChange = (event, newTgState) => {
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
        props.update('true','filter_update','','','','')
        setPathText(document.getElementById('connectTblStateParent').textContent)


    }

    const handleModalFilterClose = (event) => {setModalFilterOpen(false)}
    const handleModalMetricClose = (event) => {
        setModalMetricOpen(false)}

    const handleModalMetricOpen = (event) => {
        props.getMetric()
    }

    const handleInfoModalOpen = (event) => {
        setAnchorEl(null);
        setModalInfoOpen(true)
    }
    const handleInfoModalClose = () => setModalInfoOpen(false);

    const srchCallBack = (e) => {

        let srchData = document.getElementById('srchTextField').value
        promise.then(()=>{
            if (srchData.length !== 0) {
                document.getElementById('connectTblStateSrch').hidden = false;
                setStuffTblStateSrch(' » ' + srchData);
            }
            else {
                document.getElementById('connectTblStateSrch').hidden = true;
            }
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

    const getHidden = () => {
        console.log('refreshing by tree click')
        promise.then(()=> {
            if ((document.getElementById('connectTblStateSrch') != undefined) && (props.updateData[4]!==path_tmp)) {
                path_tmp=props.updateData[4]
                document.getElementById('connectTblStateSrch').hidden = true;
                document.getElementById('srchTextField').value = ''
            }

        })

    }

    function downloadMyProtoReg(filename) {
        var text = "Windows Registry Editor Version 5.00\n" +
          "\n" +
          "[HKEY_CLASSES_ROOT\\myproto]\n" +
          "\"URL Protocol\"=\"\"\n" +
          "@=\"URL:Myproto Protocol\"\n" +
          "\n" +
          "[HKEY_CLASSES_ROOT\\myproto\\shell]\n" +
          "\n" +
          "[HKEY_CLASSES_ROOT\\myproto\\shell\\open]\n" +
          "\n" +
          "[HKEY_CLASSES_ROOT\\myproto\\shell\\open\\command]\n" +
          "@=\"\\\"C:\\\\myproto.bat\\\" \\\"%1\\\"\""
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function downloadMyProtoBat(filename) {
        var text = "@echo off\n" +
          "set \"path=%~1\"\n" +
          "setlocal enabledelayedexpansion\n" +
          "set path=%path:myproto://=%\n" +
          "set path=%path:\"=%\n" +
          "set path=%path:/=\\%\n" +
          "set path=!path:%%20= !\n" +
          "set path=!path:%%5C=\\!\n" +
          "C:\\Windows\\explorer.exe \"%path%\""
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    const loadMetricData = () => {
        if (metricDataLoadConfirm != props.metricConfirm) {
            metricDataLoadConfirm = props.metricConfirm
            console.log('METRIC DATA RECIEVE')
            promise.then(()=>{
                setMetricRows(props.metricData);
                let tblHeight = (props.metricData.length*30) + 70;
                setMetricTblHeight(tblHeight);
                metricConfirm = true;
                setModalMetricOpen(true)
            })
        }
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
    const infoModal = <Modal
            open={modalInfoOpen || false}
            onClose={handleInfoModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onBackdropClick = {handleInfoModalClose}
            disableEscapeKeyDown={true}
            >
            <Box sx={metricmodalstyle}>
                <Row style={{ borderBottom: "1px solid #fff", marginLeft: "-32px", marginTop: "-15px", width: "400px", }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <span style={{ paddingLeft: "40px"}}>Справка</span>
                    </Typography>
                </Row>
                <Row style={{  marginLeft: "-10px", marginTop: "20px", width: "500px", textAlign:"left" }}>
                    <div style={{bgColor:"red", textAlign:"left"}}>
                        <a style={{ paddingLeft: "20px"}}>Для работы с файловой системой базы данных:</a>
                    </div>
                </Row>
                <Row style={{  marginLeft: "-10px", marginTop: "20px", width: "500px", textAlign:"center" }}>
                    <div style={{bgColor:"red", textAlign:"left"}}>
                        <li style={{marginLeft:"20px"}}>Скачайте и запустите файл
                            <a onClick={()=>{downloadMyProtoReg("install.reg")}} style={{color:"blue", cursor:"pointer", borderBottom:"1px solid blue"}}> install.reg </a>
                            . Операционная система спросит подтверждение на редактирования данных реестра, нужно нажать "да".</li>
                        <li style={{marginTop:"10px", marginLeft:"20px"}}>Скачайте вспомогательный файл
                            <a onClick={()=>{downloadMyProtoBat("myproto.bat")}} style={{color:"blue", cursor:"pointer", borderBottom:"1px solid blue"}}> myproto.bat </a>
                            и разместите его по адресу "C:/" на вашем компьютере.  </li>
                    </div>
                </Row>
            </Box>
        </Modal>

    return (
        <div>
            <Row style={{marginTop:"0px", MarginLeft:"0px"}}>
                <IconButton
                    sx={{width:"45px",height:"45px", marginLeft:"16px", marginRight:"0px", marginTop:"8px"}}
                    aria-label="filter"
                    id="filter"
                    onClick={(e)=>{handleModalMetricOpen(e)}}
                >
                    <img src={"./metric.png"} style={{height:'27px'}}/>
                </IconButton>
                <a id={"connectTblStateParent"} style={{marginLeft:"-9px", marginTop:"10px", fontFamily: 'Aeroport', fontSize: '24px', width:"max-content"}} onChange={getHidden()}>{props.updateData[4] || pathText} </a>
                <a id={"connectTblStateSrch"} style={{marginLeft:"-17px", marginTop:"10px", fontFamily: 'Aeroport', fontSize: '24px', width:"max-content"}} hidden={true}>{stuffTblStateSrch}</a>
                <a id={"connectMetricDataLoad"} onChange={loadMetricData()} hidden={true}>{props.metricConfirm && ''} </a>
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
                    <MenuItem onClick={exit}>Настройки</MenuItem>
                    <MenuItem onClick={(e)=>{handleInfoModalOpen(e)}}>Справка</MenuItem>
                    <MenuItem onClick={exit}>Выход</MenuItem>
                </Menu>
                {filterModal}
                {metricModal}
                {infoModal}
                <MessageBox message={mesBoxMessage} modalState={mesBoxState} close={closeMesBox}/>
            </Row>
            {/*<Row>*/}
                {/*<LinearProgress/>*/}
            {/*</Row>*/}

        </div>
    );
}