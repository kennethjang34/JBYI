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
import { useLocation } from "react-router-dom";

import {
    Route,
    BrowserRouter,
    Switch,
    Router,
    Routes,
    Navigate,
} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.props.checkAuth();
        let previous_url = window.location.pathname;
        previous_url = previous_url.split("/chat/").pop();
        if (previous_url === "/login") {
            previous_url = "/";
        }
        this.state = { previous: previous_url };
    }

    BodyComponent = (props) => {
        const location = useLocation();
        if (this.props.currentUser) {
            return <ChatApp />;
        } else {
            return <Navigate to="/login" replace state={{ from: location }} />;
        }
    };

    render = () => {
        console.log(this.props.currentUser);
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/chat/:chatID/"
                        element={<this.BodyComponent />}
                    />
                </Routes>
            </BrowserRouter>
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
        checkAuth: () => dispatch(authActions.checkAuthAction),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
