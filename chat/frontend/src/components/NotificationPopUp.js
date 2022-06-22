import React from "react";
import "antd/dist/antd.css";
import { Button, notification } from "antd";

export const TOP_RIGHT = "topRight";
export const TOP_LEFT = "topLeft";
export const BOTTOM_LEFT = "bottomLeft";
export const BOTTOM_RIGHT = "bottmRight";

export const openInvitationNotification = (
  title,
  content,
  acceptCallback,
  declineCallback,
  placement = TOP_RIGHT,
  duration = 0
) => {
  const key = `open${Date.now()}`;
  notification.open({
    message: title,
    key: key,
    btn: (
      <div>
        <Button
          onClick={() => {
            notification.close(key);
          }}
        >
          Accept
        </Button>

        <Button
          onClick={() => {
            notification.close(key);
          }}
        >
          Decline
        </Button>
      </div>
    ),
    description: <span>{content}</span>,
    placement: placement,
    duration: duration,
  });
};
