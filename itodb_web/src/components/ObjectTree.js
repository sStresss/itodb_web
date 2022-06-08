import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem, { useTreeItem}  from '@mui/lab/TreeItem';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreHoriz';
import NestedMenuItem from "material-ui-nested-menu-item"
import axios from "axios";
import "../myApp.css"
import WidgetsIcon from '@mui/icons-material/Widgets';
import {Col, Row, Button, Button as ButtonDefault} from "reactstrap";
import { styled, alpha } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ReactExport from "react-export-excel";

import {
  API_OBJECTS_URL,
  API_SUBOBJECTS_URL,
  API_OBJECT_NODE,
  API_OBJECT_STATUS,
  API_NEWSTAT_URL,
  API_STATNEWREC_URL,
  API_STATEDITREC_URL,
  API_OBJECTREFERAL_URL,
  API_EXPORTTOEXEL_URL
} from "../constants";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TextField from '@mui/material/TextField';
import {DataGrid} from "@mui/x-data-grid";
import {makeStyles} from "@mui/styles";
import FormControl, { useFormControl}  from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const modalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};
const submodalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};
const notemodalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};
const statusmodalstyle = {
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
const statusnewcellmodalstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 410,
    height:"minContent",
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
};
const promise = new Promise((resolve) => {
    resolve()
});
var referal_tmp = ''
var connect = false;

let url = `ws://127.0.0.1:8000/ws/socket-server/`


const socket = new WebSocket(url)
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
var dataSet1 = [];
var exportFileName = ''



export default function ObjectTree(props) {
    React.useEffect(() => {
        axios.get(API_OBJECTS_URL).then((response) => {
          setObject(response.data);
          console.log(response.data)
        });
    }, []);
    React.useEffect(() => {
        axios.get(API_SUBOBJECTS_URL).then((response) => {
            setSubObject(response.data);
        });
    }, []);
    var [test, setTest] = React.useState(false)
    const useStyles = makeStyles({
      "@global": {
        ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label": {
          backgroundColor: "white"
        },
        ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover, .MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label": {
          backgroundColor: "green"
        }
      }
    });
    const [menuPosition, setMenuPosition] = React.useState(null)
    var [referal, setReferal] = React.useState('')
    var [treeItemStyle, setTreeItemStyle] = React.useState({cursor: 'context-menu', marginLeft:"0px"})
    const clases = useStyles();
    var [stNsTypeLst, setStNsTypeLst] = React.useState([])
    var [stNsModelLst, setStNsModelLst] = React.useState([])
    const [stNsCountLst, setStNsCountLst] = React.useState([...Array(100).keys()])
    const [stNsType, setStNsType] = React.useState('');
    const [stNsModel, setStNsModel] = React.useState('');
    const [stNsCount, setStNsCount] = React.useState(null);
    const nameStuffForm = React.useRef(null)
    const handleStNsTypeChange = (event) => {
      setStNsType(event.target.value);
    };
    const handleStNsModelChange = (event) => {
      setStNsModel(event.target.value);
    };
    const handleStNsCountChange = (event) => {
      setStNsCount(event.target.value);
    };
    var [stEditCellTypeLst, setStEditCellTypeLst] = React.useState([])
    var [stEditCellModelLst, setStEditCellModelLst] = React.useState([])
    const [stEditCellCountLst, setStEditCellCountLst] = React.useState([...Array(150).keys()])
    const [stEditCellType, setStEditCellType] = React.useState('');
    const [stEditCellModel, setStEditCellModel] = React.useState('');
    const [stEditCellCount, setStEditCellCount] = React.useState(null);
    const handleStEditCellTypeChange = (event) => {
      setStEditCellType(event.target.value);
    };
    const handleStEditCellModelChange = (event) => {
      setStEditCellModel(event.target.value);
    };
    const handleStEditCellCountChange = (event) => {
      setStEditCellCount(event.target.value);
    };
    var [modalStatusNewCellOpen, setModalStatusNewCellOpen] = React.useState(false);
    const handleModalStatusNewCellClose = () => setModalStatusNewCellOpen(false);
    var [modalStatusEditCellOpen, setModalStatusEditCellOpen] = React.useState(false);
    const handleModalStatusEditCellClose = () => setModalStatusEditCellOpen(false);
    const [selectedStatusTblRow, setSelectedStatusTblRow] = React.useState();
    const [contextStatusTblMenu, setContextStatusTblMenu] = React.useState(null);
    const handleStatusTblMenuClose = () => {
      setContextStatusTblMenu(null);
    };
    const handleContextStatusTblMenu = (event) => {
      event.preventDefault();
      setSelectedStatusTblRow(Number(event.currentTarget.getAttribute('data-id')));
      setContextStatusTblMenu(
        contextStatusTblMenu === null
          ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
          : null,
      );
    };
    const statusTblCellEdit = () => {
      handleStatusTblMenuClose();
      console.log(statusRows[selectedStatusTblRow])
      let pk = statusRows[selectedStatusTblRow]['pk']
      if (pk != '') {
        axios.get(API_NEWSTAT_URL).then((response) => {
          let ns_types = (response.data)['types'];
          let ns_models = (response.data)['models'];
          var rows = [];
          var p_rows = [];
          for (var i = 0; i < ns_types.length; i++) {
              rows[i] = ns_types[i];
          }
          ;
          for (var i = 0; i < ns_models.length; i++) {
              p_rows[i] = ns_models[i];
          };
          setStEditCellTypeLst(rows);
          setStEditCellType(statusRows[selectedStatusTblRow]['type']);
          setStEditCellModelLst(p_rows);
          setStEditCellModel(statusRows[selectedStatusTblRow]['model']);
          setStEditCellCount(statusRows[selectedStatusTblRow]['count_spec']);
          setModalStatusEditCellOpen(true);
          }
        );
      }
    }
    socket.onmessage = function(e){
      let data = JSON.parse(e.data)
      axios.get(API_OBJECTS_URL).then((response) => {
          setObject(response.data);
      });

    }
    const statusTblCellEditSave = () => {
      const pk = statusRows[selectedStatusTblRow]['pk']
      const connect = document.getElementById('connect_par_name').textContent
      const type = document.getElementById("stEditCellType").textContent
      const model = document.getElementById("stEditCellModel").textContent
      const count = document.getElementById("stEditCellCount").textContent
      axios.put(API_STATEDITREC_URL + pk, {type, model, count, connect}).then((response)=> {
        axios.get(API_OBJECT_STATUS + connect).then((response) => {
          let rows = []
          console.log(response.data)
          for (let i = 0; i<response.data['type'].length; i++) {
            console.log('elem: '+response.data)
            rows[i] = { id:i, type:response.data['type'][i],
                        model: response.data['model'][i],
                        count_spec:response.data['count_spec'][i],
                        count_fact:response.data['count_fact'][i],
                        pk:response.data['pk'][i],
                      }
          }
          let j = 0
          if (rows.length!==0) {j = rows.length}
          rows[j] = { id:j, type:'+',
                        model: '',
                        count_spec:'',
                        count_fact:'',
                        pk:''
                      }
          setModalStatusEditCellOpen(false);
          setStatusRows(rows);
          updateTree()
        })
      })
    }
    const statusTblCellDelete = () => {
      handleStatusTblMenuClose();

      console.log(statusRows[selectedStatusTblRow]['pk'])
      let pk = statusRows[selectedStatusTblRow]['pk']
      let connect = document.getElementById('connect_par_name').textContent
      if (pk !== '') {
        axios.delete(API_STATEDITREC_URL + pk).then(res => {
          axios.get(API_OBJECT_STATUS + connect).then((response) => {
            let rows = []
            console.log(response.data)
            for (let i = 0; i<response.data['type'].length; i++) {
              console.log('elem: '+response.data)
              rows[i] = { id:i, type:response.data['type'][i],
                          model: response.data['model'][i],
                          count_spec:response.data['count_spec'][i],
                          count_fact:response.data['count_fact'][i],
                          pk:response.data['pk'][i],
                        }
            }
            let j = 0
            if (rows.length!==0) {j = rows.length}
            rows[j] = { id:j, type:'+',
                          model: '',
                          count_spec:'',
                          count_fact:'',
                          pk:''
                        }
            setModalStatusNewCellOpen(false);
            setStatusRows(rows);
            updateTree()
          })
        })
      }
    }
    const handleStatusTblNewCell = (event) => {
      if (statusRows[Number(event.currentTarget.getAttribute('data-id'))]['type'] === '+') {
        axios.get(API_NEWSTAT_URL).then((response) => {
          let ns_types = (response.data)['types'];
          let ns_models = (response.data)['models'];
          var rows = [];
          var p_rows = [];
          for (var i = 0; i < ns_types.length; i++) {
              rows[i] = ns_types[i];
          }
          ;
          for (var i = 0; i < ns_models.length; i++) {
              p_rows[i] = ns_models[i];
          };
          setStNsTypeLst(rows);
          setStNsType(rows[0]);
          setStNsModelLst(p_rows);
          setStNsModel(p_rows[0]);
          setModalStatusNewCellOpen(true);
          }
        );
      }
    }
    const statusTblAddNewCell = () => {
      const connect = document.getElementById('connect_par_name').textContent
      const type = document.getElementById("stNsType").textContent
      const model = document.getElementById("stNsModel").textContent
      const count = document.getElementById("stNsCount").textContent
      let rows = statusRows;
      let p_rows = [];
      let i = 0;
      for (i = 0; i<rows.length-1;i++) {
        p_rows[i] = rows[i]
      }
        p_rows[i] = { id:i,
                    type: type,
                    model: model,
                    count_spec:count,
                    count_fact:'0'
                  }
        p_rows[i+1] = { id:i+1,
          type: '+',
          model: '',
          count_spec:'',
          count_fact:''
        }
        axios.post(API_STATNEWREC_URL, {type, model, count, connect}).then((response)=>{
          axios.get(API_OBJECT_STATUS + connect).then((response) => {
          let rows = []
          console.log(response.data)
          for (let i = 0; i<response.data['type'].length; i++) {
            console.log('elem: '+response.data)
            rows[i] = { id:i, type:response.data['type'][i],
                        model: response.data['model'][i],
                        count_spec:response.data['count_spec'][i],
                        count_fact:response.data['count_fact'][i],
                        pk:response.data['pk'][i],
                      }
          }
          let j = 0
          if (rows.length!==0) {j = rows.length}
          rows[j] = { id:j, type:'+',
                        model: '',
                        count_spec:'',
                        count_fact:'',
                        pk:''
                      }
          setModalStatusNewCellOpen(false);
          setStatusRows(rows);
          updateTree()
        })
        })


    }
    var [parentNodeColor, setParentNodeColor] = React.useState('#3B4049');

    const CustomContent = React.forwardRef(function CustomContent(props, ref) {
        const {
            classes,
            className,
            label,
            nodeId,
            icon: iconProp,
            expansionIcon,
            displayIcon,
            value,
        } = props;

        const {
            disabled,
            expanded,
            selected,
            focused,
            handleExpansion,
            handleSelection,
            preventSelection,
        } = useTreeItem(nodeId);
        var [status, setStatus] = React.useState(props['label'].props.children[1].props.children)

        const icon = iconProp || expansionIcon || displayIcon;

        const handleMouseDown = (event) => {
            preventSelection(event);
        };

        const handleExpansionClick = (event) => {
            handleExpansion(event);
        };

        const handleSelectionClick = (event) => {
          handleSelection(event)
          // return updateTable('tree_parent', props['nodeId'],'',props['label'].props.children[0].props.children.props.children[1].props.children,'')
          // console.log(['tree_parent', props['nodeId'],'',props['label'].props.children[0].props.children.props.children[1].props.children,''])
        };

        const handleContextClick = (event) => {
            handleSelection(event);
        };
        return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={clsx(className, classes.root, {
            [classes.expanded]: expanded,
            [classes.selected]: selected,
            [classes.focused]: focused,
            [classes.disabled]: disabled,
          })}
          onMouseDown={handleMouseDown}
          ref={ref}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <Col style={{maxWidth:"20px", marginLeft:"-7px", marginTop:"-4px"}}>
            <img src={status} style={{height:'21px', width:""}} alt="sate"/>
          </Col>
          <div onClick={handleExpansionClick} className={classes.iconContainer} style={{marginLeft:"0px", minWidth:"30px"}}>
            {icon}
          </div>
          <Typography
            onClick={handleSelectionClick}
            component="div"
            className={classes.label}
            onContextMenu={handleContextClick}
          >
            {label}
          </Typography>
        </div>
        );
    });
    const CustomChildContent = React.forwardRef(function CustomContent(props, ref) {
        const {
            classes,
            className,
            label,
            nodeId,
            icon: iconProp,
            expansionIcon,
            displayIcon,
            value,
        } = props;

        const {
            disabled,
            expanded,
            selected,
            focused,
            handleExpansion,
            handleSelection,
            preventSelection,
        } = useTreeItem(nodeId);

        const icon = iconProp || expansionIcon || displayIcon;

        const handleMouseDown = (event) => {
            preventSelection(event);
        };

        const handleExpansionClick = (event) => {
            handleExpansion(event);
        };

        const handleSelectionClick = (event) => {
            handleSelection(event)
            // promise.then(()=>{updateTable('tree_child', props['nodeId'].toString().split('_')[0], props['nodeId'].toString().split('_')[1], props['label'].props.children[1].props.children, props['label'].props.children[0].props.children)});
        };

        const handleContextClick = (event) => {
            handleSelection(event);
        };
        return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={clsx(className, classes.root, {
            [classes.expanded]: expanded,
            [classes.selected]: selected,
            [classes.focused]: focused,
            [classes.disabled]: disabled,
          })}
          onMouseDown={handleMouseDown}
          ref={ref}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div onClick={handleExpansionClick} className={classes.iconContainer}>
            {icon}
          </div>
          <Typography
            onClick={handleSelectionClick}
            component="div"
            className={classes.label}
            onContextMenu={handleContextClick}
          >
            {label}
          </Typography>
        </div>
        );
    });
    CustomContent.propTypes = {
        /**
        * Override or extend the styles applied to the component.
        */
        classes: PropTypes.object.isRequired,
        /**
        * className applied to the root element.
        */
        className: PropTypes.string,
        /**
        * The icon to display next to the tree node's label. Either a parent or end icon.
        */
        displayIcon: PropTypes.node,
        /**
        * The icon to display next to the tree node's label. Either an expansion or collapse icon.
        */
        expansionIcon: PropTypes.node,
        /**
        * The icon to display next to the tree node's label.
        */
        icon: PropTypes.node,
        /**
        * The tree node label.
        */
        label: PropTypes.node,
        /**
        * The id of the node.
        */
        nodeId: PropTypes.string.isRequired,
        nodeName: PropTypes.string.isRequired,
        value: PropTypes.node
    };
    CustomChildContent.propTypes = {
        /**
        * Override or extend the styles applied to the component.
        */
        classes: PropTypes.object.isRequired,
        /**
        * className applied to the root element.
        */
        className: PropTypes.string,
        /**
        * The icon to display next to the tree node's label. Either a parent or end icon.
        */
        displayIcon: PropTypes.node,
        /**
        * The icon to display next to the tree node's label. Either an expansion or collapse icon.
        */
        expansionIcon: PropTypes.node,
        /**
        * The icon to display next to the tree node's label.
        */
        icon: PropTypes.node,
        /**
        * The tree node label.
        */
        label: PropTypes.node,
        /**
        * The id of the node.
        */
        nodeId: PropTypes.string.isRequired,
        nodeName: PropTypes.string.isRequired,
        value: PropTypes.node
    };
    const CustomTreeItem = (props) => (<TreeItem ContentComponent={CustomContent} {...props} />);
    const CustomChildTreeItem = (props) => (<TreeItem ContentComponent={CustomChildContent} {...props} />);
    const style = makeStyles({
     root: {
            background: 'red',
            border: 0,
            borderRadius: 3,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            color: 'white',
            height: 48,
            padding: '0 30px',
        },
    });
    const classes = style()
    var [sortModel, setSortModel] = React.useState([
          {
            field: 'state',
            sort: 'desc',
          },
      ]);
    const statusColumns = [ { field: 'type', headerName: 'Тип объекта', width: 180 },
                            { field: 'model', headerName: 'Модель', width: 150 },
                            { field: 'count_spec', headerName: 'спека', width: 70 },
                            { field: 'count_fact', headerName: 'факт', width: 70 },
                            { field: 'pk', headerName: 'pk', width: 10, hide:true }];
    var [statusRows, setStatusRows] = React.useState([])
    async function updateTable (event, type, pId, cId,pName, chName) {
      setTimeout(function () {
        props.update(event, type,pId,cId, pName, chName)
      }, 1)
    }
    const handleTreeSubObjClick = (e,pid, cid, pName, chName) => {
        return promise.then(()=>{updateTable('tree_child', pid.toString(), cid.toString(), pName.toString(), chName.toString())});
    }
    const globalTreeRefresh = () => {
        promise.then(()=>{updateTable('true','none', '', '','Главная')})
    }
    const [objects, setObject] = React.useState(null);
    const [subobjects, setSubObject] = React.useState(null);
    const [contextMenu, setContextMenu] = React.useState(null);
    const [contextRefMenu, setContextRefMenu] = React.useState(null);
    const [contextSubMenu, setContextSubMenu] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const nameForm = React.useRef(null)
    const subnameForm = React.useRef(null)
    const [modalopen, setModalOpen] = React.useState(false);
    const [submodalopen, setSubModalOpen] = React.useState(false);
    const [notemodalopen, setNoteModalOpen] = React.useState(false);
    var [modalStatusOpen, setModalStatusOpen] = React.useState(false)
    const handleModalStatusOpen = () => setModalStatusOpen(true);
    const handleModalStatusClose = () => setModalStatusOpen(false);
    const menuopen = Boolean(anchorEl);
    var [objectNote, setObjectNote] = React.useState('');
    var [objectNoteLabel, setObjectNoteLabel] = React.useState('')
    const handleMainMenuClick = (event) => {
      // setAnchorEl(event.currentTarget);
      setContextRefMenu(
          contextRefMenu === null
            ? {
                mouseX: event.target - 21,
                mouseY: event.target - 15,
              }
            : null,
        );

    };
    async function handleMainMenuClose(event) {
      if (referal_tmp !== document.getElementById('referal_textfield').value) {
        setContextRefMenu(null)
        referal_tmp = document.getElementById('referal_textfield').value
        setReferal(referal_tmp)
        let pk = document.getElementById('connect_par_name').innerText
        axios.put(API_OBJECTREFERAL_URL + pk, {referal: referal_tmp})
      }
      else {setContextRefMenu(null)}
    };
    const handleMenuClose = () => {
      setContextMenu(null);
    };
    const handleSubMenuClose = () => {
      setContextMenu(null);
      setContextSubMenu(null);
    };
    const handleDeleteNodeBtnClick = (event) => {
        handleMenuClose();
        let pk = document.getElementById('connect_par_name').innerText
        axios.delete(API_OBJECTS_URL + pk).then(res => {
          console.log(res.data)
          if (res.data['resp'] === 'denied') {alert('Ошибка! Объект нельзя удалить, т.к. в базе числится оборудование закрепленное да данным объектом.')}
          else {
            axios.get(API_OBJECTS_URL).then((response) => {
              setObject(response.data);
              return {Tree}
            })
          }
        })
    }
    const handleDeleteChildNodeBtnClick = (event) => {
        handleSubMenuClose();
        let pk = document.getElementById('connect_ch_name').innerText
        axios.delete(API_SUBOBJECTS_URL + pk).then(res => {
          console.log(res.data)
          if (res.data['resp'] === 'denied') {alert('Ошибка! Объект нельзя удалить, т.к. в базе числится оборудование закрепленное да данным объектом.')}
          else {
            axios.get(API_SUBOBJECTS_URL).then((response) => {
              setSubObject(response.data);
              return {Tree}
            })
          }
        })
    }
    function handleNodeContext(e, name) {
      exportFileName = e.target.firstChild.data + '_' + new Date()
      e.preventDefault();
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: e.clientX - 2,
              mouseY: e.clientY - 4,
            }
          : null,
      );
      getAsanaReferal(name)
      document.getElementById('connect_par_name').innerText = name

    }
    function handleNodeChildContext(ee, name) {
        ee.preventDefault();
        setContextSubMenu(
          contextSubMenu === null
            ? {
                mouseX: ee.clientX - 2,
                mouseY: ee.clientY - 4,
              }
            : null,
        );
    document.getElementById('connect_ch_name').innerText = name

  }
    const addTreeNode = event => {
      handleMenuClose()
      handleModalOpen()
    }
    const addTreeNodeSave = event => {
      socket.send(JSON.stringify({
        'message':'ADDNEWNODE!'
      }))
      const form = nameForm.current
      const code = `${form['newNodeCodeInput'].value}`
      const name = `${form['newNodeNameInput'].value}`
      const state = 'circle_red'
      axios.post(API_OBJECTS_URL, { code, name, state })
      .then(res => {
          handleModalClose()
          axios.get(API_OBJECTS_URL).then((response) => {
          setObject(response.data);
          return {Tree}
      })

      });
    }
    const addTreeSubNode = event => {
      handleSubMenuClose()
      handleSubModalOpen()
    }
    const addTreeSubNodeSave = event => {
        const form = subnameForm.current
        const name = `${form['newSubNodeNameInput'].value}`
        const connect = document.getElementById('connect_par_name').textContent
        axios.post(API_SUBOBJECTS_URL, { name, connect })
        .then(res => {
          handleSubModalClose()
          axios.get(API_SUBOBJECTS_URL).then((response) => {
            setSubObject(response.data);
            return {Tree}
          })
        });
    }
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const handleSubModalOpen = () => setSubModalOpen(true);
    const handleSubModalClose = () => setSubModalOpen(false);
    const handleNoteModalOpen = () => setNoteModalOpen(true);
    const handleNoteModalClose = () => setNoteModalOpen(false);
    const getNote = () => {
      handleSubMenuClose();
      let pk = document.getElementById('connect_par_name').innerText;
      axios.get(API_OBJECT_NODE + pk).then((response) => {
        setObjectNoteLabel('Заметки '+response.data['code']+'_'+response.data['name']);
        setObjectNote(response.data['note']);
        handleNoteModalOpen()
      })
    }
    const getStatus = () => {
      handleMenuClose()
      let pk = document.getElementById('connect_par_name').innerText;
      // document.getElementById('connect_node_id').innerText = '123123123';
      axios.get(API_OBJECT_STATUS + pk).then((response) => {
        let rows = []
        console.log(response.data)
        for (let i = 0; i<response.data['type'].length; i++) {
          console.log('elem: '+response.data)
          rows[i] = { id:i, type:response.data['type'][i],
                      model: response.data['model'][i],
                      count_spec:response.data['count_spec'][i],
                      count_fact:response.data['count_fact'][i],
                      pk:response.data['pk'][i]
                    }
        }
        let j = 0
        if (rows.length!==0) {j = rows.length}
        rows[j] = { id:j, type:'+',
                      model: '',
                      count_spec:'',
                      count_fact:'',
                      pk:'',
                    }
        setStatusRows(rows);
        handleModalStatusOpen()
      })
    }
    const setStatus = () => {
      handleModalStatusClose()
      console.log('save status!')
    }
    const objectNoteSave = () => {
      setNoteModalOpen(false)
      console.log(document.getElementById('objectNoteField').value)
      let pk = document.getElementById('connect_par_name').innerText;
      let code = ((objectNoteLabel.split(' '))[1].split('_'))[0]
      let name = ((objectNoteLabel.split(' '))[1].split('_'))[1]
      let note = document.getElementById('objectNoteField').value
      axios.put(API_OBJECT_NODE + pk, {code, name, note})
    }
    const updateTree = () => {
      axios.get(API_OBJECTS_URL).then((response) => {
          setObject(response.data);
          socket.send(JSON.stringify({
            'message':'ADDNEWNODE!'
          }))
        });
    }
    const checkUpdate = () => {
      if (props.isUpdate===true) {
        updateTree()
      }
    }
    const openFolder = (path) => {
      handleSubMenuClose();
      window.open('myproto://\\\\SINAPS-WORKSPACE\\itoDB\\web\\'+document.getElementById('connect_par_name').innerText + '\\' + path);
    }
    async function getAsanaReferal(pk) {
      axios.get(API_OBJECTREFERAL_URL + pk).then((response) => {
        setReferal(response.data['referal'])
        referal_tmp = response.data['referal']
      })
    }
    const getAsana = () => {
      window.open(referal_tmp)
    }
    const getExportData = () => {

      handleSubMenuClose();

      const pk = document.getElementById('connect_par_name').textContent
      axios.get(API_EXPORTTOEXEL_URL + pk).then((response)=>{
        for (let i=0;i<(response.data['type']).length;i++) {
          dataSet1[i] = {
            type : response.data['type'][i],
            model : response.data['model'][i],
            unittype: response.data['unittype'][i],
            count : response.data['count'][i],
            serial : response.data['serial'][i],
            location : response.data['location'][i]
          }
        }
        document.getElementById('exportToExel').firstChild.firstChild.click()
      })
    }
    checkUpdate()

    if (!objects) return null;
    if (!subobjects) return null;

    const Tree = <TreeView
            aria-label="icon expansion"
            defaultCollapseIcon={<ExpandMoreIcon style={{ color: 'white' }}/>}
            defaultExpandIcon={<ChevronRightIcon style={{ color: 'white' }}/>}
            sx={{height: 240,
              flexGrow: 1,
              maxWidth: 450,
              overflowY: 'auto'}}
            style={{marginLeft: "0px", marginTop: "-15px", minWidth:"240px" , height: "852px"}}
            className={'noscroll'}
        >
        <span id={'connect_par_name'}  hidden={true}></span>
        <span id={'connect_ch_name'}  hidden={true}></span>


            {objects.map(object => {
                let empty_check = true;
                subobjects.map(subobj => {
                        if (object.pk === subobj.connect) {
                            empty_check = false
                        }
                        return empty_check
                    })

                if (empty_check === false) {
                    let node_par_id = object.pk
                    let node_par_state = './'+object.state+'.png'
                    return  <Row style={{maxWidth:"264px"}}>
                              <Col
                              sx={{
                                      ".Mui-focused:focus": {
                                        backgroundColor: "#3B4049"
                                      }
                              }}>
                                <CustomTreeItem
                                  sx={{
                                      ".css-1g86id8-MuiTreeItem-content:hover": {
                                        backgroundColor: "#202836"
                                      },
                                      ".css-1g86id8-MuiTreeItem-content.Mui-selected": {
                                        backgroundColor: "#3B4049"
                                        // backgroundColor: {parentNodeColor}
                                      },
                                      ".css-1g86id8-MuiTreeItem-content.Mui-selected:hover": {
                                        backgroundColor: "#3B4049"
                                      },
                                      ".css-1g86id8-MuiTreeItem-content.Mui-selected.Mui-focused": {
                                        backgroundColor: "#3B4049"
                                      }
                                  }}
                                  key={object.pk}
                                  nodeId={object.pk}
                                  value = {object.code + '  ' + object.name}
                                  label={ <Row onClick={(e)=>{updateTable('true','tree_parent', object.pk,'',object.name,'')}} >
                                            <Col style={{color:"white"}}>
                                              <Row>
                                                <Col style={{maxWidth:'33px', fontSize:"14px"}}>
                                                  <a style={{marginLeft:"-10px"}}>{object.code}</a>
                                                </Col>
                                                <Col style={{fontSize:"12px", paddingTop:"3px", maxWidth:"242px"}}>
                                                  {object.name}
                                                </Col>
                                              </Row>
                                            </Col>
                                            <a hidden={true}>{node_par_state}</a>
                                          </Row>
                                        }
                                  onContextMenu={(e) => {
                                    handleNodeContext(e,node_par_id)
                                  }}

                                  style={{cursor: 'context-menu', marginLeft:"0px"}}
                                >
                                  {subobjects.map(subobj => {
                                    let node_ch_id = subobj.pk
                                    return parseInt(object.pk, 10) === parseInt(subobj.connect, 10) ?
                                        <CustomChildTreeItem
                                          sx={{
                                            ".css-1g86id8-MuiTreeItem-content:hover": {
                                              backgroundColor: "#202836"
                                            },
                                            ".css-1g86id8-MuiTreeItem-content.Mui-selected": {
                                              backgroundColor: "#3B4049"
                                            },
                                            ".css-1g86id8-MuiTreeItem-content.Mui-selected:hover": {
                                              backgroundColor: "#3B4049"
                                            },
                                            ".css-1g86id8-MuiTreeItem-content.Mui-selected.Mui-focused": {
                                              backgroundColor: "#3B4049"
                                            }
                                          }}
                                          onContextMenu={(ee) => {
                                            handleNodeChildContext(ee,node_ch_id)}
                                          }
                                          key={node_ch_id}
                                          nodeId={node_par_id.toString()+'_'+node_ch_id.toString()}
                                          label={
                                            <div onClick={(e)=>{updateTable('true','tree_child', object.pk, subobj.pk,object.name+' » '+subobj.name,'')}}>
                                              <a style={{fontSize:"13px", paddingLeft:"56px"}}>{subobj.name}</a>
                                              <a hidden={true}>{object.name}</a>
                                            </div>
                                          }
                                          style={{cursor: 'context-menu', color:'white', marginLeft:"-20px"}}
                                          onClick={(ee)=> {handleTreeSubObjClick(ee, node_par_id, node_ch_id, object.name, subobj.name)}}
                                        />
                                        : null
                                    }
                                  )}
                                </CustomTreeItem>
                              </Col>
                            </Row>
                } else {
                    let node_par_id = object.pk
                    let node_par_state = './'+object.state+'.png'
                    return  <Row style={{maxWidth:"294px"}}>
                                {/*<Col style={{maxWidth:"20px", marginRight:"-5px", marginTop:"-3px"}}>*/}
                                  {/*<img src={node_par_state} style={{height:'21px', width:""}} alt="sate"/>*/}
                                {/*</Col>*/}
                                <Col style={{maxWidth:"264px"}}>
                                  <CustomTreeItem
                                    sx={{
                                        ".css-1g86id8-MuiTreeItem-content:hover": {
                                          backgroundColor: "#202836"
                                        },
                                        ".css-1g86id8-MuiTreeItem-content.Mui-selected": {
                                          backgroundColor: "#3B4049"
                                        },
                                        ".css-1g86id8-MuiTreeItem-content.Mui-selected:hover": {
                                          backgroundColor: "#3B4049"
                                        },
                                        ".css-1g86id8-MuiTreeItem-content.Mui-selected.Mui-focused": {
                                          backgroundColor: "#3B4049"
                                        }

                                    }}
                                    key={object.code}
                                    nodeId={object.pk}
                                    nodeName = {object.code + '  ' + object.name}
                                    label={ <Row onClick={(e)=>{updateTable('true','tree_parent', object.pk,'',object.name,'')}}>
                                              <Col style={{color:"white"}}>
                                                <Row>
                                                  <Col style={{maxWidth:'33px', fontSize:"14px"}}>
                                                    <a style={{marginLeft:"-10px"}}>{object.code}</a>
                                                  </Col>
                                                  <Col style={{fontSize:"12px", paddingTop:"3px", maxWidth:"242px"}}>
                                                    {object.name}
                                                  </Col>
                                                </Row>
                                              </Col>
                                              <a hidden={true}>{node_par_state}</a>
                                            </Row>
                                      }
                                    onContextMenu={(e) => {handleNodeContext(e,node_par_id)}}
                                    style={{cursor: 'context-menu', marginLeft:"0px"}}
                                  />
                                </Col>
                            </Row>
                }
            })}
            <Row
              style={{maxWidth:"252px", color:"grey", maxHeight:"24px", cursor:"pointer"}}
              className={'btn_hov'}
              onClick={addTreeNode}
            >
              <Col style={{maxWidth:"45px", maxHeight:"24px", minHeight:"24px"}}>
                <Row style={{maxHeight:"10px", marginTop:"-2px"}}>
                  <a style={{marginLeft:"30px"}}>+</a>
                </Row>
              </Col>
            </Row>
        </TreeView>
    const statusTbl = <DataGrid
                        sx={{
                          border: 0,
                          height: 500,
                          marginTop: -0,
                          '& .MuiDataGrid-cell:hover': {
                            color: 'primary.main',
                          },
                          '& .MuiDataGrid-columnHeaderTitle':{
                              fontWeight: 'bold'
                          }
                        }}
                        className={classes}
                        rows={statusRows}
                        columns={statusColumns}
                        // disableSelectionOnClick
                        hideFooter={true}
                        rowHeight = {30}
                        sortModel = {sortModel}
                        onSortModelChange={(model) => setSortModel(model)}
                        componentsProps={{
                          row: {
                            onContextMenu: handleContextStatusTblMenu,
                            onClick: (e)=> handleStatusTblNewCell(e),
                            style: { cursor: 'context-menu' },
                          },
                        }}
                      />

  return (
    <div>
          <Row sx={{
                  minWidth:'240px'
                }}
               style={{cursor:"pointer"}} onClick={globalTreeRefresh}
          >
            <Col style={{maxWidth:"180px"}}>
              <h1 style={{ marginLeft: "17px", textAlign: 'left', color: 'white', fontFamily: 'arial', fontSize: '30px', paddingTop:'10px'}}>
                DATABASE
              </h1>
            </Col>
            <Col style={{maxWidth:"40px"}}>
              <IconButton
                aria-label="more"
                id="long-button"
                // aria-controls={menuopen ? 'long-menu' : undefined}
                // aria-expanded={menuopen ? 'true' : undefined}
                // aria-haspopup="true"
                onClick={handleMainMenuClick}
                style={{color:"white", marginTop:"10px"}}
              >
                <WidgetsIcon />
              </IconButton>
            </Col>
          </Row>
          <Row style={{backgroundColor:"#424b5b", maxHeight:"0.7px", minHeight:"0.7px", marginTop:"-5px"}}></Row>
          <Row style={{paddingTop:"30px"}}>
            {Tree}
          </Row>
          {/*MODAL NEW OBJECT*/}
          <Modal
            open={modalopen}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalstyle}>
                <Row style={{ borderBottom: "1px solid #fff", marginLeft: "-32px", marginTop: "-15px", width: "400px", }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <span style={{ paddingLeft: "20px"}}>Новый объект</span>
                    </Typography>
                </Row>
                <form ref={nameForm}>
                    <input maxLength={3} autoFocus={true} name={'newNodeCodeInput'} style={{ marginTop: "30px",border: "none" ,borderBottom: "1px solid #a3a3a3", backgroundColor: "#fefefe", outline: "none", marginLeft: "0px", width: "30px" }}/>
                    <input  autoFocus={false} name={'newNodeNameInput'} style={{ marginTop: "30px",border: "none" ,borderBottom: "1px solid #a3a3a3", backgroundColor: "#fefefe", outline: "none", marginLeft: "20px", width: "275px" }}/>
                </form>
                    <br/>
                <Row>
                    <Button
                        color="primary"
                        className="float-right"
                        onClick={addTreeNodeSave}
                        style={{ marginTop: "20px", marginLeft: "auto", marginRight: "10px", width: "100px", minWidth: "120px", height: "30px", padding: "0rem"}}
                    >
                        <a style={{ paddingBottom: "10px" }}>Добавить</a>
                    </Button>
                </Row>
            </Box>
          </Modal>
          {/*MODAL NEW SUBOBJECT*/}
          <Modal
            open={submodalopen}
            onClose={handleSubModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={submodalstyle}>
                <Row style={{ borderBottom: "1px solid #fff", marginLeft: "-32px", marginTop: "-15px", width: "300px", }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <span style={{ paddingLeft: "20px"}}>Новый дочерний объект</span>
                    </Typography>
                </Row>
                <form ref={subnameForm}>
                    <input  autoFocus={false} name={'newSubNodeNameInput'} style={{ marginTop: "30px",border: "none" ,borderBottom: "1px solid #a3a3a3", backgroundColor: "#fefefe", outline: "none", marginLeft: "0px", width: "235px"}}/>
                </form>
                    <br/>
                <Row>
                    <Button
                        color="primary"
                        className="float-right"
                        onClick={addTreeSubNodeSave}
                        style={{ marginTop: "20px", marginLeft: "auto", marginRight: "10px", width: "100px", minWidth: "120px", height: "30px", padding: "0rem"}}
                    >
                        <a style={{ paddingBottom: "10px" }}>Добавить</a>
                    </Button>
                </Row>
            </Box>
          </Modal>
          {/*MODAL NOTE*/}
          <Modal
            open={notemodalopen}
            onClose={handleNoteModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            // onBackdropClick={{}}
          >
            <Box sx={notemodalstyle}>
              <Row>
                <TextField
                  id="objectNoteField"
                  label={objectNoteLabel}
                  multiline
                  rows={25}
                  defaultValue={objectNote}
                  style={{minWidth:"500px", minHeight:"600px", padding: "0rem"}}
                />
              </Row>
              <Row>
                  <Button
                      color="primary"
                      className="float-right"
                      onClick={objectNoteSave}
                      style={{ marginTop: "20px", marginLeft: "auto", marginRight: "10px", width: "100px", minWidth: "120px", height: "30px", padding: "0rem"}}
                  >
                      <a style={{ paddingBottom: "10px" }}>Сохранить</a>
                  </Button>
              </Row>
            </Box>
          </Modal>
          {/*MODAL STATUS*/}
          <Modal
              open={modalStatusOpen || false}
              onClose={handleModalStatusClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              >
              <Box sx={statusmodalstyle}>
                <Row style={{  marginLeft: "-10px", marginTop: "-10px", width: "500px", textAlign:"center" }} >
                  <div style={{}}>
                    {statusTbl}
                  </div>
                </Row>
                <Row style={{  marginLeft: "-100px", marginTop: "10px", width: "500px", textAlign:"right" }}>
                  <ButtonDefault
                      color="primary"
                      className="float-right"
                      onClick={setStatus}
                      style={{ marginTop: "20px", marginLeft: "462px", marginRight: "10px", width: "100px", minWidth: "120px", height: "30px", padding: "0rem"}}
                  >
                      <a  style={{ paddingBottom: "10px" }}>Сохранить</a>
                  </ButtonDefault>
                </Row>
              </Box>
          </Modal>
          {/*MODAL STATUS TBL NEW CELL*/}
          <Modal
            open={modalStatusNewCellOpen || false}
            onClose={handleModalStatusNewCellClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onBackdropClick = {handleModalStatusNewCellClose}
            disableEscapeKeyDown={true}
          >
            <Box sx={statusnewcellmodalstyle}>
                    <Row>
                        <Col>
                            <Row style={{marginTop:"5px"}}><span>Тип</span></Row>
                            <Row style={{marginTop:"28px"}}><span>Модель</span></Row>
                            <Row style={{marginTop:"28px"}}><span>Кол-во</span></Row>
                        </Col>
                        <Col>
                             <Row style={{marginTop:"0px", width:"250px"}}>
                                 <FormControl variant="standard" sx={{ m: 0, minWidth: 120, marginLeft:-1 }}>
                                    <Select
                                      labelId="stNsType"
                                      id="stNsType"
                                      value={stNsType || stNsTypeLst[0]}
                                      onChange={handleStNsTypeChange}
                                      label="Age"
                                    >
                                      {stNsTypeLst.map(type=> {
                                        return <MenuItem key={type} value={type}>{type}</MenuItem>
                                      })}
                                    </Select>
                                </FormControl>
                            </Row>
                            <Row style={{marginTop:"20px", width:"250px", paddingLeft:"0px"}}>
                                <FormControl variant="standard" sx={{ m: 0, minWidth: 120, marginLeft:-1 }}>
                                    <Select
                                      labelId="stNsModel"
                                      id="stNsModel"
                                      value={stNsModel || stNsModelLst[0]}
                                      onChange={handleStNsModelChange}
                                      label="Age"
                                    >
                                      {stNsModelLst.map(type=> {
                                        return <MenuItem key={type} value={type}>{type}</MenuItem>
                                      })}
                                    </Select>
                                </FormControl>
                            </Row>
                            <Row style={{marginTop:"20px", width:"70px", paddingLeft:"-20px"}}>
                                <FormControl variant="standard" sx={{ m: 0, minWidth: 70, marginLeft:-1 }}>
                                    <Select
                                      labelId="stNsCount"
                                      id="stNsCount"
                                      value={stNsCount || stNsCountLst[0]}
                                      onChange={handleStNsCountChange}
                                      label="Age"
                                      MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                                    >
                                      {stNsCountLst.map(type=> {
                                        return <MenuItem key={type} value={type}>{type}</MenuItem>
                                      })}
                                    </Select>
                                </FormControl>
                            </Row>
                        </Col>
                    </Row>
                    <br/>
                <Row>
                    <ButtonDefault
                        color="primary"
                        className="float-right"
                        onClick={statusTblAddNewCell}
                        style={{ marginTop: "0px", marginLeft: "auto", marginRight: "10px", width: "100px", minWidth: "120px", height: "30px", padding: "0rem"}}
                    >
                        <a  style={{ paddingBottom: "10px" }}>Добавить</a>
                    </ButtonDefault>
                </Row>
            </Box>
          </Modal>
          {/*MODAL STATUS TBL EDIT CELL*/}
          <Modal
            open={modalStatusEditCellOpen || false}
            onClose={handleModalStatusEditCellClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onBackdropClick = {handleModalStatusEditCellClose}
            disableEscapeKeyDown={true}
            >
            <Box sx={statusnewcellmodalstyle}>
                <Row>
                    <Col>
                        <Row style={{marginTop:"5px"}}><span>Тип</span></Row>
                        <Row style={{marginTop:"28px"}}><span>Модель</span></Row>
                        <Row style={{marginTop:"28px"}}><span>Кол-во</span></Row>
                    </Col>
                    <Col>
                      <Row style={{marginTop:"0px", width:"250px"}}>
                           <FormControl variant="standard" sx={{ m: 0, minWidth: 120, marginLeft:-1 }}>
                              <Select
                                labelId="stEditCellType"
                                id="stEditCellType"
                                value={stEditCellType || stEditCellTypeLst[0]}
                                onChange={handleStEditCellTypeChange}
                                label="Age"
                              >
                                {stEditCellTypeLst.map(type=> {
                                  return <MenuItem key={type} value={type}>{type}</MenuItem>
                                })}
                              </Select>
                          </FormControl>
                    </Row>
                      <Row style={{marginTop:"20px", width:"250px", paddingLeft:"0px"}}>
                          <FormControl variant="standard" sx={{ m: 0, minWidth: 120, marginLeft:-1 }}>
                              <Select
                                labelId="stEditCellModel"
                                id="stEditCellModel"
                                value={stEditCellModel || stEditCellModelLst[0]}
                                onChange={handleStEditCellModelChange}
                                label="Age"
                              >
                                {stEditCellModelLst.map(type=> {
                                  return <MenuItem key={type} value={type}>{type}</MenuItem>
                                })}
                              </Select>
                          </FormControl>
                      </Row>
                      <Row style={{marginTop:"20px", width:"70px", paddingLeft:"-20px"}}>
                          <FormControl variant="standard" sx={{ m: 0, minWidth: 70, marginLeft:-1 }}>
                              <Select
                                labelId="stEditCellCount"
                                id="stEditCellCount"
                                value={stEditCellCount || stEditCellCountLst[0]}
                                onChange={handleStEditCellCountChange}
                                label="Age"
                                MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                              >
                                {stEditCellCountLst.map(type=> {
                                  return <MenuItem key={type} value={type}>{type}</MenuItem>
                                })}
                              </Select>
                          </FormControl>
                      </Row>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <ButtonDefault
                        color="primary"
                        className="float-right"
                        onClick={handleModalStatusEditCellClose}
                        style={{ marginTop: "0px", marginLeft: "auto", marginRight: "10px", width: "100px", minWidth: "120px", height: "30px", padding: "0rem"}}
                    >
                        <a  style={{ paddingBottom: "10px" }}>Отмена</a>
                    </ButtonDefault>
                    <ButtonDefault
                        color="primary"
                        className="float-right"
                        onClick={statusTblCellEditSave}
                        style={{ marginTop: "0px", marginLeft: "auto", marginRight: "10px", width: "100px", minWidth: "120px", height: "30px", padding: "0rem"}}
                    >
                        <a  style={{ paddingBottom: "10px" }}>Сохранить</a>
                    </ButtonDefault>
                </Row>
            </Box>
          </Modal>
          {/*MENU STATUS TBL CONTEXT*/}
          <Menu
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 0,
                // backgroundColor:"#3B4049",
                // color:"white"
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
            <MenuItem onClick={(e)=>{statusTblCellEdit()}}>Редактировать</MenuItem>
            <MenuItem onClick={(e)=>{statusTblCellDelete()}}>Удалить</MenuItem>
          </Menu>
          {/*MENU ASANA REFERAL URL*/}
          <Menu
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 0,
                border:"1px solid rgb(91,98,111)",
                backgroundColor:"#3B4049",
                color:"white",
                minWidth:"160px"
              },
              '& .MuiMenu-list': {
                padding: '0px',
              },
              '& .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root': {
                fontSize: '12px',
              },
              '& .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root:hover': {
                backgroundColor:"#3B4049",
              }
            }}
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              open={contextRefMenu !== null}
              anchorReference="anchorPosition"
              anchorPosition={
                  contextRefMenu !== null
                      ? {top: contextRefMenu.mouseY, left: contextRefMenu.mouseX}
                      : undefined
              }
              onClose={handleMainMenuClose}
              PaperProps={{
                style: {
                  // maxHeight: ITEM_HEIGHT * 4.5,
                  width: '35ch',
                  color:"white"
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
              <MenuItem
                className={'custom_menu_item_referal'}
              >
                <form ref={nameStuffForm}>
                        <TextField
                          sx={{marginX:"-16px"}}
                          id="referal_textfield"
                          name={"referal_textfield"}
                          defaultValue={referal}
                          variant="standard"
                          type={"custom_textfield"}
                        />
                      </form>
              </MenuItem>

          </Menu>
          {/*MENU TREE NODE*/}
          <Menu
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 0,
                border:"1px solid rgb(91,98,111)",
                backgroundColor:"#3B4049",
                color:"white",
                minWidth:"120px"
              },
              '& .MuiMenu-list': {
                padding: '0px',
              },
              '& .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root': {
                fontSize: '12px',
              },
              '& .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root:hover': {
                backgroundColor:"rgb(75, 110, 175)",
              }
            }}
            open={contextMenu !== null && contextSubMenu === null}
            onClose={handleMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={
                contextMenu !== null
                    ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                    : undefined
            }
            componentsProps={{
              root: {
                onContextMenu: (e) => {
                  e.preventDefault();
                  if (e.target.getAttribute('id') !== 'Asana') {
                    handleMenuClose();
                  }
                  else {
                    var rect = e.target.getBoundingClientRect();
                    setContextRefMenu(
                      contextRefMenu === null
                          ? {
                              mouseX: rect.right,
                              mouseY: rect.top - 3,
                            }
                          : null,
                      );
                  }
                }

              },
            }}
          >
            <a id={'exportToExel'} hidden={true}><ExDownload/></a>
              <MenuItem onClick={getStatus} className={'custom_menu_item'}>Статус</MenuItem>
              <MenuItem onClick={getExportData} className={'custom_menu_item'}>Выгрузить</MenuItem>
              <Divider style={{ height:"1px", marginTop:"2px", marginBottom:"2px"}} />
              <MenuItem onClick={()=>{openFolder('documentation')}} className={'custom_menu_item'}>Документы</MenuItem>
              <MenuItem onClick={()=>{openFolder('photo')}} className={'custom_menu_item'}>Фотографии</MenuItem>
              <MenuItem onClick={()=>{openFolder('network')}} className={'custom_menu_item'}>Интеграция</MenuItem>
              <Divider style={{ height:"1px", marginTop:"2px", marginBottom:"2px"}} />
              <MenuItem onClick={getNote} className={'custom_menu_item'}>Заметки</MenuItem>
              <MenuItem onClick={addTreeSubNode} className={'custom_menu_item'}>Добавить</MenuItem>
              <Divider style={{ height:"1px", marginTop:"2px", marginBottom:"2px"}} />
              <MenuItem onClick={getAsana} className={'custom_menu_item'} onContextMenu={(e)=>{handleMainMenuClick(e)}} id={'Asana'}>Asana</MenuItem>
              <Divider style={{ height:"1px", marginTop:"2px", marginBottom:"2px"}}  />
              <MenuItem onClick={handleDeleteNodeBtnClick} className={'custom_menu_item'}>Удалить</MenuItem>
          </Menu>
          {/*MENU TREE SUBNODE*/}
          <Menu
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 0,
                backgroundColor:"#3B4049",
                color:"white"
              },
              '& .MuiMenu-list': {
                padding: '0px',
              },
              '& .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root': {
                fontSize: '12px',
              },
              '& .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root:hover': {
                backgroundColor:"rgb(75, 110, 175)"
              },
            }}
            open={contextSubMenu !== null}
            onClose={handleSubMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={
                contextSubMenu !== null
                    ? {top: contextSubMenu.mouseY, left: contextSubMenu.mouseX}
                    : undefined
            }
            componentsProps={{
              root: {
                onContextMenu: (e) => {
                  e.preventDefault();
                  handleMenuClose();
                }
              },
            }}
            >
                <MenuItem onClick={handleDeleteChildNodeBtnClick}>Удалить</MenuItem>
        </Menu>
    </div>
  );
}

class ExDownload extends React.Component {
    render() {
        return (
            <ExcelFile filename={exportFileName} element={<MenuItem  className={'custom_menu_item'}>Выгрузить</MenuItem>}>
                <ExcelSheet name={'123'} data={dataSet1} name="Employees">
                    <ExcelColumn label="Модель" value="model"/>
                    <ExcelColumn label="Тип" value="type"/>
                    <ExcelColumn label="Ед.Изм." value="unittype"/>
                    <ExcelColumn label="Шт." value="count"/>
                    <ExcelColumn label="Серийный номер" value="serial"/>
                    <ExcelColumn label="Расположение" value="location"/>
                </ExcelSheet>
            </ExcelFile>
        );
    }
}