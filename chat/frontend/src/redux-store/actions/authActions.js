import * as actionTypes from "./actionTypes";

export const logoutAction = (dispatch, getState) => {
    dispatch({ type: actionTypes.LOGOUT });
};

export const loginAction = (username, password) => {
    return (dispatch) => {};
    // dispatch {
    //     username: "",
    //     token: undefined,
    //     expirationDate: undefined,
    // };
};

const getBoundedFunction = (dispatch, action) => {
    return () => {
        dispatch(action);
    };
};

const setLogOutTimer = (timeGiven) => {
    return (dispatch) => {
        setTimeout(getBoundedFunction(dispatch, logoutAction), timeGiven);
    };
};

export const checkAuthAction = (dispatch, getState) => {
    const state = getState();
    const currentUser = state.currentUser;
    const token = currentUser.token;
    if (token !== undefined) {
        const expirationDate = new Date(localStorage.getItem("expirationDate"));
        if (expirationDate <= new Date()) {
            dispatch(logoutAction);
        } else {
            dispatch(setLogOutTimer(new Date() - expirationDate));
        }
    }
};
