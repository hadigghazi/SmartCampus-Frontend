import React, { useState } from "react";
import Experience from '../../components/Instructor/Experience';
import { Chat } from '../../components/Instructor/Chat/Chat';
import { ChatHistory } from '../../components/Instructor/ChatHistory/ChatHistory';
import "./InstructorPage.css";

const InstructorPage: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Interaction[]>([]);

  const updateChatHistory = (newHistory: Interaction[]) => {
    setChatHistory(newHistory);
  };

  return (
    <>
      <Experience />
      <ChatHistory chatHistory={chatHistory} updateChatHistory={updateChatHistory} />
      <Chat chatHistory={chatHistory} updateChatHistory={updateChatHistory} />
    </>
  );
};

export default InstructorPage;
