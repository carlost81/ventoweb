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
  GET_CONFIG,
} from "../../types";

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
export default (state, action) => {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        auth: true,
        message: null,
        user: action.payload,
        pass: null,
      };
    case LOG_IN_ERROR:
      return {
        ...state,
        auth: null,
        user: null,
        message: action.payload,
        pass: null,
      };
    case SIGN_UP:
      return {
        ...state,
        auth: true,
        user: action.payload.user,
        message: action.payload.response,
        pass: null,
      };
    case SIGN_UP_ERROR:
      return {
        ...state,
        auth: null,
        user: null,
        message: action.payload,
        pass: null,
      };
    case UPDATED_USER:
      return {
        ...state,
        auth: true,
        user: {
          ...state.user,
          birdDate: action.payload ? action.payload.birdDate : "",
          gender: action.payload ? action.payload.gender : "O",
          oldMen: action.payload ? action.payload.oldMen : "",
        },
        pass: null,
      };
    case UPDATED_USER_INPUT_CHANGE:
      return {
        ...state,
        auth: true,
        user: { ...state.user, [action.payload.field]: action.payload.value },
      };
    case UPDATED_PASS_INPUT_CHANGE:
      return {
        ...state,
        auth: true,
        pass: { ...state.pass, [action.payload.field]: action.payload.value },
      };
    case UPDATED_PASS:
      return {
        ...state,
        message: null,
        pass: null,
      };
    case SIGN_OUT:
      return {
        ...state,
        auth: null,
        user: null,
        message: null,
        pass: null,
      };
    case SIGN_OUT_ERROR:
      return {
        ...state,
        auth: null,
        user: null,
        message: action.payload,
        pass: null,
      };
    case GET_CONFIG:
      return {
        ...state,
        config: action.payload,
      };
    case USER_PASSWORD_RECOVERY:
      return state;
    default:
      return state;
  }
};
