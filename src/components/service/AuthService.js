import { getTime, getDate } from "./../Utilities"
import moment from 'moment'

export function getUser() {
  const user = window.localStorage.getItem("email");
  if (user === "undefined" || !user) {
    return null;
  } else {
    return JSON.parse(user);
  }
}

export function getToken() {
  return window.localStorage.getItem("token");
}

export function getExpire() {
  // const expire = window.localStorage.getItem("dateOfExpire") + ' ' + window.localStorage.getItem("timeOfExpire")
  // if((window.localStorage.getItem("dateOfExpire") !== null) || (window.localStorage.getItem("timeOfExpire") !== null)) {
  //   return expire;
  // } else return null;

  return window.localStorage.getItem("dateOfExpire");
}

export function setUserSession(user, token) {
  window.localStorage.setItem("email", JSON.stringify(user));
  window.localStorage.setItem("token", JSON.stringify(token));
  window.localStorage.setItem("dateOfExpire", JSON.stringify(moment().add(1, "hours").format('DD MMMM YYYY, h:mm:ss a').toString()));
  // window.localStorage.setItem("timeOfExpire", JSON.stringify(getTime().add(1, 'hours')));
}

export function resetUserSession() {
  window.localStorage.removeItem("email");
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("dateOfExpire");
}
