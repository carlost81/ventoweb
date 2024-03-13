import {firebase} from "../config/firebase"
import {
    PRODUCTS_START_LOADING,
    PRODUCTS_STOP_LOADING,
    NEW_PRODUCT_SCAN,
    ADD_PRODUCTS_SALE,
    UPDATE_PRODUCT_SALE,
    NEW_PRODUCT,
    FIREBASE_FAILURE,
    GET_CATEGORIES,
    GET_PROVIDERS,
    GET_STORES,
    GET_USERS,
    GET_SALES_TODAY_DETAILS,
    GET_CLIENTS,
    GET_SALES_BY_DATE,
    GET_SELECTED_SALE,
    NEW_STOCK,
    RELOAD,
    PAGINATION_STOCK,
    PAGINATION_SALES,
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
  console.log('DB.getProducts...............');
  store.dispatch({type:PRODUCTS_START_LOADING});
  firebase.database().ref('/products/'+companyId).orderByChild('n').on('value',snapshot => {
    console.log('xxx',snapshot.toJSON())
    store.dispatch({type:NEW_PRODUCT_SCAN,payload:{products:snapshot.val()}});
  });
};

export function getSalesByDate (companyId, dateFrom, dateTo) {
  console.log('DB.getSalesByDate...............',companyId, dateFrom, dateTo);
  firebase.database().ref('/sales/'+companyId).orderByChild('d').startAt(dateFrom).endAt(dateTo).on('value',snapshot => {
    console.log('getSalesByDate',snapshot,snapshot.toJSON())
    store.dispatch({type:GET_SALES_BY_DATE,payload:{sales:snapshot.val(),dateFrom,dateTo}});
  });
};

export async function getSaleByDateId (companyId, date, saleId) {
  return new Promise((resolve) => {
    firebase.database().ref('/sales-by-date/'+companyId+'/'+date).orderByChild('saleId').equalTo(saleId).on('value',snapshot => {
      if(snapshot.numChildren()==0){
        resolve(false);
      }else{
        snapshot.forEach((value) => {
          resolve(value.key)
        })
      }
    });
  });
};


export async function getSaleByCustomerId (companyId, saleId) {
  return new Promise((resolve) => {
    firebase.database().ref('/index/sales-by-customer/'+companyId+'/'+saleId).on('value',snapshot => {
      if(snapshot.numChildren()==0){
        resolve(false);
      }else{
        snapshot.forEach((value) => {
          resolve(value.val().sbcId)
        })
      }
    });
  });
};

export function getClients ({companyId}) {
  console.log('DB.getClients...............');
  //store.dispatch({type:PRODUCTS_START_LOADING});
  firebase.database().ref('/customers/'+companyId).on('value',snapshot => {
    console.log('clients:::',snapshot.toJSON())
    store.dispatch({type:GET_CLIENTS,payload:snapshot.val()});
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
export function getSelectedSale (payload) {
  store.dispatch({type:GET_SELECTED_SALE,payload});
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


export async function createSale(summit,companyId){
  console.log('createSale1.1',summit)
  let errorMsg = false;
  try {
    const saleId = await (new Promise((resolve) => {
      firebase.database().ref('/sales/'+companyId).push(summit)
        .then((snap) => resolve(snap.key))
        .catch(() => resolve(false));
    }));
    console.log('createSale1.2 saleId',saleId)
    if(saleId){
      const sbd = {d:summit.d,s:summit.s,tt:summit.tt,ct:summit.summary.costs};
      const customer = {n:summit.cn,d:summit.cd,e:summit.ce,p:summit.cp,a:summit.ca};
      const resultcsbd = await createSaleByDate(saleId,sbd,companyId);
      let cid = summit.cid;
      console.log('createSale1.3 ',cid,resultcsbd,sbd,customer)
      if(cid!=''){
        const result = await editCustomer(cid,customer,companyId);
        console.log('createSale1.4 ',cid,result)
      }else if(cid=='' && customer.d!=''){
        cid = await createCustomer(saleId,customer,companyId);
        console.log('createSale1.4- ',cid)
      }
      if(cid!=''){
        const resultcsbc = await createSaleByCustomer(cid,saleId,sbd,companyId);
        console.log('createSale1.5 ',resultcsbc)
      }
      const resultcsbp = await Promise.all(summit.productsSale.map((value) => createSaleByProduct(value,saleId,summit.sId,summit.d, companyId)));
      console.log('createSale1.6 ',resultcsbp)
      //incluir sales by credit
    }
  } catch (error) {
    console.log('error::', error.message)
    errorMsg = error.message;
  }
  return new Promise((resolve) => {
    console.log('createSale1.7 error ',errorMsg)
    resolve(errorMsg)
  });
}

export async function createSaleByDate(saleId,sbd,companyId){
  return new Promise((resolve) => {
    firebase.database().ref('/sales-by-date/'+companyId+'/'+sbd.d).push({saleId,s:sbd.s,tt:sbd.tt,ct:sbd.ct})
      .then((snap)=> resolve(snap.key))
      .catch(() => resolve(false));
  });
}

export async function createSaleByProduct(value,saleId,sId,d,companyId){
  const {c,pId} = value;
  return new Promise((resolve) => {
    firebase.database().ref('/sales-by-product/'+companyId+'/'+pId).push({saleId,sId,c,d})
      .then((snapsbp)=> {
        console.log('++',value,snapsbp.key)
        firebase.database().ref('/index/sales-by-product/'+companyId+'/'+saleId).push({sbpId:snapsbp.key,pId})
          .then(() => resolve(snapsbp.key))
          .catch(() => resolve(false))
      });
  });
}

export async function createSaleByCustomer(cid,saleId,sbd,companyId){
  return new Promise((resolve) => {
    firebase.database().ref('/sales-by-customer/'+companyId+'/'+cid).push({saleId,d:sbd.d,tt:sbd.tt,ct:sbd.ct})
      .then((snap)=> {
        const sbcId = snap.key;
        firebase.database().ref('/index/sales-by-customer/'+companyId+'/'+saleId).push({cid,sbcId})
          .then(()=> resolve(sbcId))
          .catch(() => resolve(false));
      });
  });
}

export async function createCustomer(saleId,customer,companyId){
  return new Promise((resolve) => {
    firebase.database().ref('/customers/'+companyId).push(customer)
      .then((snap)=> {
        if (saleId){
          firebase.database().ref('/sales/'+companyId+'/'+saleId).update({cid:snap.key});
        }
        resolve(snap.key)
      }).catch(() => resolve(false));
  });
}

export async function editCustomer(cid,customer,companyId)  {
  return new Promise((resolve) => {
    firebase.database().ref('/customers/'+companyId+'/'+cid).set(customer)
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
}


export async function editSaleByDate(saleId,sbd,companyId){
  return new Promise((resolve) => {
    firebase.database().ref('/sales-by-date/'+companyId+'/'+sbd.d).set({saleId,s:sbd.s,tt:sbd.tt,ct:sbd.ct})
      .then((snap)=> resolve(snap.key))
      .catch(() => resolve(false));
  });
}

export async function editSaleByCustomer(saleId,sbcId,cid,sbd,companyId){
  return new Promise((resolve) => {
      firebase.database().ref('/sales-by-customer/'+companyId+'/'+cid+'/'+sbcId).set({saleId,d:sbd.d,tt:sbd.tt,ct:sbd.ct})
      .then((snap)=> resolve(snap.key))
      .catch(() => resolve(false));
  });
}

export async function editSale(summit,originalSale,companyId){
  console.log('editSale.1',summit,originalSale)
  let errorMsg = false;
  try {
    const sbd = {d:summit.d,s:summit.s,tt:summit.tt,ct:summit.summary.costs};
    const customer = {n:summit.cn,d:summit.cd,e:summit.ce,p:summit.cp,a:summit.ca};
    let sbdId = await getSaleByDateId(companyId,originalSale.d,originalSale.id);
    let sbcId = await getSaleByCustomerId(companyId,originalSale.id);
    let cid = summit.cid;
    let saleId = originalSale.id;
    console.log('editSale.1',saleId,cid,customer,sbd,sbdId,sbcId)
    const rest = await (new Promise((resolve) => {
      firebase.database().ref('/sales/'+companyId+'/'+saleId).set(summit)
        .then(() => resolve(true))  
        .catch(() => resolve(false));
    }));
    console.log('editSale.2 rest',rest);
    if(summit.d==originalSale.d){
      const resultcsbd = await editSaleByDate(saleId,sbd,companyId);
      console.log('editSale.3a resultcsbd',resultcsbd);
    }else{
      const resultdsbd = await deleteSaleByDate(sbdId,originalSale.d,companyId);
      const resultcsbd = await createSaleByDate(saleId,sbd,companyId);
      console.log('editSale.3b resultdsbd',resultdsbd,resultcsbd);
    }
    /*if(cid!=''){
      const result = await editCustomer(cid,customer,companyId);
      console.log('editSale.4a ',cid,result)
    }else if(cid=='' && customer.d!=''){
      cid = await createCustomer(saleId,customer,companyId);
      console.log('editSale.4b ',cid)
    }
    if(cid == originalSale.cid){
      if(sbcId!==''){
        const resultesbc = await editSaleByCustomer(saleId,sbcId,summit.cid,sbd,companyId);
        console.log('editSale.5a ',resultesbc)
      }
    }else{
      const resultdsbc = await deleteSaleByCustomer(saleId,companyId);
      console.log('editSale.6a ',resultdsbc)
      if(cid!=''){
        const resultcsbc = await createSaleByCustomer(cid,saleId,sbd,companyId);
        console.log('editSale.6b ',resultcsbc)
      }
    }
    //incluir sales by credit
    if((JSON.stringify(summit.productsSale) != JSON.stringify(originalSale.productsSale)) || (summit.sId != originalSale.sId)){
      console.log('editSale.7a ')
      await deleteSaleByProduct(saleId,companyId)
      const resultcsbp = await Promise.all(summit.productsSale.map((value) => createSaleByProduct(value,saleId,summit.sId,summit.d, companyId)));
      console.log('createSale1.6 ',resultcsbp)
    }*/
  } catch (error) {
    console.log('error::', error.message)
    errorMsg = error.message;
  }
  return new Promise((resolve) => {
    console.log('createSale1.7 error ',errorMsg)
    resolve(errorMsg)
  });
}

export function getSalesTodayDetail({companyId}){
  const d = moment(new Date()).format("YYYY-MM-DD");
  firebase.database().ref('/sales-by-date/'+companyId+'/'+d).on('value',snapshot => {
    store.dispatch({type:GET_SALES_TODAY_DETAILS,payload:snapshot.val()});
  });
}

export function addProductSale(products){
  console.log('dispatch products', products)
  store.dispatch({type:ADD_PRODUCTS_SALE,payload:{products}});
}

export async function deleteSaleByDate(sbdId,date,companyId) {
  return new Promise((resolve) => {
    firebase.database().ref('/sales-by-date/'+companyId+'/'+date+'/'+sbdId).remove()
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
}

export async function deleteSaleByCustomer(saleId,companyId) {
  let errorMsg = false;
  try {
    firebase.database().ref('/index/sales-by-customer/'+companyId+'/'+saleId).once('value',snapshot => {
      snapshot.forEach((value) => {
        const cid = value.val().cid;
        const sbcId = value.val().sbcId;
        const a = (new Promise((resolve) => {
          firebase.database().ref('/sales-by-customer/'+companyId+'/'+cid+'/'+sbcId).remove()
            .then(() => resolve(true))
            .catch(() => resolve(false))
        }));
        const b = (new Promise((resolve) => {
          firebase.database().ref('/index/sales-by-customer/'+companyId+'/'+saleId).remove()
            .then(() => resolve(true))
            .catch(() => resolve(false))
        }));
      });
    })
  } catch (error) {
    console.log('error::', error.message)
    errorMsg = error.message;
  }
  return new Promise((resolve) => {
    resolve(errorMsg)
  });
}

export async function deleteSaleByProduct(saleId,companyId) {
  let errorMsg = false;
  try {
    firebase.database().ref('/index/sales-by-product/'+companyId+'/'+saleId).once('value',snapshot => {  
      snapshot.forEach((value) => {
        const pId = value.val().pId;
        const sbpId = value.val().sbpId;
        const a = (new Promise((resolve) => {
          firebase.database().ref('/sales-by-product/'+companyId+'/'+pId+'/'+sbpId).remove()
            .then(() => resolve(true))
            .catch(() => resolve(false))
        }));
      });
      const b = (new Promise((resolve) => {
        firebase.database().ref('/index/sales-by-product/'+companyId+'/'+saleId).remove()
          .then(() => resolve(true))
          .catch(() => resolve(false))
      }));
    })
  } catch (error) {
    console.log('error::', error.message)
    errorMsg = error.message;
  }
  return new Promise((resolve) => {
    resolve(errorMsg)
  });
}
