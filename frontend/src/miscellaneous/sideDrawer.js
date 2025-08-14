import React, { useState, useEffect, useRef } from "react";
import "./sideDrawer.css";
import { ChatState } from "../context/ChatProvider.js";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import SearchSidebar from "./SearchSidebar";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [SidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const [open, setOpen] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const menuRef = useRef();

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please enter something in Search", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.some((c) => c && c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      setSidebarOpen(false);
    } catch (error) {
      toast.error("Error fetching chats", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="chat-drawer-header">
      <div className="side" onClick={() => setSidebarOpen(true)}>
        <i className="fas fa-search"></i>
        <span className="search-label">Search User</span>
      </div>
      <SearchSidebar
        isOpen={SidebarOpen}
        onClose={() => setSidebarOpen(false)}
        handleSearch={handleSearch}
        setSearch={setSearch}
        loading={loading}
        accessChat={accessChat}
        searchResults={searchResult}
      />

      <span className="chat-drawer-title">Talk-A-Tive</span>

      <div className="chat-drawer-profile">
        <i className="fas fa-bell"></i>

        <div className="menu-wrapper" ref={menuRef}>
          {user?.pic ? (
            <img
              src={user.pic}
              alt="profile"
              className="profile-avatar"
              onClick={() => setOpen(!open)}
            />
          ) : (
            <div className="avatar-fallback" onClick={() => setOpen(!open)}>
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          )}

          {open && (
            <div className="menu-list">
              <ProfileModal user={user}>
                <div className="menu-item">My Profile</div>
              </ProfileModal>
              <div className="menu-item" onClick={logoutHandler}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
