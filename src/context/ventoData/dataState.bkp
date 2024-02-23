import React, { useReducer } from "react";
import {
  PRODUCTS_START_LOADING,
  PRODUCTS_STOP_LOADING,
  NEW_PRODUCT_SCAN,
  GET_CATEGORIES,
  NEW_STOCK,
  PAGINATION_STOCK
} from "../../types";
import moment from 'moment';
import DataReducer from "./dataReducer";
import DataContext from "./dataContext";
import {firebase} from "../../config/firebase"
import _ from 'lodash';
import { store } from '../../config/store'

const DataState = (props) => {
  const initialState = {
    products: null,
    productsSlice: null,
    productsDataSource: null,
    productsSearch: '',
    productsLoading: false,
    categories: null,
    messageError: null,
  };

  const [state, dispatch] = useReducer(DataReducer, initialState);

  const getProducts = ({companyId}) => {
    console.log('getProducts.')
    dispatch({type:PRODUCTS_START_LOADING});
    firebase.database().ref('/products/'+companyId).orderByChild('n').on('value',snapshot => {
      dispatch({type:NEW_PRODUCT_SCAN,payload:{products:snapshot.val()}});
    });
  };

  const getCategories = ({companyId}) => {

    console.log('gest categoy from context action')
    firebase.database().ref('/categories/'+companyId).on('value',snapshot => {
      //console.log('cat.val',snapshot.val())
      store.dispatch({type:GET_CATEGORIES,payload:snapshot.val()});
    });
  }

  const getStocksByProduct = async ({companyId,pId}) => {
    const xc = await (new Promise((resolve) => {
      firebase.database().ref('/entries/'+companyId+'/'+pId).once('value',snapshot => {
          let totalEntry = 0;
          snapshot.forEach((entry) => {
            totalEntry += parseInt(entry.val().c,10);
          });
          //console.log('x',pId,totalEntry,snapshot.val())
          resolve(totalEntry)
      }).catch((error) => {
        console.log('error.getProductStock',pId,error);
        resolve(0)
      });
    }));
    const yc = await (new Promise((resolve) => {
      firebase.database().ref('/sales-by-product/'+companyId+'/'+pId).once('value',snapshot => {
        //console.log('y',snapshot.val())
          let totalSale = 0;
          snapshot.forEach((sale) => {
            totalSale += parseInt(sale.val().c,10);
          });
          //console.log('y',pId,totalSale,snapshot.val())
          resolve(totalSale)
      }).catch((error) => {
        console.log('error.getProductStock',pId,error);
        resolve(0)
      });;
    }));
    console.log('getStocksByProduct',pId,xc,yc)
    dispatch({type:NEW_STOCK,payload:{pId,xc,yc}});

    /*return new Promise((resolve, reject) => {
      resolve(xc+yc);
    });*/
  }

  const paginationStock =  ({page, rowsPerPage}) => {
    dispatch({type:PAGINATION_STOCK,payload:{page, rowsPerPage}});
  }

  return (
    <DataContext.Provider
      value={{
        products: state.products,
        productsSlice: state.productsSlice,
        productsDataSource: state.productsDataSource,
        productsSearch: state.productsSearch,
        productsLoading: state.productsLoading,
        categories: state.categories,
        messageError: state.messageError,
        getProducts,
        getCategories,
        getStocksByProduct,
        paginationStock
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export default DataState;