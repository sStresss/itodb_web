import React, {useEffect} from "react";
import { Col, Row, Button as ButtonDefault } from "reactstrap";
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import '../App.css';
import axios from "axios";
import {API_HISTORY_URL} from "../constants";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const modalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1250,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
  height:"50vh"
};
var state = false
const promise = new Promise((resolve) => {
    resolve()
});
var rows = []

export default function HistoryModal(props) {
  React.useEffect(()=>{
    if (props.show[0] == 'true') {
      axios.post(API_HISTORY_URL, {'serial':props.show[1]}).then((res)=>{
        console.log(res.data)
        for (let i = 0; i<res.data['date'].length; i++ ) {
          rows[i] = {id:[i], date:res.data['date'][i],user:res.data['user'][i],serial:res.data['serial'][i], event:res.data['event'][i]}

        }
        console.log(rows)
        setModalOpen(true)
      })

    }
  },[props.show]);
  const columns = [
    { field: 'date', headerName: 'Дата', width:150},
    { field: 'user', headerName: 'Пользователь', width:100 },
    { field: 'serial', headerName: 'Серийный номер', width:150},
    { field: 'event', headerName: 'Событие', width:785}
  ];
  const style = makeStyles({
   root: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      color: 'white',
      padding: '0 30px',
    },
  });
  const classes = style()
  var [modalopen, setModalOpen] = React.useState(false);
  const handleModalClose = () => {
    state = false
    rows = []
    setModalOpen(false);
  }
  var [sortModel, setSortModel] = React.useState([
    {
      field: 'date',
      sort: 'desc',
    },
  ]);

  return (
    <Modal
      open={modalopen || false}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableEscapeKeyDown={true}
      onBackdropClick={handleModalClose}
    >
      <Box sx={modalstyle}>
        <Row>
          <DataGrid

              pagination
              sx={{
                  // position: 'absolute',
                  cursor: 'pointer',
                  marginTop: 0,
                  height: '40vh',
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
              // disableSelectionOnClick
              // hideFooter={true}
              rowHeight = {25}
              pageSize={20}
              sortModel = {sortModel}
              onSortModelChange={(model) => setSortModel(model)}
            />
        </Row>
        <Row>
          <ButtonDefault
            color="primary"
            className="float-right"
            onClick={handleModalClose}
            style={{
              marginTop: "10px",
              marginLeft: "auto",
              marginRight: "10px",
              width: "100px",
              minWidth: "120px",
              height: "30px",
              padding: "0rem"
            }}
          >
            <a style={{paddingBottom: "10px"}}>Закрыть</a>
          </ButtonDefault>
        </Row>
      </Box>
    </Modal>
  )
}
