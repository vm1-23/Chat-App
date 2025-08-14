import React from "react";
import "./UserBadgeItem.css";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <div className="user-badge" onClick={handleFunction}>
      {user.name}
      {admin === user._id && <span className="admin-label"> (Admin)</span>}
      <span className="close-icon">×</span>
    </div>
  );
};

export default UserBadgeItem;
