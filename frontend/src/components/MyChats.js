// import { toast } from "react-toastify";
// import { ChatState } from "../context/ChatProvider.js";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./MyChats.css";
// import { getSender } from "../config/ChatLogics.js";

// const MyChats = () => {
//   const [loggedUser, setLoggedUser] = useState();
//   const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

//   const fetchChats = async () => {
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const { data } = await axios.get("/api/chat", config);
//       console.log(data);
//       setChats(data);
//     } catch (error) {
//       toast.error("Failed to fetch chats", {
//         position: "bottom-center",
//         autoClose: 3000,
//       });
//     }
//   };

//   useEffect(() => {
//     const localUser = JSON.parse(localStorage.getItem("userInfo"));
//     setLoggedUser(localUser);

//     if (user) {
//       fetchChats();
//     }
//   }, [user]);

//   return (
//     <div className="my-chats-container" style={{ display: "flex" }}>
//       <div className="my-chats-header">
//         <span>My Chats</span>
//         {/* <GroupChatModal>
//           <button className="group-chat-btn">New Group Chat</button>
//         </GroupChatModal> */}
//       </div>

//       <div className="chat-list">
//         {chats && (
//           <div className="chat-stack">
//             {chats.map((chat) => (
//               <div
//                 onClick={() => setSelectedChat(chat)}
//                 className={`chat-item ${
//                   selectedChat === chat ? "selected" : ""
//                 }`}
//                 key={chat._id}
//               >
//                 <div className="chat-name">
//                   {!chat.isGroupChat && loggedUser
//                     ? getSender(loggedUser, chat.users)
//                     : chat.chatName}
//                 </div>
//                 {chat.latestMessage && (
//                   <div className="chat-message">
//                     <b>{chat.latestMessage.sender.name}:</b>{" "}
//                     {chat.latestMessage.content.length > 50
//                       ? chat.latestMessage.content.substring(0, 51) + "..."
//                       : chat.latestMessage.content}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyChats;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ChatState } from "../context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import "./MyChats.css";
import GroupChatModal from "../miscellaneous/GroupChatModal.js";

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState(null);

  const fetchChats = async (fetchAgain) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast.error("Failed to fetch chats", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    if (user && user.token) {
      fetchChats();
    }
  }, [fetchAgain]);

  return (
    <div className="my-chats-container" style={{ display: "flex" }}>
      <div className="my-chats-header">
        <span>My Chats</span>
        <GroupChatModal>
          <button className="group-chat-btn">New Group Chat</button>
        </GroupChatModal>
      </div>

      <div className="chat-list">
        {chats.length > 0 ? (
          <div className="chat-stack">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`chat-item ${
                  selectedChat === chat ? "selected" : ""
                }`}
              >
                <div className="chat-name">
                  {!chat.isGroupChat && loggedUser
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </div>
                {chat.latestMessage && (
                  <div className="chat-message">
                    <b>{chat.latestMessage.sender.name}:</b>{" "}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="chat-empty">No chats yet</div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
