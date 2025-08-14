// import { ToastContainer, toast } from "react-toastify";
// import { useState } from "react";
// import React from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const SignupForm = () => {
//   const [loading, setLoading] = useState(false);
//   const [name, setName] = useState();
//   const [email, setEmail] = useState();
//   const [password, setPassword] = useState();
//   const [confirmpassword, setConfirmpassword] = useState();
//   const [pic, setPic] = useState();
//   const navigate = useNavigate();

//   const postDetails = (pics) => {};

//   const submitHandler = async () => {
//     setLoading(true);
//     if (!name || !email || !password || !confirmpassword) {
//       toast.warning("Please fill all the fields", {
//         position: "bottom",
//         autoClose: 5000,
//         isClosable: true,
//       });

//       setLoading(false);
//       return;
//     }
//     if (password !== confirmpassword) {
//       toast.warning("Passwords do not match", {
//         position: "bottom",
//         autoClose: 5000,
//         isClosable: true,
//       });
//       return;
//     }
//     try {
//       const config = {
//         headers: {
//           "Content-type": "application/json",
//         },
//       };
//       const { data } = await axios.post(
//         "api/user",
//         { name, email, password, pic },
//         config
//       );
//       toast.success("Registration successful!", {
//         position: "bottom",
//         autoClose: 5000,
//         isClosable: true,
//       });
//       localStorage.setItem("userInfo", JSON.stringify(data));

//       setLoading(false);
//       navigate("chats");
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
//       <label>Name</label>
//       <input
//         type="text"
//         placeholder="Enter your Name"
//         onChange={(e) => {
//           setName(e.target.value);
//         }}
//       />
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
//       <label>Confirm Password</label>
//       <input
//         type="password"
//         placeholder="Confirm Password"
//         onChange={(e) => {
//           setConfirmpassword(e.target.value);
//         }}
//       />
//       <label>Upload your pic</label>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => {
//           postDetails(e.target.files[0]);
//         }}
//       ></input>
//       <div className="form-btn">
//         <button type="submit" onClick={submitHandler}>
//           Signup
//         </button>
//       </div>
//       <ToastContainer />
//     </form>
//   );
// };

// export default SignupForm;

import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast.warning("Please fill all the fields", {
        position: "bottom-center",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "bottom-center",
        autoClose: 3000,
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
        "/api/user",
        { name, email, password, pic },
        config
      );

      toast.success("Signup successful!", {
        position: "bottom-center",
        autoClose: 3000,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log("Signup successful, navigating to /chats");
      navigate("/chats");
    } catch (error) {
      toast.error("Failed to display search results", {
        position: "bottom-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="form">
      <label>Name</label>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label>Confirm Password</label>
      <input
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <label>Profile Picture</label>
      <input
        type="file"
        placeholder="Enter image"
        accept="image/*"
        onChange={(e) => setPic(e.target.files[0])}
      />

      <div className="form-btn">
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </div>

      <ToastContainer />
    </form>
  );
};

export default SignupForm;
