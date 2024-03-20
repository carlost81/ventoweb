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
import { getSalesTodayDetail, getProducts,addProductSale } from '../../actions'




/*   const CountButton = (params) => {
  const [value, setValue] = React.useState(null);
  return (
      <Autocomplete
      id="test1"
      disablePortal
      freeSolo={false}
      multiple={false}
      disableClearable
      options={top100Films}
      getOptionLabel={(option) => option.title}
      sx={{ width: 300 }}
      renderInput={(params) => {
        return <TextField {...params} label="Movie" variant="standard" />
      }}
    />
  );
}; */
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
        Agregar Producto
      </Button>
    </GridToolbarContainer>
  );
}

export const ProductsBySale = (props) => {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const di = !props.di?0:props.di;
  const enablepvw = props.enablepvw;
  console.log('enablepvw',enablepvw);
  const apiRef = useGridApiRef();
  const { cost, profit, sales,companyId = '1',tax = 0.19 } = props;

  const products = useSelector((state) => state.products);
  const selectedSale = useSelector((state) => state.selectedSale);

  useEffect(() => {
    console.log('selectedSale.pbs',selectedSale)
    if(selectedSale?.productsSale){
      setRows(selectedSale.productsSale);
    }
    //if(products == null){
      console.log('products is null');
      getProducts({companyId:companyId});
    //}
  }, []);

useEffect(() => {
  if(rows){
    //console.log('update rows in store',rows);
    addProductSale(rows);
  }
}, [rows]);

const columns = [
  {
    field: 'pp',
    headerName: 'Producto',
    flex: 0.45,
    editable: true,
    type: 'singleSelect',
    renderCell: (params) => {
      return <div>{params.row.p}</div>;
    },
    renderEditCell: (params) => {

      //console.log('products',products)
      //console.log('params.row.p',params.row.p)
      //const filteredSortedRowsAndIds = apiRef.current.getRowModels();
      //console.log('filteredSortedRowsAndIds',filteredSortedRowsAndIds);
      return (
        <Autocomplete
          options={products.filter(item => item.u != undefined)}
          //disableClearable
          //freeSolo
          onChange={(event, newValue) => {
            const rowsSelected = apiRef.current.getSelectedRows();
            //console.log('rows+',rows,rowsSelected, rowsSelected.size,Array.from(rowsSelected)[0]);
            let firstRow = null;
            if (rowsSelected.size>0){
              firstRow = Array.from(rowsSelected)[0];
            }else{
              firstRow = [1];
            }
            //if (firstRow == undefined) console.log('is undefined')
            //console('fr',typeof(firstRow) !== undefined?'yy':'xx');
            console.log('cc',newValue,firstRow[0],firstRow,firstRow[1].c);
            processRowUpdate({id: firstRow[0], p: newValue.n, pId: newValue.id,c:firstRow[1].c, pvp:newValue.v,w:(newValue?.w>0?newValue.w:null), cost:newValue.u,subTotal:firstRow[1].c*newValue.v,u:firstRow[1].c*(newValue.v-newValue.u)});
            //apiRef.current.updateRows([{ id: firstRow[0], p: newValue.n, price:newValue.v }]);
          }}
          //defaultValue={params1.getValue("lastName")}
          getOptionLabel={(option) => {
            //console.log('opt',option)
            return option?.n || ""
          }}
          style={{ width: "100%", paddingTop: 20 }}
          renderInput={(params) => {
            return <TextField {...params} autoFocus />
          }}
        />
      );
    }
  },
  {
    field: 'c',
    headerName: 'Cantidad',
    type: 'number',
    flex: 0.1,
    editable: true,
  },
  {
    field: 'w',
    headerName: 'W',
    type: 'number',
    hide: true,
    valueGetter: ({ row }) => {
      if (enablepvw) {
        return row?.w>0?row?.w:null;
      } else {
        return null;
      }
    }
  },
  {
    field: 'pvp',
    headerName: '$$',
    type: 'number',
    flex: 0.25,
    editable: false,
    valueGetter: ({ row }) => {
      if (enablepvw) {
        return row?.w>0?row?.w:row?.pvp;
      } else {
        return row.pvp;
      }
    },
    valueFormatter: (params) => {
      return formatCurrency(params.value);
    },
  },
  {
    field: 'subTotal',
    headerName: 'SubTotal',
    type: 'number',
    flex: 0.25,
    valueGetter: ({ row }) => {
      if (!row.c || !row.pvp) {
        return 0;
      }else {
        if (enablepvw) {
          return row.c * (row?.w>0?row?.w:row?.pvp);
        } else {
          return row.c * row.pvp;
        }
      }
    },
    editable: false,
    valueFormatter: (params) => {
      return formatCurrency(params.value);
    },
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
  if (enablepvw) {
    subTotal = newRow.c * (newRow?.w>0?newRow?.w:newRow?.pvp);
  } else {
    subTotal = newRow.c * newRow.pvp;
  }
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

let total = Array.from(rows).reduce((acc,item) => Number(acc)+Number(enablepvw?(item?.w>0?item.w*item.c:item.pvp*item.c):item.pvp*item.c),0);

const handleDeleteClick = (id) => () => {
  setRows(rows.filter((row) => row.id !== id));
};

  const [value, setValue] = React.useState(null);
  console.log('ROWS',rows)
  return (
    <Card>
      <CardContent>
      <Box sx={{ height: 400, width: '100%' }}>
    <DataGrid
      //autoHeight {...rows}
      initialState={{
        columns: {
          columnVisibilityModel: {
            // Hide columns status and traderName, the other columns will remain visible
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

      </CardContent>

      <CardContent>
  <Stack spacing={2}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>Subtotal</Typography>
                  </Box>
                  <Typography>{formatCurrency(total*(1-tax))}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>Tax</Typography>
                  </Box>
                  <Typography>{formatCurrency(total*tax)}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>Descuento</Typography>
                  </Box>
                  <Typography>{formatCurrency(di)}</Typography>
                </Stack>
                <Divider />
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography level="h4">Total</Typography>
                  </Box>
                  <Typography level="h4">{formatCurrency(total-di)}</Typography>
                </Stack>
              </Stack>
              </CardContent>
    </Card>
  );
};
