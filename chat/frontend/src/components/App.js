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
import Login from "./Login";
class App extends React.Component {
    constructor(props) {
        super(props);
        this.props.checkAuth();
    }

    BaseRouter = (props) => {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/chat/:chatID/"
                        element={
                            this.props.currentUser ? (
                                <ChatApp />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
            </BrowserRouter>
        );
    };

    render() {
        // return <ChatApp />;
        return <this.BaseRouter />;
    }
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
        checkAuth: () => dispatch(authActions.checkAuthAction),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
