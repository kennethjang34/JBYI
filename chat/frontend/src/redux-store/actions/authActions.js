import * as actionTypes from "./actionTypes";
import axios from "axios";

//********************* */
axios.defaults.baseURL = "http://127.0.0.1:8000/api-auth/";

export const logoutAction = (dispatch, getState) => {
    localStorage.removeItem("token");
    //in localStorage, only username field of the user account object available
    localStorage.removeItem("username");
    localStorage.removeItem("expirationDate");
    return { type: actionTypes.LOGOUT };
};

//needs to save the state in local storage
//returns function object for redux thunk
export const loginAction = (username, password) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.LOGIN_START,
        });
        axios
            .post("login", {
                username: username,
                password: password,
            })
            .then((response) => {
                console.log(response);
                const token = response.data.key;
                const expirationTime = new Date(
                    //1 hour permission
                    new Date().getTime() + 3600 * 1000
                );
                localStorage.setItem("currentUser", username);
                localStorage.setItem("token", token);
                localStorage.setItem("expirationTime", expirationTime);
                dispatch({
                    type: actionTypes.AUTH_SUCCESS,
                    currentUser: username,
                    token: token,
                });
                dispatch(authActions.setLogOutTimer(3600 * 100));
            });
    };
};
export const getBoundedFunction = (dispatch, action) => {
    return () => {
        dispatch(action);
    };
};

export const setLogOutTimer = (timeGiven) => {
    return (dispatch) => {
        setTimeout(getBoundedFunction(dispatch, logoutAction), timeGiven);
    };
};

export const checkAuthAction = (dispatch, getState) => {
    const state = getState();
    const currentUser = state.currentUser;
    const token = null;
    if (currentUser !== undefined && currentUser !== null) {
        token = currentUser.token;
    }
    if (token !== undefined) {
        const expirationTime = new Date(localStorage.getItem("expirationTime"));
        if (expirationTime <= new Date()) {
            dispatch(logoutAction);
        } else {
            dispatch(setLogOutTimer(new Date() - expirationTime));
        }
    }
};
