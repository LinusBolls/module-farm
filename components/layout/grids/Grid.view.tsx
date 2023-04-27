import classNames from "classnames";
import React, { ReactElement } from "react";
import styles from "./grids.module.css";


export interface GridProps {
  Center?: ReactElement | null;
  Header?: ReactElement | null;
  Inboxes?: ReactElement | null;
  Chats?: ReactElement | null;
  Chat?: ReactElement | null;
  Info?: ReactElement | null;

  InboxesHeader?: ReactElement | null;
  ChatsHeader?: ReactElement | null;
  ChatHeader?: ReactElement | null;
  InfoHeader?: ReactElement | null;

  isWithBackground?: boolean;
  isWithSplash?: boolean;

  onClose?: () => unknown;
}

export function Grid({
  Center,
  Header,
  Inboxes,
  Chats,
  Chat,
  Info,
  InboxesHeader,
  ChatsHeader,
  ChatHeader,
  InfoHeader,
  isWithBackground = true,
  isWithSplash = true,
  onClose,
}: GridProps) {
  return (
    <>
      <div
        className={classNames(
          styles["app-grid"],
          isWithBackground ? styles["modal-background"] : styles["app"],
          isWithSplash && styles["splash"],
          "bg-gray-800"
        )}
        {...(onClose == null ? {} : { onClick: onClose })}
      >
        <div className={classNames(styles["inboxes-header"], "border-r border-b border-gray-700")}>{InboxesHeader}</div>
        <div className={classNames(styles["chat-header"], "border-b border-gray-700")}>{ChatHeader}</div>
        <div className={classNames(styles["info-header"], "border-b border-gray-700")}>{InfoHeader}</div>
        <div className={classNames(styles.inboxes, "border-r border-gray-700")}>{Inboxes}</div>
        <div className={classNames(styles.chat)}>{Chat}</div>
        {/* <div className={classNames(styles.info, "border-l border-gray-700")}>{Info}</div> */}
      </div>
      <div className={classNames(styles["app-grid-centerer"])}>{Center}</div>
    </>
  );
}