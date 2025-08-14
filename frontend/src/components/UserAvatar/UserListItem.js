import React from "react";
import "./UserListItem.css"; // Create this CSS file

const UserListItem = ({ user, handleFunction }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="user-list-item" onClick={handleFunction}>
      {user.pic ? (
        <img src={user.pic} alt={user.name} className="user-avatar" />
      ) : (
        <div className="avatar-fallback">{getInitials(user.name)}</div>
      )}

      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-email">
          <b>Email:</b> {user.email}
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
