import React from "react";

class SidePanel extends React.Component {
    render() {
        return (
            <div class="container bootstrap snippets bootdey">
                <div class="tile tile-alt" id="messages-main">
                    <div class="ms-menu">
                        <div class="ms-user clearfix">
                            <img
                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                alt=""
                                class="img-avatar pull-left"
                            />
                            <div>
                                Signed in as <br />
                                m-hollaway@gmail.com
                            </div>
                        </div>

                        <div class="p-15">
                            <div class="dropdown">
                                <a
                                    class="btn btn-primary btn-block"
                                    href=""
                                    data-toggle="dropdown"
                                >
                                    Messages <i class="caret m-l-5"></i>
                                </a>

                                <ul class="dropdown-menu dm-icon w-100">
                                    <li>
                                        <a href="">
                                            <i class="fa fa-envelope"></i>
                                            Messages
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            <i class="fa fa-users"></i> Contacts
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            <i class="fa fa-format-list-bulleted"></i>
                                            Todo Lists
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="list-group lg-alt">
                            <a class="list-group-item media" href="">
                                <div class="pull-left">
                                    <img
                                        src="https://bootdey.com/img/Content/avatar/avatar2.png"
                                        alt=""
                                        class="img-avatar"
                                    />
                                </div>
                                <div class="media-body">
                                    <small class="list-group-item-heading">
                                        Davil Parnell
                                    </small>
                                    <small class="list-group-item-text c-gray">
                                        Hungry
                                    </small>
                                </div>
                            </a>

                            <a class="list-group-item media" href="">
                                <div class="lv-avatar pull-left">
                                    <img
                                        src="https://bootdey.com/img/Content/avatar/avatar2.png"
                                        alt=""
                                        class="img-avatar"
                                    />
                                </div>
                                <div class="media-body">
                                    <div class="list-group-item-heading">
                                        James Anderson
                                    </div>
                                    <small class="list-group-item-text c-gray">
                                        Hungry
                                    </small>
                                </div>
                            </a>

                            <a class="list-group-item media" href="">
                                <div class="lv-avatar pull-left">
                                    <img
                                        src="https://bootdey.com/img/Content/avatar/avatar3.png"
                                        alt=""
                                        class="img-avatar"
                                    />
                                </div>
                                <div class="media-body">
                                    <div class="list-group-item-heading">
                                        Kane Williams
                                    </div>
                                    <small class="list-group-item-text c-gray">
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
