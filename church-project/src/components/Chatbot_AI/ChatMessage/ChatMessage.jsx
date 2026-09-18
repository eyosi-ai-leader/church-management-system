import Chatboticon from "../Chatbot_Icon/Chatbot_icon";

const ChatMessage = ({ chat }) => {
  if (chat.hideInChat) {
    return null;
  }

  return (
    <div
      className={`message ${
        chat.role === "model" ? "bot" : "user"
      }-message`}
    >
      {chat.role === "model" && <Chatboticon />}

      <p className="message-text">{chat.text}</p>
    </div>
  );
};

export default ChatMessage;