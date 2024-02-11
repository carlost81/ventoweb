import {firebase} from "../config/firebase"
import {
    PRODUCTS_START_LOADING,
    PRODUCTS_STOP_LOADING,
    NEW_PRODUCT_SCAN,
    NEW_PRODUCT,
    FIREBASE_FAILURE,
    GET_CATEGORIES,
    GET_PROVIDERS,
    GET_STORES,
    GET_USERS,
    GET_SALES_TODAY_DETAILS,
    NEW_STOCK,
    RELOAD,
    PAGINATION_STOCK,
  } from "../types";
import moment from 'moment';
import { useDispatch } from 'react-redux';
import {store} from '../config/store'


  

/* export function getCategories({companyId}){
  console.log('gest categoy from redux action')
    return(dispatch) => {
        //firebase.database().ref('/stores/'+companyId).on('value',snapshot => {
        firebase.database().ref('/categories/'+companyId).on('value',snapshot => {
            dispatch({type:GET_CATEGORIES,payload:snapshot.val()});
        }) ;
    }
} */
  //const dispatch = useDispatch();
console.log('Initial state (getCategories): ', store.getState())

export function getCategories ({companyId}) {
  console.log('DB.getCategories')
  firebase.database().ref('/categories/'+companyId).on('value',snapshot => {
    //console.log('cat.val',snapshot.val())
    store.dispatch({type:GET_CATEGORIES,payload:snapshot.val()});
  });
}

export function getProviders({companyId}){
  firebase.database().ref('/providers/'+companyId).on('value',snapshot => {
    store.dispatch({type:GET_PROVIDERS,payload:snapshot.val()});
  }) ;
}

export function getStores({companyId}){
  firebase.database().ref('/stores/'+companyId).on('value',snapshot => {
    store.dispatch({type:GET_STORES,payload:snapshot.val()});
  }) ;
}

export function getUsers({companyId}){
  firebase.database().ref('/users/').orderByChild('companyId').equalTo(companyId).on('value',snapshot => {
    store.dispatch({type:GET_USERS,payload:snapshot.val()});
  }) ;
}

export function getProducts ({companyId}) {
  console.log('DB.getProducts')
  store.dispatch({type:PRODUCTS_START_LOADING});
  firebase.database().ref('/products/'+companyId).orderByChild('n').on('value',snapshot => {
    console.log('xxx',snapshot.toJSON())
    store.dispatch({type:NEW_PRODUCT_SCAN,payload:{products:snapshot.val()}});
  });
};

export async function getStocksByProduct ({companyId,pId}) {
  console.log('DB.getStocksByProduct')
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
  store.dispatch({type:NEW_STOCK,payload:{pId,xc,yc}});

  /*return new Promise((resolve, reject) => {
    resolve(xc+yc);
  });*/
}

export function paginationStock ({page, rowsPerPage}) {
  store.dispatch({type:PAGINATION_STOCK,payload:{page, rowsPerPage}});
}

export async function createProduct(product,companyId){
  console.log('createProduct',product,companyId)
  return new Promise((resolve, reject) => {
    firebase.database().ref('/products/'+companyId).orderByChild('r').equalTo(product.id).once('value',snapshot => {
      if(snapshot.numChildren()==0){
        firebase.database().ref('/products/'+companyId).push({n:product.name,r:product.id,d:product.description,cId:product.category,pId:product.provider,u:String(product.cost),v:String(product.pvp),x:product.gender,z:product.size,s:product.enable})
          .then(()=> {
            store.dispatch({type:RELOAD});
            resolve(true);
          });
      }else{
        store.dispatch({type:FIREBASE_FAILURE,payload:{error:'La referencia ya existe en el sistema'}});
        resolve(false);
      }
    });
  });
}

export function getSalesTodayDetail({companyId}){
  const d = moment(new Date()).format("YYYY-MM-DD");
  firebase.database().ref('/sales-by-date/'+companyId+'/'+d).on('value',snapshot => {
    store.dispatch({type:GET_SALES_TODAY_DETAILS,payload:snapshot.val()});
  });
}



export async function createSale(summit,companyId){
  console.log('createSale1.1',summit)
  return new Promise((resolve, reject) => {

    resolve(0)
/*               firebase.database().ref('/sales/'+companyId).push({fId,d,sId,s,vId,v,cn,cd,ce,cid,di,pm,pa,pc:pm,tt,summary,productsSale,companyId})
              .then((snap) => {
                  const id = snap.key;
                  this.createSaleByDate({d,id,s,tt,ct:summary.costs,companyId});
                  if(cid!==''){
                      this.createSaleByCustomer({cid,d,id,tt,ct:summary.costs,companyId});
                  }
                  if(pm==='P'){
                      this.createSaleCredit({id,companyId,credits:[{d,pa}]});
                  }
                  resolve(snap.key);
              }).catch((error) => {
                console.log('error.getProductStock',pId,error);
                resolve(0)
              });; */
  });

}
