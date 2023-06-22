import PropTypes from 'prop-types';
//import  DataContext from "../../context/ventoData/dataContext";
import { format } from 'date-fns';
import React, { useCallback, useState, useEffect, useContext, useMemo } from 'react';
import { applyPagination } from '../../utils/apply-pagination';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/money-format';
import _ from 'lodash'
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from '../scrollbar';
import { getInitials } from '../../utils/get-initials';
import {
  ROWS_PER_PAGE,
  PAGE
} from "../../types";
import { getProducts,  getCategories, getStocksByProduct, paginationStock } from '../../actions'


export const ProductsTable = (props) => {
  const {
    count = 0,
    //companyId = '-LmL9e3qn0Tjft18B4ob'
    companyId = '1'
  } = props;


  const [page, setPage] = useState(PAGE);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);

/*   const {  
    getProducts,
    getStocksByProduct,
    paginationStock,
    categories,
    products,
    productsSlice
  } = useContext(DataContext); */


  const categories = useSelector((state) => state.categories);
  const products = useSelector((state) => state.products);
  const productsSlice = useSelector((state) => state.productsSlice);
  const reload = useSelector((state) => state.reload);
  console.log('reload',reload)
  useEffect(() => {
    console.log('reload1',reload)
    if(products == null || reload ){
      getProducts({companyId:companyId});
    }
    if(categories == null){
      getCategories({companyId:companyId});
    }
    //getCategories({companyId:companyId});
    console.log('++++++',products,categories,page,rowsPerPage)
    //paginationStock({page, rowsPerPage})
    //getProducts({companyId:1});
    //getCategories({companyId:1});
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



  console.log('products-table re-render')

  return (
    <Card>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Producto
                </TableCell>
                <TableCell>
                  Categoria
                </TableCell>
                <TableCell>
                  Referencia
                </TableCell>
                <TableCell>
                  Precio Venta
                </TableCell>
                <TableCell>
                  Unidades Disponible
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {productsSlice?.map((product,id) => {
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
                      {product.n}
                    </TableCell>
                    <TableCell>
                      {findCategory(product?.cId)?.name}
                    </TableCell>
                    <TableCell>
                      {product.r}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(product?.v)}
                    </TableCell>
                    <TableCell>
                      {
                        findProduct(product?.id).xc - findProduct(product?.id).yc
                      }
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
  );
};