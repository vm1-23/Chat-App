import React from "react";
import { useState } from "react";
import("./ProfileModal.css");
const ProfileModal = ({ user, children }) => {
  const [isModalOpen, setisModalOpen] = useState(false);

  const handleOpen = () => setisModalOpen(true);

  return (
    <>
      {children ? (
        <span onClick={() => setisModalOpen(true)}>{children}</span>
      ) : (
        <i
          className="fa-solid fa-eye"
          onClick={handleOpen}
          style={{ cursor: "pointer" }}
        ></i>
      )}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setisModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <h1>{user.name}</h1>
              <button
                className="close-button"
                onClick={() => setisModalOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="modal-body">
              <img src={user.pic} alt={user.name} />
              <p>{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;
