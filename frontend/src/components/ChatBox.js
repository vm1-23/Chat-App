import React from "react";
import "./ChatBox.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../context/ChatProvider.js";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className="chatbox-container"
      style={{
        display: selectedChat ? "flex" : "none",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default Chatbox;
