import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import React, { useCallback, useState, useEffect, useContext, useMemo } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { useSelector } from 'react-redux';
import { RouterLink } from '../../components/router-link';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";
import _ from 'lodash'
import {
  Button,
  Box,
  CardHeader,
  CardContent,
  SvgIcon,
  Unstable_Grid2 as Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid,GridActionsCellItem } from '@mui/x-data-grid';
import { getSalesByDate, getSelectedSale } from '../../actions'
import { paths } from '../../paths';




const initialValues = {
  dateFrom: new Date(),
  dateTo: new Date(),
};

const validationSchema = Yup.object({
  dateFrom: Yup.date().required('debe seleccionar una fecha'),
  dateTo: Yup.date().required('debe seleccionar una fecha'),
});

export const SalesTable = (props) => {

  const salesByDate = useSelector((state) => state.salesByDate);
  const columns = [
    //{ field: 'id',  hide: true  },
    {
      field: 'd',
      headerName: 'Fecha',
      //type: 'date',
      flex:0.14,
      //valueGetter: (params) =>
      //moment(params?.value).format("DD/MM/YYYY hh:mm A"),
      //`${new Date(params.row.d)}`,
      //width: 150,
    },
    {
      field: 'tt',
      headerName: '$$$',
      flex:0.17,
      type: 'number',
      //width: 150,
    },
    {
      field: 'pc',
      headerName: 'Modo Pago',
      flex:0.12,
      //width: 110,
    },
    {
      field: 's',
      headerName: 'Tienda',
      flex:0.2,
      //width: 110,
    },
    {
      field: 'v',
      flex:0.2,
      headerName: 'Vendedor',
      //width: 110,
    },
    {
      field: 'c',
      flex:0.2,
      headerName: 'Cliente',
      //width: 110,
      valueGetter: (params) =>
      `${params.row.cn || ''} | ${params.row.cd || ''}`,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex:0.1,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            onClick={handleEditClick(id)}
            component={RouterLink} 
            href={paths.sale}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            //onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    }
    
  ];

  console.log('SalesTable',props)
  const {
    companyId = '1'
  } = props;

  const formik = useFormik({
    enableReinitialize:true,
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        const dateFrom=moment(new Date(formik.values.dateFrom)).format("YYYY-MM-DD");
        const dateTo=moment(new Date(formik.values.dateTo)).format("YYYY-MM-DD");
        getSalesByDate(companyId,dateFrom,dateTo);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });
  useEffect(() => {
    //if(salesByDate == null){
      console.log('sueEffect called sales-table')
      const dateFrom=moment(new Date(formik.values.dateFrom)).format("YYYY-MM-DD");
      const dateTo=moment(new Date(formik.values.dateTo)).format("YYYY-MM-DD");
      getSalesByDate(companyId,dateFrom,dateTo);
    //}
  }, []);

  const handleEditClick = (id) => () => {
    getSelectedSale(findSale(id));
    console.log('editclick',findSale(id));
  };

  const findSale = (id) => {
    return salesByDate?.find((sale) => {
      return sale.id === id;
    })
  }

  return (
    <form
      onSubmit={formik.handleSubmit}>
        <CardHeader title="Informacion General" />
        <CardContent sx={{ pt: 0 }}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs
            >
              <DatePicker
                format="yyyy-MM-dd"
                label="desde"
                name="dateFrom"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  console.log(moment(new Date(value)).format("YYYY-MM-DD"), moment(value,'YYYY-MM-DD').toDate().toLocaleDateString());
                  formik.setFieldValue("dateFrom", value !== null ? value : initialValues.dateFrom);
                }}
                error={!!(formik.touched.dateFrom && formik.errors.dateFrom)}
                helperText={formik.touched.dateFrom && formik.errors.dateFrom}
                value={formik.values.dateFrom}
              />
            </Grid>
            <Grid
              item
              xs
            >
              <DatePicker
                format="yyyy-MM-dd"
                label="hasta"
                name="dateTo"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  console.log(moment(new Date(value)).format("YYYY-MM-DD"), moment(value,'YYYY-MM-DD').toDate().toLocaleDateString());
                  formik.setFieldValue("dateFrom", value !== null ? value : initialValues.dateTo);
                }}
                error={!!(formik.touched.dateTo && formik.errors.dateTo)}
                helperText={formik.touched.dateTo && formik.errors.dateTo}
                value={formik.values.dateTo}
              />
            </Grid>
            <Grid
              item
              xs
              md={6}
              
            >
              <Box marginTop={0.5} >
              <Button
                color='info'
                type="submit"
                startIcon={(
                  <SvgIcon fontSize="small" >
                    <MagnifyingGlassIcon />
                  </SvgIcon>
                )}
                variant="contained"
              >Buscar
              </Button>
              </Box>
            </Grid>

            
          </Grid>
          </CardContent>
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        autoHeight={true}
        rows={salesByDate?salesByDate:{}}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10,20]}
        //checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
    </form>
  );
}