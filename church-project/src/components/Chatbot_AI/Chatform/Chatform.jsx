"use client";

import { useRef } from "react";

const Chatform = ({
  chatHistory,
  setChatHistory,
  generateBotResponse,
  isLoading,
}) => {
  const inputRef = useRef(null);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const userMessage = inputRef.current?.value.trim();

    if (!userMessage) {
      return;
    }

    inputRef.current.value = "";

    const updatedHistory = [
      ...chatHistory,
      {
        role: "user",
        text: userMessage,
      },
    ];

    setChatHistory([
      ...updatedHistory,
      {
        role: "model",
        text: "Thinking...",
      },
    ]);

    generateBotResponse(updatedHistory);
  };

  return (
    <form
      className="chat-form"
      onSubmit={handleFormSubmit}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={
          isLoading ? "Thinking..." : "Message..."
        }
        className="message-input"
        disabled={isLoading}
        required
      />

      <button
        type="submit"
        className="material-symbols-rounded"
        disabled={isLoading}
        aria-label="Send message"
      >
        arrow_upward
      </button>
    </form>
  );
};

export default Chatform;