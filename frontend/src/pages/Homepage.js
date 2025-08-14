import React, { useEffect, useState } from "react";
import "./Homepage.css";
import LoginForm from "../components/authentication/LoginForm";
import SignupForm from "../components/authentication/SignupForm";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    console.log(user);

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="homepage-container">
      <div className="homepage-box">
        <div className="header">Gooners Inc.</div>
        <div className="main-form">
          <div className="button-container">
            <button
              className={showLogin ? "active" : ""}
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className={showLogin ? "" : "active"}
              onClick={() => setShowLogin(false)}
            >
              Sign up
            </button>
          </div>
          <div> {showLogin ? <LoginForm /> : <SignupForm />}</div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
