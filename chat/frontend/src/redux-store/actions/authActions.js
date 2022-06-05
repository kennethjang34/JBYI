import * as actionTypes from "./actionTypes";

import axios from "axios";

//********************* */
axios.defaults.baseURL = "http://127.0.0.1:8000/api-auth/";

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    };
};

export const loginSuccess = (username, token) => {
    return {
        type: actionTypes.LOGIN_SUCCESS,
        token: token,
        currentUser: username,
    };
};

export const loadFriends = (friends) => {
    localStorage.setItem("friends", JSON.stringify(friends));
    return {
        type: actionTypes.LOAD_FRIENDS,
        friends: [...friends],
    };
};

export const loadFriendsAction = (username) => {
    return (dispatch, getState) => {
        axios
            .get("http://127.0.0.1:8000/account/api/friends", {
                headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                },
                data: {
                    username: username,
                },
            })
            .then((response) => {
                dispatch(loadFriends(response.data));
            });
    };
};

export const loginFail = (error) => {
    return {
        type: actionTypes.LOGIN_FAIL,
        error: error,
    };
};

export const logoutAction = (dispatch, getState) => {
    localStorage.removeItem("token");
    //in localStorage, only username field of the user account object available
    localStorage.removeItem("currentUser");
    localStorage.removeItem("expirationDate");
    dispatch({ type: actionTypes.LOGOUT });
};

//needs to save the state in local storage
//returns function object for redux thunk
export const loginAction = (username, password) => {
    return (dispatch, getState) => {
        dispatch(authStart());
        axios
            .post("login/", {
                username: username,
                password: password,
            })
            .then((response) => {
                const token = response.data.key;
                const expirationTime = new Date(
                    //1 hour permission
                    new Date().getTime() + 3600 * 1000
                );
                localStorage.setItem("currentUser", username);
                localStorage.setItem("token", token);
                localStorage.setItem("expirationTime", expirationTime);
                dispatch({
                    type: actionTypes.LOGIN_SUCCESS,
                    currentUser: username,
                    token: token,
                });

                dispatch(setLogOutTimer(3600 * 1000));
                dispatch(loadFriendsAction(username));
            });
    };
};

export const getBoundedFunction = (dispatch, action) => {
    return () => {
        dispatch(action);
    };
};

export const signUpAction = (username, email, password1, password2) => {
    return (dispatch) => {
        dispatch(authStart());
        axios
            .post("registration/", {
                username: username,
                email: email,
                password1: password1,
                password2: password2,
            })
            .then((res) => {
                const token = res.data.key;
                const expirationDate = new Date(
                    //1 hour time out
                    new Date().getTime() + 3600 * 1000
                );
                localStorage.setItem("token", token);
                localStorage.setItem("currentUser", username);
                localStorage.setItem("expirationDate", expirationDate);
                dispatch(loginSuccess(username, token));
                dispatch(setLogOutTimer(3600 * 1000));
            })
            .catch((err) => {
                dispatch(loginFail(err));
            });
    };
};

export const setLogOutTimer = (timeGiven) => {
    return (dispatch) => {
        setTimeout(getBoundedFunction(dispatch, logoutAction), timeGiven);
    };
};

export const checkAuthAction = (dispatch, getState) => {
    const state = getState();
    const currentUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");
    // if (currentUser !== undefined && currentUser !== null) {
    // token = currentUser.token;
    // }

    if (token !== undefined) {
        dispatch(loginSuccess(currentUser, token));
        if (localStorage.getItem("freinds")) {
            dispatch(loadFriends(JSON.parse(localStorage.getItem("friends"))));
        } else {
            dispatch(loadFriendsAction);
        }
        const expirationTime = new Date(localStorage.getItem("expirationTime"));
        if (expirationTime <= new Date()) {
            dispatch(logoutAction);
        } else {
            dispatch(
                setLogOutTimer(expirationTime.getTime() - new Date().getTime())
            );
        }
    }
};
