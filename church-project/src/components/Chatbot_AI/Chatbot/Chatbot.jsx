"use client";

import { useEffect, useRef, useState } from "react";

import Chatboticon from "../Chatbot_Icon/Chatbot_icon";
import Chatform from "../Chatform/Chatform";
import ChatMessage from "../ChatMessage/ChatMessage";
import { companyInfo } from "../CompanyInfo/CompanyInfo";

import "../Chatbot/Chatbot.css";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const chatBodyRef = useRef(null);

  const updateHistory = (text) => {
    setChatHistory((previousHistory) => [
      ...previousHistory.filter(
        (message) => message.text !== "Thinking..."
      ),
      {
        role: "model",
        text,
      },
    ]);
  };

  const generateBotResponse = async (history) => {
    try {
      setIsLoading(true);

      const messages = [
        {
          role: "system",
          content: companyInfo,
        },

        ...history.map((message) => ({
          role: message.role === "model" ? "assistant" : "user",
          content: message.text,
        })),
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "AI request failed."
        );
      }

      const botResponse =
        data?.choices?.[0]?.message?.content;

      updateHistory(
        botResponse || "I couldn't generate a response."
      );
    } catch (error) {
      console.error("Chatbot error:", error);

      updateHistory(
        "Sorry, something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!chatBodyRef.current) {
      return;
    }

    chatBodyRef.current.scrollTop =
      chatBodyRef.current.scrollHeight;
  }, [chatHistory]);

  return (
    <div
      className={`container ${
        showChatbot ? "show-chatbot" : ""
      }`}
    >
      <button
        id="chatbot-toggler"
        type="button"
        aria-label={
          showChatbot
            ? "Close chatbot"
            : "Open chatbot"
        }
        onClick={() =>
          setShowChatbot((previous) => !previous)
        }
      >
        <span className="material-symbols-rounded">
          mode_comment
        </span>

        <span className="material-symbols-rounded">
          close
        </span>
      </button>

      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <Chatboticon />

            <h2 className="logo-text">
              CHMS Assistant
            </h2>
          </div>

          <button
            type="button"
            className="material-symbols-rounded"
            aria-label="Close chatbot"
            onClick={() => setShowChatbot(false)}
          >
            keyboard_arrow_down
          </button>
        </div>

        <div
          ref={chatBodyRef}
          className="chat-body"
        >
          {chatHistory.length === 0 && (
            <div className="message bot-message">
              <Chatboticon />

              <p className="message-text">
                Hello! 👋 How can I help you today?
              </p>
            </div>
          )}

          {chatHistory.map((chat, index) => (
            <ChatMessage
              key={`${chat.role}-${index}`}
              chat={chat}
            />
          ))}
        </div>

        <div className="chat-footer">
          <Chatform
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;