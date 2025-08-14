// import { ToastContainer, toast } from "react-toastify";
// import { useState } from "react";
// import React from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LoginForm = () => {
//   const [email, setEmail] = useState();
//   const [password, setPassword] = useState();
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     if (!email || !password) {
//       toast.warning("Please fill all the fields", {
//         position: "bottom",
//         autoClose: 5000,
//         isClosable: true,
//       });
//       setLoading(false);
//       return;
//     }
//     try {
//       const config = {
//         headers: {
//           "Content-type": "application/json",
//         },
//       };

//       const { data } = await axios.post(
//         "api/user/login",
//         { email, password },
//         config
//       );
//       console.log("Login success, navigating to chats...");
//       toast.success("Registration successful!", {
//         position: "bottom",
//         autoClose: 5000,
//         isClosable: true,
//       });
//       localStorage.setItem("userInfo", JSON.stringify(data));
//       setLoading(false);
//       console.log("Navigating to chats...");
//       navigate("/chats");
//     } catch (error) {
//       const errorMessage = error.response
//         ? error.response.data.message
//         : "An unexpected error occurred";

//       toast.error(`Error occurred: ${errorMessage}`, {
//         position: "bottom",
//         autoClose: 5000,
//         isClosable: true,
//       });
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="form">
//       <label>Email Address</label>
//       <input
//         type="text"
//         placeholder="Enter your Email Address"
//         onChange={(e) => {
//           setEmail(e.target.value);
//         }}
//       />
//       <label>Password</label>
//       <input
//         type="password"
//         placeholder="Enter Password"
//         onChange={(e) => {
//           setPassword(e.target.value);
//         }}
//       />
//       <div className="form-btn">
//         <button type="submit" onClick={submitHandler}>
//           Login
//         </button>
//         <button
//           type="button"
//           className="guest-btn"
//           onClick={() => {
//             setEmail("guest@example.com");
//             setPassword("123456");
//           }}
//         >
//           Get Guest User Credentials
//         </button>
//       </div>
//       <ToastContainer />
//     </form>
//   );
// };

// export default LoginForm;

import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);

    if (!email || !password) {
      toast.warning("Please fill all the fields", {
        position: "bottom",
        autoClose: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login", // Fixed the endpoint here
        { email, password },
        config
      );

      console.log("Login success, navigating to chats...");

      toast.success("Login successful!", {
        position: "bottom",
        autoClose: 5000,
        isClosable: true,
      });

      // Save user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      // Navigate to the /chats page
      navigate("/chats");
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "An unexpected error occurred";

      toast.error(`Error occurred: ${errorMessage}`, {
        position: "bottom",
        autoClose: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={submitHandler}>
      <label>Email Address</label>
      <input
        type="text"
        placeholder="Enter your Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password</label>
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="form-btn">
        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>
        <button
          type="button"
          className="guest-btn"
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Get Guest User Credentials
        </button>
      </div>
      <ToastContainer />
    </form>
  );
};

export default LoginForm;
