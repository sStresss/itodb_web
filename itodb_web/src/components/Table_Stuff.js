import React from "react";
import { Col, Row, Button as ButtonDefault } from "reactstrap";
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import '../App.css';
import axios from "axios";
import {API_STUFF_URL, API_SUBSTUFF_URL, API_STUFFBYTREE_URL} from "../constants";
import MessageBox from './MessageBox'

var srchState = null;

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
    console.info('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
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
    const p_srchState = search(props.srch);
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
        {Table}
    </Row>
    );
}

// boxShadow:"0px 5px 5px #B4B4B4 inset"