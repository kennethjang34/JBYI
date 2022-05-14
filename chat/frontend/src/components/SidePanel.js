import React from "react";

export default class SidePanel extends React.Component {
    render() {
        return (
            <div className="container bootstrap snippets bootdey">
                <div className="tile tile-alt" id="messages-main">
                    <div className="ms-menu">
                        <div className="ms-user clearfix">
                            <img
                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                alt=""
                                className="img-avatar pull-left"
                            />
                            <div>
                                Signed in as <br />
                                m-hollaway@gmail.com
                            </div>
                        </div>

                        <div className="p-15">
                            <div className="dropdown">
                                <a
                                    className="btn btn-primary btn-block"
                                    href=""
                                    data-toggle="dropdown"
                                >
                                    Messages <i className="caret m-l-5"></i>
                                </a>

                                <ul className="dropdown-menu dm-icon w-100">
                                    <li>
                                        <a href="">
                                            <i className="fa fa-envelope"></i>
                                            Messages
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            <i className="fa fa-users"></i>{" "}
                                            Contacts
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            <i className="fa fa-format-list-bulleted"></i>
                                            Todo Lists
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="list-group lg-alt">
                            <a className="list-group-item media" href="">
                                <div className="pull-left">
                                    <img
                                        src="https://bootdey.com/img/Content/avatar/avatar2.png"
                                        alt=""
                                        className="img-avatar"
                                    />
                                </div>
                                <div className="media-body">
                                    <small className="list-group-item-heading">
                                        Davil Parnell
                                    </small>
                                    <small className="list-group-item-text c-gray">
                                        Hungry
                                    </small>
                                </div>
                            </a>

                            <a className="list-group-item media" href="">
                                <div className="lv-avatar pull-left">
                                    <img
                                        src="https://bootdey.com/img/Content/avatar/avatar2.png"
                                        alt=""
                                        className="img-avatar"
                                    />
                                </div>
                                <div className="media-body">
                                    <div className="list-group-item-heading">
                                        James Anderson
                                    </div>
                                    <small className="list-group-item-text c-gray">
                                        Hungry
                                    </small>
                                </div>
                            </a>

                            <a className="list-group-item media" href="">
                                <div className="lv-avatar pull-left">
                                    <img
                                        src="https://bootdey.com/img/Content/avatar/avatar3.png"
                                        alt=""
                                        className="img-avatar"
                                    />
                                </div>
                                <div className="media-body">
                                    <div className="list-group-item-heading">
                                        Kane Williams
                                    </div>
                                    <small className="list-group-item-text c-gray">
                                        Hungry
                                    </small>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
