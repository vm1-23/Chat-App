// import React, { useState } from "react";
// import "./GroupChatModal.css";

// const GroupChatModal = ({ children }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [groupChatName, setgGoupChatName] = useState();
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [setSearch, setSetSearch] = useState();
//   const [searchResult, setSearchResult] = useState();
//   const [loading, setLoading] = useState(false);

//   const openModal = () => setIsOpen(true);
//   const closeModal = () => setIsOpen(false);

//   const handleSearch=()=>{

//   }

//   return (
//     <>
//       <span onClick={openModal}>{children}</span>

//       {isOpen && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>Create Group Chat</h2>
//               <button className="close-btn" onClick={closeModal}>
//                 &times;
//               </button>
//             </div>

//             <div className="modal-body">Modal Body</div>

//             <div className="modal-footer">
//               <button className="btn blue" onClick={closeModal}>
//                 Close
//               </button>
//               <button className="btn ghost">Secondary Action</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default GroupChatModal

import React, { useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import UserListItem from "../components/UserAvatar/UserListItem";
import UserBadgeItem from "../components/UserAvatar/UserBadgeItem";
import "./GroupChatModal.css"; // optional external styles
import { toast } from "react-toastify";

const GroupChatModal = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load search results", {
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast.warning("User already added", { position: "top" });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast.warning("Please fill all the fields", { position: "top" });
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setModalOpen(false);
      toast.success("New group chat created!", { position: "bottom" });
    } catch (error) {
      toast.error(error.response?.data || "Failed to create group", {
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={() => setModalOpen(true)}>{children}</span>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Group Chat</h2>
              <button onClick={() => setModalOpen(false)} className="close-btn">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Add Users e.g. John, Jane"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="modal-input"
              />

              <div className="user-badge-container">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>

              <div className="user-list">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  searchResult
                    .slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleSubmit} className="submit-btn">
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;
