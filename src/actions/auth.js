import { fetchSinToken, fetchConToken } from "../helpers/fetch";
import { types } from "../types/types";
import Swal from "sweetalert2";
import { eventLogout } from "./events";

export const startLogin = (email, password) => {
  return async (dispatch) => {
    try {
      const resp = await fetchSinToken("auth", { email, password }, "POST");
      const body = await resp.json();

      if (body.ok) {
        localStorage.setItem("token", body.token);
        localStorage.setItem("token-init-date", new Date().getTime());

        dispatch(
          login({
            uid: body.uid,
            name: body.name,
          })
        );
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (err) {
      //console.log(err);
      Swal.fire("Error", err.msg, "error");
    }
  };
};

export const startRegister = (email, password, name) => {
  return async (dispatch) => {
    try {
      const resp = await fetchSinToken(
        "auth/new",
        { email, password, name },
        "POST"
      );
      const body = await resp.json();

      if (body.ok) {
        localStorage.setItem("token", body.token);
        localStorage.setItem("token-init-date", new Date().getTime());

        dispatch(
          login({
            uid: body.uid,
            name: body.name,
          })
        );
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (err) {
      //console.log(err);
      Swal.fire("Error", err.msg, "error");
    }
  };
};

export const startChecking = () => {
  return async (dispatch) => {
    try {
      const resp = await fetchConToken("auth/renew");
      const body = await resp.json();

      if (body.ok) {
        localStorage.setItem("token", body.token);
        localStorage.setItem("token-init-date", new Date().getTime());

        dispatch(
          login({
            uid: body.uid,
            name: body.name,
          })
        );
      } else {
        dispatch(checkingFinish());
      }
    } catch (err) {
      //console.log(err);
      dispatch(checkingFinish());
    }
  };
};

const checkingFinish = () => ({ type: types.authCheckingFinish });

const login = (user) => ({
  type: types.authLogin,
  payload: user,
});

export const startLogout = () => {
  return (dispatch) => {
    localStorage.clear();
    dispatch(eventLogout());
    dispatch(logout());
  };
};

const logout = () => ({ type: types.authLogout });
