import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import Table_Stuff from "./Table_Stuff";
import ObjectTree from "./ObjectTree"
import Table_Control from "./Table_Control"
import MessageBox from './MessageBox'


const promise = new Promise((resolve) => {
    resolve()
});


export default function Main() {
  console.log('MAIN')
    const [updateTable, setUpdateTable] = React.useState(['false', 'none', '', '','','']);
    const [selectedTableLst, setSelectedTableLst] = React.useState([])
    var [srchData, setSrchData] = React.useState('');
    var [srchDataType, setSrchDataType] = React.useState('');
    var [getMetricData, setGetMetricData] = React.useState(false);
    var [metric, setMetric] = React.useState([])
    var [mesBoxState, setMesBoxState] = React.useState(false)
    var [mesBoxMessage, setMesBoxMessage] = React.useState('')
    var [updTree, setUpdTree] = React.useState(undefined)
    const openMesBox = (message) => {
        setMesBoxMessage(message)
        setMesBoxState(true);
    }
    const closeMesBox = () => {
        setMesBoxState(false)
    }
    const  updateData = (type, parId, chId,pName,chName) => {
        setUpdateTable(['true', type, parId, chId, pName, chName]);
        setUpdateTable(['false']);
    }
    const updateTblLst = (ids) => {
        setSelectedTableLst(ids)
    }
    const searchUpd = (data, srchType) => {
        console.log(srchType)
        setSrchData(data);
        setSrchDataType(srchType);
    }
    const getMetric = () => {
        setGetMetricData(true);
    }
    const setMetricData = (dataArr) => {
      setMetric(dataArr);
      setGetMetricData(false)
      if (dataArr.length === 0) {openMesBox('Список оборудования пуст')}
    }
    const metricConfirm = () => {
      setMetric([])
    }
    const updateTree = (state) => {
      setUpdTree(true);
      setUpdTree(false);
    }
    const updateTableCallback = () => {
      return <Table_Stuff/>
    }

    return (
      <Container style={{ marginTop: "0px", marginLeft: "0px", position:"fixed"}}>
        <Row >
          <Col xs={2} style={{ height: "937px", backgroundColor: "#151B26", width: "240px"}}>
              <ObjectTree
                update={updateData}
                isUpdate={updTree}/>
          </Col>
          <Col style={{marginTop:"0px"}}>
              <Table_Control
                update={updateData}
                selectedLst={selectedTableLst}
                updateData={updateTable}
                srch={searchUpd}
                getMetric={getMetric}
                metricData = {metric}
                metricConfirm = {metricConfirm}
              />
              <Table_Stuff
                reload = {updateData}
                update={updateTable}
                selectedLst={updateTblLst}
                srch={srchData}
                srchType={srchDataType}
                getMetricData={getMetricData}
                setMetricData={setMetricData}
                setUpdateTree={updateTree}
              />
              {/*<CustomFileManager/>*/}
          </Col>
          <MessageBox message={mesBoxMessage} modalState={mesBoxState} close={closeMesBox}/>
        </Row>
      </Container>

    );
}
//sdfsdfs