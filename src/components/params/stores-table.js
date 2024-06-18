import {
    Box,
    Card,
    Divider,
    CardContent,
    CardHeader,
    Button,
    Stack,
    Autocomplete,
    TextField,
    Typography,
    Unstable_Grid2 as Grid
  } from '@mui/material';
  import { Cancel } from "@mui/icons-material";
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  import SaveIcon from '@mui/icons-material/Save';
  import CancelIcon from '@mui/icons-material/Close';
  import AddIcon from '@mui/icons-material/Add';
  import { DataGrid,GridRowEditStopReasons, GridRowModes, useGridApiRef, GridActionsCellItem, GridToolbarContainer} from '@mui/x-data-grid';
  import _ from 'lodash';
  import { formatCurrency } from '../../utils/money-format';
  import React, { useEffect } from 'react';
  import { useSelector } from 'react-redux';
  import { getSalesTodayDetail, getProducts,addProductSale,getStores } from '../../actions'
  
  
  
  

  const initialRows = [
    //{ id: 1, p: "The Shawshank Redemption",  c: 35,pvp:35,cost:10 },
    //{ id: 2, p: "Cersei", c: 42 },
    //{ id: 3, p: "", c: 0 },
  ];
  
  function EditToolbar(props) {
    const { setRows, setRowModesModel,rows } = props;
  
    const handleClick = () => {
      //let idCounter = rows?.length != null ? rows.length:0;
      const id = rows.length>0? rows.slice(-1)[0]?.id + 1:1;
      console.log('slice',id,rows.slice(-1)[0],rows)
      //console.log('idCounter',idCounter,'rows:',rows,rows.slice(-1)[0])
      setRows((oldRows) => [...oldRows, { id, p: '', pId:'', c: 1, pvp: 0,w: 0, cost:0, subTotal:0, u:0 }]);
  /*     setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'pp' },
      })); */
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Agregar Tienda
        </Button>
      </GridToolbarContainer>
    );
  }
  
  export const StoresTable = (props) => {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const user = JSON.parse(localStorage.getItem('user'))
    const companyId = user.companyId;
    const di = !props.di?0:props.di;
    const apiRef = useGridApiRef();
    const { cost, profit, sales,tax = 0.19 } = props;
  
    const stores = useSelector((state) => state.stores);
    const selectedSale = useSelector((state) => state.selectedSale);
  
    useEffect(() => {
      //if(products == null){
        getStores({companyId:companyId});
      //}
    }, []);
  
  useEffect(() => {
    if(rows){
      //console.log('update rows in store',rows);
      addProductSale(rows);
    }
  }, [rows]);

  useEffect(() => {
    if(stores){
        console.log('stores::',stores)
      //console.log('update rows in store',rows);
      setRows(stores);
    }
  }, [stores]);
  
  const columns = [
    {
      field: 'name',
      headerName: 'Almacen',
      flex: 0.35,
      editable: true,
      type: 'string',
    },
    {
      field: 'location',
      headerName: 'Ubicacion',
      type: 'string',
      flex: 0.25,
      editable: true,
    },
    {
      field: 'phone',
      headerName: 'telefono',
      type: 'string',
      flex: 0.2,
      editable: true,
    },
    {
      field: 'nit',
      headerName: 'ID',
      type: 'string',
      flex: 0.1,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      cellClassName: "actions",
      flex: 0.1,
      getActions: ({ id }) => {
       /*  const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        } */
          return [
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              /*onClick={() => {
                apiRef.current.updateRows([{ id: id, _action: "delete" }]);
              }}*/
            />
          ];
      }
    }
  /*     {
      field: 'fullName',
      headerName: 'Full name',
      type: 'singleSelect',
      valueOptions: ['United Kingdom', 'Spain', 'Brazil', 'Brarzil', 'Brarszil', 'Bsrazil', 'Brazil', 'Brazil', 'Brazil'],
      editable: true,
    } */
  ];
  
  
  let idCounter = rows?.length != null ? rows.length:0;
  
  
  
  /*const handleAddRow = () => {
    idCounter += 1;
    apiRef.current.updateRows([{ id: idCounter, p: "", c: 1 }]);
  };
  
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };*/
  
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };
  
  const processRowUpdate = (newRow) => {
    console.log('newRow',newRow.c*newRow.pvp)
    let subTotal = 0;
    subTotal = newRow.c * newRow.pvp;
    const updatedRow = { ...newRow,pp:'',subTotal};
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };
  
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  
  let total = 0;
  
  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };
  
    const [value, setValue] = React.useState(null);
    console.log('ROWS',rows)
    return (
      <Card>
        <Box sx={{  width: '100%' }}>
      <DataGrid
        initialState={{
          columns: {
            columnVisibilityModel: {
              w: false,
            },
          },
        }}
        apiRef={apiRef} 
        showCellVerticalBorder
        sx={{
          boxShadow: 2,
          border: 1,
          borderColor: 'primary.light',
          /*'& .MuiDataGrid-row': {
            color: 'primary.main',
            border: 1,
            borderColor: '#F6F5F5'
          },*/
        }}
        rows={rows}
        columns={columns}
        //editMode="row"
        //rowModesModel={rowModesModel}
        //onRowModesModelChange={handleRowModesModelChange}
        //onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel,rows },
        }}
      />
    </Box>
  
      </Card>
    );
  };
  