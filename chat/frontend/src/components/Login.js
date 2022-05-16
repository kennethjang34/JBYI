import React from "react";
import webSocketServer from "../websocket";
import { connect } from "react-redux";
import * as authActions from "../redux-store/actions/authActions";
import * as messageActions from "../redux-store/actions/chatActions";
import ChatRoom from "./ChatRoom";
import ChatApp from "./ChatApp";
import SidePanel from "./SidePanel";
import { checkAuthAction } from "../redux-store/actions/authActions";
import React from "react";
import {
    Route,
    BrowserRouter,
    Switch,
    Router,
    Routes,
    Navigate,
} from "react-router-dom";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { authType: "login", keepMeSignedIn: true };
    }
    authHandler = (event) => {
        event.preventDefault();

        if (this.state.authType === "login") {
            this.props.login(
                event.target.usernameLogin.value,
                event.target.password.value
            );
        } else {
            console.log("???");
            this.props.signup(
                event.target.usernameSignup.value,
                event.target.email.value,
                event.target.password1.value,
                event.target.password2.value
            );
        }
    };

    handleKeepMeSignedIn = (event) => {
        this.setState({ keepMeSignedIn: !keepMeSignedIn });
    };

    changeFormat = (event) => {
        console.log(event.target.value);
        this.setState({
            authType: event.target.value,
        });
    };

    render = () => {
        return (
            <div className="login-wrap">
                <div className="login-html">
                    <input
                        id="tab-1"
                        type="radio"
                        name="tab"
                        className="sign-in"
                        value={"login"}
                        defaultChecked={true}
                        onClick={this.changeFormat}
                    />
                    <label htmlFor="tab-1" className="tab">
                        Sign In
                    </label>
                    <input
                        id="tab-2"
                        type="radio"
                        name="tab"
                        className="sign-up"
                        value={"signup"}
                        onClick={this.changeFormat}
                    />
                    <label htmlFor="tab-2" className="tab">
                        Sign Up
                    </label>
                    <form className="login-form" onSubmit={this.authHandler}>
                        <div className="sign-in-htm">
                            <div className="group">
                                <label
                                    htmlFor="usernameLogin"
                                    className="label"
                                >
                                    Username
                                </label>
                                <input
                                    id="usernameLogin"
                                    type="text"
                                    className="input"
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="password" className="label">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="input"
                                    data-type="password"
                                />
                            </div>
                            <div className="group">
                                <input
                                    id="checkbox"
                                    type="checkbox"
                                    className="check"
                                    onChange={this.handleKeepMeSignedIn}
                                    defaultChecked={this.state.keepMeSignedIn}
                                />
                                <label htmlFor="checkbox">
                                    <span className="icon"></span> Keep me
                                    Signed in
                                </label>
                            </div>
                            <div className="group">
                                <input
                                    type="submit"
                                    className="button"
                                    value="Sign In"
                                />
                            </div>
                            <div className="hr"></div>
                            <div className="foot-lnk">
                                <a href="#forgot">Forgot Password?</a>
                            </div>
                        </div>
                        <div className="sign-up-htm">
                            <div className="group">
                                <label
                                    htmlFor="usernameSignup"
                                    className="label"
                                >
                                    Username
                                </label>
                                <input
                                    id="usernameSignup"
                                    type="text"
                                    className="input"
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="password1" className="label">
                                    Password
                                </label>
                                <input
                                    id="password1"
                                    type="password"
                                    className="input"
                                    data-type="password"
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="password2" className="label">
                                    Repeat Password
                                </label>
                                <input
                                    id="password2"
                                    type="password"
                                    className="input"
                                    data-type="password"
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="email" className="label">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="text"
                                    className="input"
                                />
                            </div>
                            <div className="group">
                                <input
                                    type="submit"
                                    className="button"
                                    value="Sign Up"
                                />
                            </div>
                            <div className="hr"></div>
                            <div className="foot-lnk">
                                <label htmlFor="tab-1">Already Member?</label>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
}
const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.currentUser,
        //state.chat.chats: list of chats. Each chat contains messges belonging to that chat room
        // chats: state.chat.chats,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (userName, password) =>
            dispatch(authActions.loginAction(userName, password)),
        // logout: () => dispatch(authActions.logout()),
        signup: (username, email, password1, password2) =>
            dispatch(
                authActions.signUpAction(username, email, password1, password2)
            ),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
