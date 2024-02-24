import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import React, { useCallback, useState, useEffect, useContext, useMemo } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { useSelector } from 'react-redux';
import { RouterLink } from '../../components/router-link';
import { formatCurrency } from '../../utils/money-format';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { paths } from '../../paths';
import moment from "moment";
import _ from 'lodash'
import {
  Button,
  Box,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  SvgIcon,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Scrollbar } from '../scrollbar';
import { getInitials } from '../../utils/get-initials';
import {
  ROWS_PER_PAGE,
  PAGE
} from "../../types";
import { getProducts,  getCategories, getStocksByProduct, paginationStock,getSalesByDate } from '../../actions'

const initialValues = {
  dateFrom: new Date(),
  dateTo: new Date(),
};

const validationSchema = Yup.object({
  dateFrom: Yup.date().required('debe seleccionar una fecha'),
  dateTo: Yup.date().required('debe seleccionar una fecha'),
});

export const SalesTable = (props) => {
  const {
    //companyId = '-LmL9e3qn0Tjft18B4ob'
    companyId = '1'
  } = props;


  const [page, setPage] = useState(PAGE);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);

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



  const categories = useSelector((state) => state.categories);
  const products = useSelector((state) => state.products);
  const productsSlice = useSelector((state) => state.productsSlice);
  const reload = useSelector((state) => state.reload);
  const salesByDate = useSelector((state) => state.salesByDate);

  useEffect(() => {
    if(salesByDate == null){
      getSalesByDate(companyId,'2022-02-22','2024-02-23');
    }
  }, []);

  useEffect(() => {
    paginationStock({page, rowsPerPage})
  }, [page, rowsPerPage]);

  useEffect(() => {
    //console.log('**',page,rowsPerPage,productsSlice)
    //const fetchData = async () => {
      productsSlice?.map(async(product,id) => {

        //console.log('**',product.id,product.n,product?.yc,id)
        let product_ = findProduct(product.id);
        if(product_.yc == null){
          //console.log(1,product_?.id)
          await getStocksByProduct({companyId:companyId,pId:product?.id});
          //console.log(3,product_?.id)
        }
      })
    //};
  }, [productsSlice]);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

/*   useMemo(
    () => {
      paginationStock({page, rowsPerPage})
      console.log('**',page,rowsPerPage,productsSlice)
    },
    [products,page, rowsPerPage]
  ); */
/*   const useProducts = (page, rowsPerPage) => {
    return useMemo(
      () => {
        paginationStock({page, rowsPerPage})
        console.log('**',page,rowsPerPage,productsSlice)
        const productsSlice = applyPagination(products, page, rowsPerPage)
        console.log('**',page,rowsPerPage,productsSlice)
        productsSlice?.map((product,id) => {
          getStocksByProduct({companyId:1,pId:product?.id});
        })
        return productsSlice;
      },
      [products,page, rowsPerPage]
    );
  }; */
  //const productsA = useProducts(page, rowsPerPage);
  //console.log('productsA',products,productsA)
  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  const findCategory = (id) => {
    var category = categories?.find((category) => {
      return category.id === id;
    })
    return category;
  }

  const findProduct = (id) => {
    var product = products?.find((product) => {
      return product.id === id;
    })
    return product;
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
              md={8}
              
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

    <Card>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Fecha
                </TableCell>
                <TableCell>
                  $$$
                </TableCell>
                <TableCell>
                  Modo Pago
                </TableCell>
                <TableCell>
                  Tienda
                </TableCell>
                <TableCell>
                  Vendedor
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {salesByDate?.map((sale,id) => {
                //console.log('prod1',product);
                //const isSelected = selected.includes(product.id);
                //const createdAt = format(product.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={id}
                    selected={false}
                  >
                    <TableCell>
                      {sale.d}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(sale.tt)}
                    </TableCell>
                    <TableCell>
                      {sale.pc}
                    </TableCell>
                    <TableCell>
                      {sale.s}
                    </TableCell>
                    <TableCell>
                      {sale.v}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      <TablePagination
        component="div"
        count={products?.length==null?0:products?.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 30, 50]}
      />
    </Card>
    </form>
  );
};