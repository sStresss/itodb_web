import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import Table_Stuff from "./Table_Stuff";
import ObjectTree from "./ObjectTree"
import Table_Control from "./Table_Control"
import MessageBox from './MessageBox'


const promise = new Promise((resolve) => {
    resolve()
});

var test = []

export default function Main() {
    var [updateTable, setUpdateTable] = React.useState(['false', 'none', '', '','','']);
    const [selectedTableLst, setSelectedTableLst] = React.useState([])
    var [srchData, setSrchData] = React.useState('');
    var [getMetricData, setGetMetricData] = React.useState(false);
    var [metric, setMetric] = React.useState([])
    var [mesBoxState, setMesBoxState] = React.useState(false)
    var [mesBoxMessage, setMesBoxMessage] = React.useState('')
    var [updTree, setUpdTree] = React.useState(undefined)
    var [metricDataLoadConfirm, setMetricDataLoadConfirm] = React.useState(false)
    const openMesBox = (message) => {
      setMesBoxMessage(message)
      setMesBoxState(true);
    }
    const closeMesBox = () => {
      setMesBoxState(false)
    }
    const updateData = (event, type, parId, chId,pName,chName) =>  {
      setUpdateTable([event, type, parId, chId, pName, chName])
    }
    const updateTblLst = (ids) => {
      setSelectedTableLst(ids)
    }
    const searchUpd = (data, srchType) => {
      setSrchData([data, srchType]);
    }
    const getMetric = () => {
      if (getMetricData == false) {
       setGetMetricData(true);
      }
      else {setGetMetricData(false)}
    }
    const setMetricData = (dataArr) => {
      console.log(dataArr.length)
      if (dataArr.length === 0) {
        console.log('CGBCJR GECR')
        openMesBox('Список оборудования пуст')}
      else {
        setMetric(dataArr)
        metricConfirm()
      }
    }
    const metricConfirm = () => {
      if (metricDataLoadConfirm == false) {setMetricDataLoadConfirm(true)}
      else {setMetricDataLoadConfirm(false)}
    }
    const updateTree = (state) => {
      setUpdTree(true);
      setUpdTree(false);
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
                metricConfirm = {metricDataLoadConfirm}
              />
              <Table_Stuff
                reload = {updateData}
                update={updateTable}
                selectedLst={updateTblLst}
                srch={srchData}
                getMetricData={getMetricData}
                setMetricData={setMetricData}
                setUpdateTree={updateTree}
              />
          </Col>
          <MessageBox message={mesBoxMessage} modalState={mesBoxState} close={closeMesBox}/>
        </Row>
      </Container>

    );
}
//sdfsdfs