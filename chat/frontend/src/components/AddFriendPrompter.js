import React, { useState } from "react";
// import "antd/dist/antd.css";
import { connect } from "react-redux";
import * as accountActions from "../redux-store/actions/accountActions";
import { Avatar, Input, AutoComplete, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000/account/api/";

const searchResult = (accountID, setOptions, handleSelected) => {
    var accounts = null;
    axios
        .get(`accounts?search=${accountID}`, {
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
            },
            data: {
                userID: accountID,
            },
        })
        .then((response) => {
            accounts = response.data;
            console.log(accounts);

            setOptions(
                new Array(accounts.length)
                    .join(".")
                    .split(".")
                    .map((_, idx) => {
                        let account;
                        if (accounts.length == 0) {
                            account = "No person with the ID found";
                        } else {
                            account = `${accounts[idx].userID}`;
                        }
                        // const account = `${accounts[idx].userID}`;
                        // console.log(account);
                        return {
                            value: account,

                            label: (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                    key={account}
                                >
                                    <span>
                                        {/* // href={`https://www.naver.com`}
                                            // target="_blank"
                                            rel="noopener noreferrer"
                                            // onClick={() => { */}
                                        {/* // handleSelected(account); // }} */}
                                        {account}
                                    </span>{" "}
                                    {/* {/* <span>{getRandomInt(200, 100)} results</span> */}
                                </div>
                            ),
                        };
                    })
            );
        });
};

const AddFriendPrompter = (props) => {
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState(null);

    const handleSelected = (account) => {
        setSelected(account);
        console.log("selectedHandled");
    };

    const handleSearch = (value) => {
        setOptions(
            value ? searchResult(value, setOptions, handleSelected) : []
        );
    };

    // const onSelect = (value) => {
    //     console.log("onSelect", value);
    // };

    return (
        <div style={{ width: "300px", height: "300px" }}>
            <AutoComplete
                dropdownMatchSelectWidth={252}
                style={{
                    width: 300,
                }}
                options={options}
                onSelect={handleSelected}
                onSearch={handleSearch}
            >
                {/* <Button
                size="large"
                placeholder="Enter the userID of your friend"
            /> */}
                <Input.Search
                    size="large"
                    placeholder="Enter the userID of your friend"
                    enterButton
                />
            </AutoComplete>
            <div
                style={{
                    left: "114px",
                    top: "50px",
                    position: "relative",
                    visibility: selected ? "visible" : "hidden",
                }}
            >
                <Avatar shape="square" size={64} icon={<UserOutlined />} />
                <span
                    style={{
                        right: "53px",
                        top: "50px",
                        position: "relative",
                        textAlign: "center",
                    }}
                >
                    {selected}
                </span>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendFriendRequest: (person) => {
            dispatch(accountActions.sendFriendRequestAction(person));
        },
        // searchFriendAction: (person) => {
        //     dispatch(accountActions.searchAccountAction(person));
        // },
    };
};

// export { AddFriendPrompter };
export default connect(mapStateToProps, mapDispatchToProps)(AddFriendPrompter);
