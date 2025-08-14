import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import "./ScrollableChat.css";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="chat-message-row" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div className="chat-avatar-tooltip">
                <img
                  src={m.sender.pic}
                  alt={m.sender.name}
                  className="chat-avatar"
                  title={m.sender.name}
                />
              </div>
            )}
            <span
              className={`chat-bubble ${
                m.sender._id === user._id ? "own-message" : "other-message"
              }`}
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
