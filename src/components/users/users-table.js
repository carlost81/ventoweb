import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import  AuthContext from "../../context/auth/authContext";
import * as Yup from 'yup';
import React, { useCallback, useState, useEffect, useContext, useMemo } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { useSelector } from 'react-redux';
import '../../styles.css'
//import { RouterLink } from '../../components/router-link';
import moment from "moment";
import _ from 'lodash'
import {
  Button,
  Box,
  Card,
  CardHeader,
  CardContent,
  SvgIcon,
  Unstable_Grid2 as Grid,
  Stack,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid,GridActionsCellItem } from '@mui/x-data-grid';
import { getUsers, getSelectedUser } from '../../actions'
import { paths } from '../../paths';
import { formatCurrency } from '../../utils/money-format';
import { useNavigate } from 'react-router-dom';




const initialValues = {
};

const validationSchema = Yup.object({
});

export const UsersTable = (props) => {

  const navigate = useNavigate();
  const config = JSON.parse(localStorage.getItem('config'))
  const user = JSON.parse(localStorage.getItem('user'))
  const companyId = user.companyId;
  console.log('config',config)
  const users = useSelector((state) => state.users);
  const columns = [
    //{ field: 'id',  hide: true  },
    {
      field: 'displayName',
      headerName: 'NOMBRE',
      //type: 'date',
      flex:0.15,
      //valueGetter: (params) =>
      //moment(params?.value).format("DD/MM/YYYY hh:mm A"),
      //`${new Date(params.row.d)}`,
      //width: 150,
    },
    {
      field: 'email',
      headerName: 'EMAIL',
      flex:0.25,
      //type: 'number',
      //width: 150,
    },
    {
      field: 'rId',
      headerName: 'ROL',
      flex:0.15,
      valueGetter: (params) => {
        if (params.row.rId == 'v')
          return 'Vendedor'
        else if (params.row.rId == 'c')
          return 'Cajero'
        else if (params.row.rId == 'a')
            return 'Administrador'
      }
      //width: 110,
    },
    {
      field: 'creation',
      //flex:0.2,
      headerName: 'FECHA',
      flex:0.15,
      //width: 110,
    },
    {
      field: 'sId',
      headerName: 'S',
      //flex:0.2,
      //width: 110,
    },
    {
      field: 'status',
      //flex:0.2,
      headerName: 'STATUS',
      flex:0.08,
      valueGetter: (params) => {
        if (params.row.status)
          return 'Activo'
        else 
          return 'Inactivo'
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'ACCION',
      flex:0.2,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            onClick={handleEditClick(id)}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            color="inherit"
          />,
        ];
      },
    }
    
  ];

  console.log('UsersTable::',props)

  useEffect(() => {
    //if(salesByDate == null){
      console.log('sueEffect called sales-table')
      getUsers({companyId});
    //}
  }, []);



   const handleEditClick = (id) => () => {
    console.log(id)
    getSelectedUser(findUser(id));
    //getSelectedSale(findSale(id));
    console.log('editclick',findUser(id));
    navigate(paths.user)
  };

  const findUser = (id) => {
    return users?.find((user) => {
      return user.id === id;
    })
  }

  console.log('users::',users)
  return (
      <Card>

    <Box sx={{ width: '100%' }}>
      <DataGrid
        autoHeight={true}
        rows={users?users:{}}
        columns={columns}
        sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#F8F9FA',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontSize: '12px',
              fontWeight: '600',    // Asegura que bold se aplique aquí
              color: '#2F3746',
              fontFamily: 'Arial',
              lineHeight: '1',   // Ajusta el lineHeight aquí
            },
          }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          columns: {
            columnVisibilityModel: {
              sId: false,
            },
          },
        }}
        pageSizeOptions={[10,20]}
        //checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
    </Card>
  );
}