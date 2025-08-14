import React, { useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import UserBadgeItem from "../components/UserAvatar/UserBadgeItem";
import UserListItem from "../components/UserAvatar/UserListItem";
import { toast } from "react-toastify";
import "./UpdateGroupChatModal.css";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user } = ChatState();

  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  /* ---------- helpers ---------- */

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query.trim()) return;
    try {
      setLoading(true);
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${query}`, cfg);
      setSearchResult(data);
    } catch {
      toast.error("Failed to load search results", { position: "bottom-left" });
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName.trim()) return;
    try {
      setRenameLoading(true);
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "/api/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        cfg
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (err) {
      toast.error(err.response?.data?.message || "Rename failed");
    } finally {
      setRenameLoading(false);
      setGroupChatName("");
    }
  };

  const handleAddUser = async (u) => {
    if (selectedChat.users.find((usr) => usr._id === u._id)) {
      return toast.warning("User already in group");
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      return toast.error("Only admins can add users");
    }
    try {
      setLoading(true);
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        { chatId: selectedChat._id, userId: u._id },
        cfg
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (err) {
      toast.error(err.response?.data?.message || "Add user failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (u) => {
    if (selectedChat.groupAdmin._id !== user._id && u._id !== user._id) {
      return toast.error("Only admins can remove others");
    }
    try {
      setLoading(true);
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        { chatId: selectedChat._id, userId: u._id },
        cfg
      );
      u._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Remove failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- render ---------- */

  return (
    <>
      {/* trigger button, replace icon with text/emoji or your own SVG */}
      <button className="icon-btn" onClick={open}>
        👁
      </button>

      {isOpen && (
        <div className="ugc-overlay" onClick={close}>
          <div className="ugc-modal" onClick={(e) => e.stopPropagation()}>
            {/* header */}
            <div className="ugc-header">
              <h2>{selectedChat.chatName}</h2>
              <button className="ugc-close" onClick={close}>
                &times;
              </button>
            </div>

            {/* body */}
            <div className="ugc-body">
              <div className="badges">
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </div>

              {/* rename */}
              <div className="row">
                <input
                  className="ugc-input"
                  placeholder="Chat name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <button
                  className="ugc-btn teal"
                  onClick={handleRename}
                  disabled={renameLoading}
                >
                  {renameLoading ? "..." : "Update"}
                </button>
              </div>

              {/* search */}
              <input
                className="ugc-input"
                placeholder="Add user to group"
                onChange={(e) => handleSearch(e.target.value)}
              />

              {loading ? (
                <div className="spinner">Loading...</div>
              ) : (
                <div className="user-list">
                  {searchResult.slice(0, 4).map((u) => (
                    <UserListItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleAddUser(u)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* footer */}
            <div className="ugc-footer">
              <button
                className="ugc-btn red"
                onClick={() => handleRemove(user)}
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;
