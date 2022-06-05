import * as actionTypes from "./actionTypes";

import axios from "axios";

//********************* */
axios.defaults.baseURL = "http://127.0.0.1:8000/account/api/";

export const sendFriendRequestAction = (person) => {
    return (dispatch) => {
        axios
            .post("add-friend", {
                username: username,
                password: password,
                target: person,
            })
            .then((response) => {});
    };
};

// export const searchAccountAction = (person) => {
//     return (dispatch) => {
//         axios
//             .get("search-account", {
//                 headers: {
//                     Authorization: `Token ${localStorage.getItem("token")}`,
//                 },
//                 data: {
//                     username: person,
//                 },
//             })
//             .then((response) => {
//                 dispatch()
//             });
//     };
// };
