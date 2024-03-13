import {
    PRODUCTS_START_LOADING,
    PRODUCTS_STOP_LOADING,
    NEW_PRODUCT_SCAN,
    ADD_PRODUCTS_SALE,
    GET_CATEGORIES,
    GET_PROVIDERS,
    GET_STORES,
    GET_USERS,
    GET_SALES_TODAY_DETAILS,
    GET_CLIENTS,
    GET_SALES_BY_DATE,
    GET_SELECTED_SALE,
    NEW_STOCK,
    PAGINATION_STOCK,
    ROWS_PER_PAGE,
    FIREBASE_FAILURE,
    RELOAD,
    PAGE
  } from "../types";
import _ from 'lodash';

const initialState = {
  products: null,
  productsSlice: null,
  productsDataSource: null,
  productsSearch: '',
  productsLoading: false,
  productsSale: null,
  categories: null,
  providers: null,
  stores: null,
  users: null,
  clients: null,
  messageError: null,
  reload: false,
  salesToday: null,
  salesTodayTotalSale: 0,
  salesTodayTotalCost: 0,
  salesByDate: null,
  dateFrom: null,
  dateTo: null,
  selectedSale: null,
};
  
  /**
   * reducer para la autenticacion, recibe el estado inicial y la accion
   * @param {Object} state estado inicial
   * @param {Object} state.auth - objeto que contiene informacion de autenticacion, uid (numero unico de sesion)
   * @param {Object} state.message - mensaje de error en la autenticacion
   * @param {Object} state.user - objeto que contiene informacion del usuario, email, sexo, etc
   * @param {Object} action objeto plano (POJO — Plan Old JavaScript Object) que representa una intención de modificar el estado
   * @param {String} action.type tipo de accion
   * @param {Object} action.payload payload con los datos del state
   */
  export default (state=initialState, action) => {
    console.log('dataReducer:::',action)
    console.log('state:',state)
    switch (action.type) {
      case PRODUCTS_START_LOADING:
        return {
          ...state, 
          productsLoading: true
        };

      case PRODUCTS_STOP_LOADING:
        return {
          ...state, 
          productsLoading: false
        };

      case NEW_PRODUCT_SCAN:
        let sortData = _.map(action.payload.products,(val,id) => {
          val['id'] = id;
          return val;
        }).sort(function(a, b){
          var nameA=a.n.toLowerCase(), nameB=b.n.toLowerCase();
          if(nameA < nameB) { return -1; }
          if(nameA > nameB) { return 1; }
          return 0;
        });
        return {
          ...state,
          productsDataSource:sortData,
          productsSlice:sortData?.slice(PAGE * ROWS_PER_PAGE, PAGE * ROWS_PER_PAGE + ROWS_PER_PAGE),
          products:sortData,
          productsSearch:'',
          productsLoading: false,
          reload: false
        };


      case ADD_PRODUCTS_SALE:        
        return {
          ...state,
          productsSale: action.payload
        };
      case GET_CATEGORIES:
        return {
          ...state, 
          categories: _.map(action.payload,(val,id) => {
            val['id'] = id;
            return val;
          })
        };
      case GET_PROVIDERS:
        return {
          ...state, 
          providers: _.map(action.payload,(val,id) => {
            val['id'] = id;
            return val;
          })
        };
      case GET_STORES:
        return {
          ...state, 
          stores: _.map(action.payload,(val,id) => {
            val['id'] = id;
            return val;
          })
        };

      case GET_USERS:
        return {
          ...state, 
          users: _.map(action.payload,(val,id) => {
            val['id'] = id;
            return val;
          })
        };

      case GET_CLIENTS:
        return {
          ...state, 
          clients: _.map(action.payload,(val,id) => {
            val['id'] = id;
            return val;
          }).filter(item => item.d !='')
        };

      case GET_SALES_BY_DATE:
        let sales = _.map(action.payload.sales,(val,id) => {
          val['id'] = id;
          return val;
        });
        return {
          ...state,
          dateFrom:action.payload.dateFrom,
          dateTo:action.payload.dateTo,
          salesByDate: sales,
        };

      case GET_SALES_TODAY_DETAILS:
        let totalSale = 0;
        let totalCost = 0;
        return {
          ...state, 
          salesToday: _.map(action.payload,(val,id) => {
            val['id'] = id;    val['id'] = id;
            totalSale += val.tt;
            totalCost += val.ct;
            return val;
          }),
          salesTodayTotalSale: totalSale,
          salesTodayTotalCost: totalCost
        };
      case GET_SELECTED_SALE:        
        return {
          ...state,
          selectedSale: action.payload
        };
      case NEW_STOCK:
        let indexDS = state.productsDataSource.findIndex(product => product.id === action.payload.pId);
        let indexST = state.products.findIndex(product => product.id === action.payload.pId);
        //let indexSL = state.productsSlice.findIndex(product => product.id === action.payload.pId);
        return {
          ...state,
          reload: false,
          productsDataSource: state.productsDataSource?.map(
            (product,i) => i === indexDS ? {...product,xc:action.payload.xc,yc:action.payload.yc}:product
          ),
          products: state.products?.map(
            (product,i) => i === indexST ? {...product,xc:action.payload.xc,yc:action.payload.yc}:product
          )/*,
          productsSlice: state.productsSlice?.map(
            (product,i) => i === indexSL ? {...product,xc:action.payload.xc,yc:action.payload.yc}:product
          ) */
        };

      case PAGINATION_STOCK:
        return {
          ...state,
          reload: false,
          productsSlice: state.products?.slice(action.payload.page * action.payload.rowsPerPage, action.payload.page * action.payload.rowsPerPage + action.payload.rowsPerPage)
        };

      case RELOAD:
        return {
          ...state,
          reload: true
        };    
        
      case FIREBASE_FAILURE:
        return {
          ...state,
        messageError: action.payload.error
        };

      default:
        return state;
    }
  }