import React from "react";
import "./SearchSidebar.css";
import UserListItem from "../components/UserAvatar/UserListItem.js";

const SearchSidebar = ({
  isOpen,
  onClose,
  handleSearch,
  setSearch,
  loading,
  searchResults,
  accessChat,
}) => {
  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <h2>Search Users</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="sidebar-body">
          <div className="sidebar-body-search">
            <input
              className="search-input"
              type="text"
              onChange={(e) => setSearch(e.target.value)}
            ></input>
            <button className="search-button" onClick={handleSearch}>
              Go
            </button>
          </div>
          <div className="search-results">
            {!loading &&
              searchResults.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSidebar;
