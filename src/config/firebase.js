import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
/**
 * Instancia de firebase para realizar consultas, actualizacion y registro de datos
 */
const firebaseConfig = {
  apiKey: "AIzaSyCx9Duzh-q0leYe7143vsaD8UqA5B3SliA",
  authDomain: "inventory-f908b.firebaseapp.com",
  databaseURL: "https://inventory-f908b.firebaseio.com",
  projectId: "inventory-f908b",
  storageBucket: "inventory-f908b.appspot.com",
  messagingSenderId: "448314220707",
  appId: "1:448314220707:web:9d8d389aa4f875ac",
  measurementId: "G-SCTTQL30G1"
};
/**
 * Inicializa firebase si aun no ha sido instanciada, se ejecuta al inicar el app
 */
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export {firebase} ;
//export const db = firebase.database();