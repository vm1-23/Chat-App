import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../miscellaneous/sideDrawer";
import MyChats from "../components/MyChats.js";
import ChatBox from "../components/ChatBox.js";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <div className="chatpage-container" style={{ display: "flex" }}>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default Chatpage;
