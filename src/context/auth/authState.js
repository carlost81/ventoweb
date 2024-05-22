import React, { useReducer } from "react";
import {
  LOG_IN,
  LOG_IN_ERROR,
  SIGN_UP,
  SIGN_UP_ERROR,
  SIGN_OUT,
  SIGN_OUT_ERROR,
  UPDATED_USER,
  UPDATED_PASS,
  USER_PASSWORD_RECOVERY,
  UPDATED_USER_INPUT_CHANGE,
  UPDATED_PASS_INPUT_CHANGE,
  INITIAL_STATE,
  GET_CONFIG,
  GET_COMPANY,
  GET_USER,
  //DEFAULT_CONFIG
} from "../../types";
import AuthReducer from "./authReducer";
import AuthContext from "./authContext";
import {firebase} from "../../config/firebase"
//import database from "@react-native-firebase/database";
//import auth from "@react-native-firebase/auth";
import moment from "moment";
/**
 * Maneja las operacion de signIn, signOut, signUp, registro y consulta de usuarios contra firebase authentication y firebase real-time
 */
const AuthState = (props) => {
  const initialState = {
    auth: null,
    user: null,
    message: null,
    pass: null,
    config: null,
    company: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);
  /**
   * metodo que hace la autenticacion mediante email contra firebase
   * @param {Object} data datos del login de usuario
   * @param {String} data.email - email del usuario
   * @param {String} data.password - password del usuario
   * @return {Promise} devuelve una promesa al terminar la operacion, se utiliza para controlar un llamado sincrono
   */
  const signIn = async (data) => {
    console.log('signIn',data)
    return new Promise((resolve, reject) => {
      firebase.auth()
        .signInWithEmailAndPassword(data.email, data.password)
        .then((response) => {
          var user = { ...data, uid: response.user.uid };
          console.log('user',user )
          dispatch({
            type: LOG_IN,
            payload: user,
          });
          resolve(response.user.uid);
        })
        .catch((error) => {
          dispatch({
            type: LOG_IN_ERROR,
            payload: error,
          });
          resolve(false);
        });
    });
  };
  /**
   * metodo que hace la autenticacion anonima contra firebase
   * @param {Object} data datos del login de usuario
   * @param {String} data.email - email del usuario
   * @param {String} data.password - password del usuario
   * @return {Promise} devuelve una promesa al terminar la operacion, se utiliza para controlar un llamado sincrono
   */
/*   const signInAnonymously = async () => {
    return new Promise((resolve, reject) => {
      firebase.auth()
        .signInAnonymously()
        .then((response) => {
          var user = { email: "", uid: response.user.uid };
          dispatch({
            type: LOG_IN,
            payload: user,
          });
          resolve(response.user.uid);
        })
        .catch((error) => {
          dispatch({
            type: LOG_IN_ERROR,
            payload: error,
          });
          resolve(false);
        });
    });
  }; */
  /**
   * metodo que valida si el usuario tiene una sesion activa y no le pide loggin
   * @return {Promise} devuelve una promesa al terminar la operacion, se utiliza para controlar un llamado sincrono
   */
  const isSignIn = async () => {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((response) => {
        if (response) {
          var user = { email: response.email, uid: response.uid };
          dispatch({
            type: LOG_IN,
            payload: user,
          });
          resolve(response.uid);
        } else resolve(false);
      });
    });
  };
  /**
   * metodo que hace el registro contra firebase
   * @param {Object} data datos del login de usuario
   * @param {String} data.email - email del usuario
   * @param {String} data.name - nombre del usuario
   * @param {String} data.password - password del usuario
   * @param {String} data.phone - celular del usuario
   * @param {Object} config config por default
   * @return {Promise} devuelve una promesa al terminar la operacion, se utiliza para controlar un llamado sincrono
   */
  const signUp = async(data,config) => {
    let company = {
      company:data.company,
      creation:moment().format('DD/MM/YY'),
      duty:config.duty,
      endDate:moment().add(config.testDays,'days').format('DD/MM/YY'),
      nit:'',
      phone:data.phone,
      tax:config.tax,
      url:'',
      timestamp:moment().format('DD/MM/YY, HH:mm:ss')
    };
    let companyId = null;
    let user = null;
    let userCreated = null;
    var message;

    console.log('signUp',data,config,company)
    const uid = await (new Promise((resolve) => {
      firebase.auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then((response) => {
          /*var user = { ...data, uid: response.user.uid };
          dispatch({
            type: SIGN_UP,
            payload: { response, user },
          });*/
          resolve(response.user.uid);
        })
        .catch((error) => {
          console.log('error', error.code,error)
          switch(error.code) {
            case 'auth/weak-password':
              message = 'Password invalido';
              break;
            case 'auth/email-already-in-use':
              message = 'El email ya se encuentrá registrado';
              break;
            default:
              message = ''+error;
              break;
          }
          dispatch({
            type: SIGN_UP_ERROR,
            payload: message,
          });
          resolve(false);
        });
    }));
    console.log('uid',uid,company)
    if (uid) {
      companyId = await createCompany(company);
      company = { ...company,companyId}
      console.log('createCompany',companyId,company)
      dispatch({
        type: GET_COMPANY,
        payload: company,
      });
      if(companyId){
        user = {
          companyId,
          creation:moment().format('DD/MM/YY'),
          creator: true,
          displayName: data.name,
          email: data.email,
          password: data.password,
          rId: 'a',
          sId:'',
          status:true,
          uid
        }
        userCreated = await createUser(user);
        console.log('createUser',userCreated,user)
        if (userCreated)
          dispatch({
            type: GET_USER,
            payload: user,
          });
      }
    }

    console.log('Promise1',userCreated)
    return new Promise((resolve) => {
      console.log('Promise2',userCreated)
      if (userCreated) resolve({success:true,message:null,user,company}) 
      else resolve ({success:false,message})
    })
  };
  /**
   * metodo que crea un company en firebase
   * @param {Object} company - company
   */
  const  createCompany = (company) => {
    return new Promise((resolve) => {
      firebase.database().ref('/companies/').push(company)
        .then((snap)=> resolve(snap.key))
        .catch((error) => {
          dispatch({
            type: SIGN_UP_ERROR,
            payload: error,
          });
          resolve(false);
        });
    });
  }
  /**
   * metodo que crea un usuario en firebase
   * @param {Object} user - user
   */
  const  createUser= (user) => {
    return new Promise((resolve) => {
      firebase.database().ref('/users/').push(user)
        .then((snap)=> resolve(snap.key))
        .catch((error) => {
          dispatch({
            type: SIGN_UP_ERROR,
            payload: error,
          });
          resolve(false);
        });
    });
  }
  /**
   * metodo que actualiza el password en firebase
   * @param {String} currentPass - password anterior
   * @param {String} newPass - nuevo password
   */
  const updatePassword = async (pass) => {
    return new Promise((resolve, reject) => {
      const emailCred  = firebase.auth().EmailAuthProvider.credential(
        firebase.auth().currentUser.email, pass.currentPass);
        firebase.auth().currentUser.reauthenticateWithCredential(emailCred)
        .then(() => {
          firebase.auth().currentUser.updatePassword(pass.newPass).then((response) =>{
            resolve({value:true});
          })
          .catch((error) => {
            resolve({value:false,message:'la nueva contraseña no es valida'});
          });
        })
        .catch((error) => {
          resolve({value:false,message:'la contraseña actual no es valida'});
        });
    });
  };
  /**
   * metodo que actualiza la informacion del usuario contra la base de datos realtime.firebase
   * @param {Object} data datos del usuario
   * @param {String} data.email - email del usuario
   * @param {String} data.birdDate - fecha de nacimiento del usuario
   * @param {String} data.gender - genero del usuario
   * @param {String} data.oldMen - si es un menor indica si esta acompañado por un adulto
   */
  const updateUser = (data) => {
    firebase.database()
      .ref("/users/" + data.uid)
      .update({
        email: data.email,
        birdDate: data.birdDate,
        gender: data.gender,
        oldMen: data.oldMen,
        aceptaTyC: true,
        timestamp: moment().format('DD/MM/YY, HH:mm:ss')
      })
      .then(() => {
        dispatch({
          type: UPDATED_USER,
          payload: data,
        });
      })
      .catch((error) => {
        alert(error);
      });
  };
  /**
   * metodo que actualiza un campo del usuario
   * @param {String} field - identificador del campo
   * @param {String} value - valor del campo
   */
  const updateUserInputChange = ({ field, value }) => {
    dispatch({
      type: UPDATED_USER_INPUT_CHANGE,
      payload: { field, value },
    });
  };
  /**
   * metodo que actualiza el password cuando el usuario quiere cambiarlo
   * @param {String} field - identificador del campo
   * @param {String} value - valor del campo
   */
  const updatePassInputChange = ({ field, value }) => {
    dispatch({
      type: UPDATED_PASS_INPUT_CHANGE,
      payload: { field, value },
    });
  };
  /**
   * metodo que consulta la informacion del usuario contra la base de datos realtime.firebase
   * @param {String} uid - identificador unico del usuario
   */
  const getUser = (uid) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/users')
        .orderByChild('uid').equalTo(uid)
        .once('value', (snapshot) => {
          snapshot.forEach((value) => {
            console.log('getUser',uid,value.val())
            dispatch({
              type: UPDATED_USER,
              payload: value.val(),
            });
            resolve(value.val())
          })
        })
        .catch((error) => {
          alert(error);
          resolve(false);
        });
    });
  };
  /**
   * metodo que consulta la informacion del usuario contra la base de datos realtime.firebase
   * @param {String} companyId - identificador unico de la empresa
   */
  const getCompany = (companyId) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/companies'+'/'+companyId)
        .once('value', (snapshot) => {
          snapshot.forEach((value) => {
            dispatch({
              type: GET_COMPANY,
              payload: value.val(),
            });
            resolve(value.val())
          })
        })
        .catch((error) => {
          alert(error);
          resolve(false);
        });
    });
  };
  /**
   * metodo que consulta los parametros de configuracion contra la base de datos realtime.firebase
   */
  const getConfig = () => {
    return new Promise((resolve, reject) => {
      console.log(1)
      firebase.database().ref("/app-config/")
        .once("value", (snapshot) => {
          console.log('snapshot',snapshot)
          if (snapshot.hasChildren())
          dispatch({
            type: GET_CONFIG,
            payload: snapshot.val(),
          });
          resolve(snapshot.val());
        })
        .catch((error) => {
          console.log(error)
          alert(error);
          resolve(false);
        });
    });
  };
  /**
   * metodo que hace signOut contra firebase
   */
  const signOut = () => {
    firebase.auth()
      .signOut()
      .then(() => {
        dispatch({
          type: SIGN_OUT,
        });
      })
      .catch((error) => {
        dispatch({
          type: SIGN_OUT_ERROR,
          payload: error,
        });
      });
  };
  /**
   * metodo que restablece el password de una cuenta
   * @param {String} email - email del usuario
   */
  const passwordEmailRecovery = (email) => {
    firebase.auth()
      .sendPasswordResetEmail(email)
      .then(()=>  {
        dispatch({
          type: USER_PASSWORD_RECOVERY
        });
        alert('Se envio un correo a '+email+' para reestablecer la contraseña');
      }).catch((error) => {
          switch(error.code) {
            case 'auth/user-not-found':        
              alert('La cuenta '+email+' no se encuentra registrada');
              break;
          }
      });
  }
  /**
   * metodo que restablece los valores iniciales
   * @param {String} email - email del usuario
   */
  const getAuthInitialState = () => {
    dispatch({
      type: INITIAL_STATE
    });
  }

  return (
    <AuthContext.Provider
      value={{
        auth: state.auth,
        user: state.user,
        message: state.message,
        registre: state.registre,
        config: state.config,
        pass: state.pass,
        company: state.company,
        signIn,
        isSignIn,
        signUp,
        signOut,
        updateUser,
        getUser,
        updateUserInputChange,
        updatePassInputChange,
        passwordEmailRecovery,
        updatePassword,
        getAuthInitialState,
        getConfig,
        getCompany,
        createCompany
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
