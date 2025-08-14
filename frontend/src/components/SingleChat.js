import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import "./SingleChat.css";
// import animationData from "../animations/typing.json";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../context/ChatProvider";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    // animationData: animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Failed to load messages");
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat },
          config
        );
        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      } catch {
        alert("Failed to send the message");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMsg) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMsg.chat._id) {
        if (!notification.includes(newMsg)) {
          setNotification([newMsg, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prev) => [...prev, newMsg]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let now = new Date().getTime();
      if (now - lastTypingTime >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return selectedChat ? (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-btn" onClick={() => setSelectedChat("")}>
          ←
        </button>
        {!selectedChat.isGroupChat ? (
          <>
            <span>{getSender(user, selectedChat.users)}</span>
            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
          </>
        ) : (
          <>
            <span>{selectedChat.chatName.toUpperCase()}</span>
            <UpdateGroupChatModal
              fetchMessages={fetchMessages}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          </>
        )}
      </div>

      <div className="chat-messages">
        {loading ? (
          <div className="spinner">Loading...</div>
        ) : (
          <ScrollableChat messages={messages} />
        )}
      </div>

      <div className="chat-input-area">
        {istyping && (
          <div className="typing-animation">
            <Lottie options={defaultOptions} width={70} />
          </div>
        )}
        <input
          className="chat-input"
          type="text"
          placeholder="Enter a message..."
          value={newMessage}
          onChange={typingHandler}
          onKeyDown={sendMessage}
        />
      </div>
    </div>
  ) : (
    <div className="no-chat-selected">
      <h2>Click on a user to start chatting</h2>
    </div>
  );
};

export default SingleChat;
