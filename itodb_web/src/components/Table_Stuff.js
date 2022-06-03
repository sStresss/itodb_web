import React, {useEffect} from "react";
import { Col, Row, Button as ButtonDefault } from "reactstrap";
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import '../App.css';
import axios from "axios";
import {
    API_STUFF_URL,
    API_SUBSTUFF_URL,
    API_STUFFBYTREE_URL, API_OBJECTS_URL
} from "../constants";
import DialogBoxDelStuff from './DialogBoxDelStuff'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddStuffModal from './AddNewStuff'
import TransferStuffModal from './TransferStuff'
import EditStuffSingleModal from './EditStuffSingle'
import EditStuffGroupModal from './EditStuffGroup'

var selectedCells = []
var selectedCellData = []

const promise = new Promise((resolve) => {
    resolve()
});
var search = ['','1']
var update = []
var connect_pid = ''
var connect_cid = ''
var connect_state = 'global'
var stuffTmp = []

var getmetric = false

export default function Table_Stuff(props)  {
    const [dialogBoxDelStuffState, setDialogBoxDelStuffState] = React.useState(false)
    const [selectedLst, setSelectedLst] = React.useState()
    var [addStuffBtnHide, setAddStuffBtnHide] = React.useState(false)
    const [stuff, setStuff] = React.useState(new Array(0));
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
          stuffTmp = resLst
          setStuff(resLst);
        });
        },[]);
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
    const [addStuffModalShow, setAddStuffModalShow] = React.useState('false')
    const addTableStuff = (event) => {
        promise.then(()=>{setAddStuffModalShow('true')})
        setAddStuffModalShow('false')
        setAddStuffModalShow('false')
    }
    async function transTableStuff (event)  {
        if (selectedLst.length === 0) {
            alert('Оборудование не выбрано!')
        }
        else {await setTransferStuffModalShow(['true',selectedLst])}
    }
    async function editTableStuff (event)  {
        if (selectedLst.length === 0) {
            alert('Оборудование не выбрано!')
        }
        else {
            if (selectedLst.length === 1) {
                for (let i = 0; i < stuff.length; i++) {
                    if (stuff[i]['pk'] == selectedLst[0]) {
                        selectedCellData = stuff[i]
                    }
                }
                await setEditSingleModalShow(['true',selectedLst, selectedCellData])
            }
            else {setEditGroupModalShow(['true', selectedLst])}

        }
    }
    const openDeleteStuffDialog = (e) => {
        if (selectedLst.length !=0) {
            setDialogBoxDelStuffState(true)
        }
        else {
            alert('оборудование не выбрано!')
        }

    }
    const dialogBoxDelStuffCallback = (resp) => {
        setDialogBoxDelStuffState(false)
        if (resp == true) {
            for (let ind = 0; ind < selectedLst.length; ind++) {
                let pk = selectedLst[ind]
                axios.delete(API_STUFF_URL + pk).then(res=>{
                    if (parseInt(ind, 10)  === parseInt((((selectedLst).length)-1),10)) {props.setUpdateTree('true'); tblUpdate()};
                });
            };
        }
    }
    const [transferStuffModalShow, setTransferStuffModalShow] = React.useState(['false',[]])
    const [editSingleModalShow, setEditSingleModalShow] = React.useState(['false',[]])
    const [editGroupModalShow, setEditGroupModalShow] = React.useState(['false',[]])
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
      { field: 'comment', headerName: 'Комментарий', width:285},
      { field: 'state', headerName:'state', hide:true}
    ];
    const getFilter = (dataLst) => {
        let res = []
        let filterViewStuff = window.sessionStorage.getItem('filterViewStuff');
        let filterViewSubStuff = window.sessionStorage.getItem('filterViewSubStuff');

        if (filterViewStuff === 'true' && filterViewSubStuff === 'true') {
            return dataLst
        }
        else {
            let j = 0;
            let i =0;
            if (filterViewSubStuff === 'false') {
                for (i=0;i<dataLst.length;i++) {
                    if (dataLst[i]['state'] === 'Оборудование') {
                        res[j] = dataLst[i];
                        j++
                    }
                }
                return res
            }
            else {
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
    const [selectedStatusTblRow, setSelectedStatusTblRow] = React.useState();
    const [contextStatusTblMenu, setContextStatusTblMenu] = React.useState(null);
    async function handleStatusTblMenuClose () {
      setContextStatusTblMenu(null);
    };
    async function handleContextStatusTblMenu (event)  {
        console.log(selectedCells)
        setSelectedLst(selectedCells)
      event.preventDefault();
      setSelectedStatusTblRow(Number(event.currentTarget.getAttribute('data-id')));
      setContextStatusTblMenu(
        contextStatusTblMenu === null
          ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
          : null,
      );
    };


    if (!stuff) return null;

    const Table = <DataGrid
            pagination
            sx={{
                // position: 'absolute',
                cursor: 'pointer',
                marginTop: 0,
                height: '887px',
                overflowX:'hidden',
                border:0,
                '*::-webkit-scrollbar': {
                    backgroundColor: '#d2d8de',
                    width: '0.4em'
                },
                '*::-webkit-scrollbar-track': {
                    // '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
                },
                '*::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(21,27,38,1)'
                }

              }}
            className={classes}
            rows={rows}
            columns={columns}
            checkboxSelection
            // disableSelectionOnClick
            // hideFooter={true}
            rowHeight = {30}
            pageSize={25}
            sortModel = {sortModel}
            // onRowSelected={(x) => {)}}
            onSelectionModelChange={(ids) => {
                selectedCells = ids
            }}
            onSortModelChange={(model) => setSortModel(model)}
            componentsProps={{
              row: {
                onContextMenu: handleContextStatusTblMenu,
                style: { cursor: 'context-menu' },
              },
            }}
          />

    const TableContextMenu = <Menu
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
                                open={contextStatusTblMenu !== null}
                                onClose={handleStatusTblMenuClose}
                                anchorReference="anchorPosition"
                                anchorPosition={
                                  contextStatusTblMenu !== null
                                    ? { top: contextStatusTblMenu.mouseY, left: contextStatusTblMenu.mouseX }
                                    : undefined
                                }
                                componentsProps={{
                                  root: {
                                    onContextMenu: (e) => {
                                      e.preventDefault();
                                      handleStatusTblMenuClose();
                                    }

                                  },
                                }}
                              >
                                <MenuItem onClick={(e)=> {setContextStatusTblMenu(null);editTableStuff(e)}}>Редактировать</MenuItem>
                                <MenuItem onClick={(e)=> {setContextStatusTblMenu(null);transTableStuff(e)}}>Переместить</MenuItem>
                                <MenuItem onClick={(e)=> {setContextStatusTblMenu(null);openDeleteStuffDialog(e)}}>Удалить</MenuItem>
                            </Menu>

    const stateModalAddNewStuffCallback = (event) => {
        setAddStuffModalShow('false')
    }

    async function stateModalAddNewStuffSaveCallback (event)  {
        setAddStuffModalShow('false')
        var p_rows = []
        await axios.get(API_STUFF_URL).then((response) => {
            p_rows = getFilter(response.data)
        });
        setStuff(p_rows);
        stuffTmp = p_rows;
        props.setUpdateTree('true');
    }

    const stateModalTransferStuffCallback = (event) => {
        setTransferStuffModalShow('false')
    }

    const stateModalEditStuffSingleCallback = (event) => {
        setEditSingleModalShow('false')
    }

    const stateModalEditStuffGroupCallback = (event) => {
        setEditGroupModalShow('false')
    }

    const stateModalTransferStuffSaveCallback = (event) => {
        props.setUpdateTree('true');
        setTransferStuffModalShow('false');
        tblUpdate()
    }

    const stateModalEditStuffSingleSaveCallback = (event) => {
        props.setUpdateTree('true');
        setEditSingleModalShow('false');
        tblUpdate()
    }

    const stateModalEditStuffGroupSaveCallback = (event) => {
        setEditGroupModalShow('false')
        tblUpdate()
    }

    async function tblUpdate() {
        var p_rows = []
        if (connect_state === 'global') {
            await axios.get(API_STUFF_URL).then((response) => {
                p_rows = getFilter(response.data)
            });
            setStuff(p_rows);
            stuffTmp = p_rows
        }
        else {
            if (connect_state === 'tree_parent') {
                let type = 'parent'
                let pid = connect_pid
                await axios.post(API_STUFFBYTREE_URL, {type, pid}).then((response) => {
                    p_rows = getFilter(response.data)
                });
                setStuff(p_rows);
                stuffTmp = p_rows
            }
            else {
                let type = 'child'
                let pid = connect_pid
                let cid = connect_cid
                await axios.post(API_STUFFBYTREE_URL, {type, pid, cid}).then((response) => {
                    p_rows = getFilter(response.data)
                })
                setStuff(p_rows);
                stuffTmp = p_rows
            }
        }
    }

    const loadTableData = () => {
      if ((props.update[0] != 'false') && (props.update != update)) {

        if ((props.update)[1] === 'none') {
          update = props.update
          axios.get(API_STUFF_URL).then((response) => {
            connect_state = 'global'
            document.getElementById('connect_state').innerText = 'global';
            // setStuffTemp(response.data);
            stuffTmp = response.data
            setStuff(response.data);
          })
        } else {
          update = props.update
          if ((props.update)[1] === 'tree_parent') {
            const type = 'parent';
            const pid = (props.update)[2];
            axios.post(API_STUFFBYTREE_URL, {type, pid}).then((response) => {
              connect_state = 'tree_parent'
              connect_pid = props.update[2]
              document.getElementById('connect_state').innerText = 'tree_parent';
              document.getElementById('connect_pid').value = (props.update)[2];
              document.getElementById('connect_pid').innerText = (props.update)[2];
              let resLst = getFilter(response.data);
              // setStuffTemp(resLst);
              stuffTmp = response.data
              setStuff(resLst);
            })
          }
          if ((props.update)[1] === 'tree_child') {
            console.log('CHILD CLICK PID: ' + props.update[2])
            const type = 'child';
            const pid = (props.update)[2];
            const cid = (props.update)[3];
            axios.post(API_STUFFBYTREE_URL, {type, pid, cid}).then((response) => {
              connect_state = 'tree_child'
              connect_pid = props.update[2]
              connect_cid = props.update[3]
              document.getElementById('connect_state').innerText = 'tree_child';
              document.getElementById('connect_pid').innerText = (props.update)[2];
              document.getElementById('connect_cid').innerText = (props.update)[3];
              // setStuffTemp(response.data);
              let resLst = getFilter(response.data);
              stuffTmp = resLst
              setStuff(resLst);
            })
          }
          if (props.update[1] === 'filter_update') {
            promise.then(()=>{
              let resLst = getFilter(stuffTmp);
              setStuff(resLst)
            })

          }
        }
        return Table
      }
    }

    const srchTableData = () => {
      if ((props.srch[0] != search[0]) || (props.srch[1] != search[1])) {
        let p_rows = new Array(0);
        search = props.srch
        if (props.srch[0] === '') {
          return promise.then(()=>{setStuff(stuffTmp)})
        }
        else {
          if (props.srch[1] === 'серийный номер') {
            for(i=0; i < stuffTmp.length; i++) {
              if (stuffTmp[i]['serial'].includes(props.srch[0])) {
                p_rows[j] = {pk: i,type: stuffTmp[i]['type'],
                  model: stuffTmp[i]['model'],
                  serial: stuffTmp[i]['serial'],
                  manufacturer: stuffTmp[i]['manufacturer'],
                  seller: stuffTmp[i]['seller'],
                  date_purchase: stuffTmp[i]['date_purchase'],
                  object_target: stuffTmp[i]['object_target'],
                  object_fact: stuffTmp[i]['object_fact'],
                  date_transfer: stuffTmp[i]['date_transfer'],
                  comment: stuffTmp[i]['comment'],
                  state: stuffTmp[i]['state']};
                j++;
              }
            };
            }
            else {
              for(i=0; i < stuffTmp.length; i++) {
                if (stuffTmp[i]['object_fact'].includes(props.srch[0])) {
                  p_rows[j] = {
                    pk: i,
                    type: stuffTmp[i]['type'],
                    model: stuffTmp[i]['model'],
                    serial: stuffTmp[i]['serial'],
                    manufacturer: stuffTmp[i]['manufacturer'],
                    seller: stuffTmp[i]['seller'],
                    date_purchase: stuffTmp[i]['date_purchase'],
                    object_target: stuffTmp[i]['object_target'],
                    object_fact: stuffTmp[i]['object_fact'],
                    date_transfer: stuffTmp[i]['date_transfer'],
                    comment: stuffTmp[i]['comment'],
                    state: stuffTmp[i]['state']};
                  j++;
                };
              };
            }
          return promise.then(()=>{setStuff(p_rows)})
        }
      }
    }

    const getMetric = () => {

      if ((props.getMetricData != getmetric) && (props.getMetricData != undefined)) {
        getmetric = props.getMetricData
        let p_rows = []
        var rows = []
        let j = 0
        if (stuffTmp.length !== 0) {
            p_rows[0] = [stuff[0]['type'], stuff[0]['model'], 0]
            for (let i = 0; i < stuffTmp.length; i++) {
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
    }

    return (
    <Row style={{
            height: 825,
            width: '160%',
            marginTop:"-11px",
            borderTop:"1px solid #B4B4B4",
        }}
    >
        <span id={"connect_state"} hidden={true}>global</span>
        <span id={"connect_pid"} hidden={true}></span>
        <span id={"connect_cid"} hidden={true}></span>
        <IconButton
            sx={{width:"40px",height:"41px", marginLeft:"17px", marginRight:"0px", marginTop:"7px", color:"#5f5f5f", position:"absolute",zIndex:1}}
            aria-label="filter"
            id="addNewSruffBtn"
            onClick={(e)=>addTableStuff(e)}
            hidden={addStuffBtnHide}
        >
            <img src={"./add_btn.png"} style={{height:'18px'}}/>
        </IconButton>
        {Table}
        {TableContextMenu}
        <span id={"connectTreeState"}  hidden={true} onChange={loadTableData()}>{props.update || 'Главная'} </span>
        <span id={"connectSearch"}  hidden={true} onChange={srchTableData()}>{props.srch || ['','']} </span>
        <AddStuffModal show={addStuffModalShow} stateCallback={stateModalAddNewStuffCallback} stateSaveCallback={stateModalAddNewStuffSaveCallback}/>
        <TransferStuffModal show={transferStuffModalShow} stateCallback={stateModalTransferStuffCallback} stateSaveCallback={stateModalTransferStuffSaveCallback}/>
        <DialogBoxDelStuff show={dialogBoxDelStuffState} callback={dialogBoxDelStuffCallback}/>
        <EditStuffSingleModal show={editSingleModalShow} stateCallback={stateModalEditStuffSingleCallback} stateSaveCallback={stateModalEditStuffSingleSaveCallback}/>
        <EditStuffGroupModal show={editGroupModalShow} stateCallback={stateModalEditStuffGroupCallback} stateSaveCallback={stateModalEditStuffGroupSaveCallback}/>
        <a id={"connectGetTblMetric"} onChange={getMetric()} hidden={true}>{props.getMetricData || ''} </a>
    </Row>
    );
}

// boxShadow:"0px 5px 5px #B4B4B4 inset"