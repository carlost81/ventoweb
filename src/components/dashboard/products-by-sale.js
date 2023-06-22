import {
    Box,
    Card,
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
  import { DataGrid, useGridApiRef, GridActionsCellItem} from '@mui/x-data-grid';

import { formatCurrency } from '../../utils/money-format';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getSalesTodayDetail, getProducts } from '../../actions'




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

export const ProductsBySale = (props) => {

  const { cost, profit, sales,companyId = '1' } = props;
  
  const products = useSelector((state) => state.products);

  useEffect(() => {

    if(products == null){
      console.log('products is null');
      getProducts({companyId:companyId});
    }
  }, []);

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 0.8,
      editable: true,
      renderCell: (params) => {
        return <div>{params.row.lastName}</div>;
      },
      renderEditCell: (params) => {
        console.log('params.row.lastName',params.row.lastName)
        return (
          <Autocomplete
            disablePortal
            options={products}
  
            onChange={(event, newValue) => {
              const rows = apiRef.current.getSelectedRows();
              const firstRow = Array.from(rows)[0];
              console.log('cc',newValue,firstRow[0]);
              apiRef.current.updateRows([{ id: firstRow[0], lastName: newValue.n, firstName: 'Ema', age: 0 }]);
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
/*    {
       field: "typea",
      headerName: "Type auto",
      width: 150,
      editable: true,
      renderCell: (params) => {
        return <div>{params.row.fullName}</div>;
      },
      renderEditCell: (params) => {
        const valueOptions = ["Income", "Expense"];
  
        return (
          <Autocomplete
            disablePortal
            options={valueOptions}
            value={params.row.fullName}
            onChange={(_, value) => {
              console.log('x',params.row.fullName,' y:',value)
              if (params.row.fullName !== value) {
                params.row.fullName = value;
              }
            }}
            sx={{ width: params.colDef.width }}
            renderInput={(params) => <TextField {...params} />}
          />
        );
      }
    }, 
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
    }, */
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      flex: 0.2,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<Cancel />}
            label="Delete"
            onClick={() => {
              apiRef.current.updateRows([{ id: id, _action: "delete" }]);
            }}
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

  const rows = [
    { id: 1, lastName: "The Shawshank Redemption", firstName: 'Jon', age: 35 },
    { id: 2, lastName: "Cersei", firstName: "Juan", age: 42 },
    { id: 3, lastName: "", firstName: 'Ema', age: 0 },
  ];
  const apiRef = useGridApiRef();
  let idCounter = rows?.length != null ? rows.length:0;

  const handleAddRow = () => {
    idCounter += 1;
    apiRef.current.updateRows([{ id: idCounter, lastName: "", firstName: '', age: 0 }]);
  };

  
  
    const [value, setValue] = React.useState(null);

    return (
      <Card>
        <CardContent>
        <Box sx={{ height: 400, width: '100%' }}>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={null}>
            Update a row
          </Button>
          <Button size="small" onClick={null}>
            Update all rows
          </Button>
          <Button size="small" onClick={null}>
            Delete a row
          </Button>
          <Button size="small" onClick={handleAddRow}>
            Add a row
          </Button>
      </Stack>
      <DataGrid
        //autoHeight {...rows}
        apiRef={apiRef} 
        rows={rows}
        columns={columns}
      />
    </Box>
        </CardContent>
      </Card>
    );
  };
  