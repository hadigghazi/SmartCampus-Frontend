import React, { useState } from "react";
import Experience from '../../components/Instructor/Experience';
import { Chat } from '../../components/Instructor/Chat/Chat';
import { ChatHistory } from '../../components/Instructor/ChatHistory/ChatHistory';
import './InstructorPage.css';

const InstructorPage: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);  

  const updateChatHistory = (newHistory: any[]) => {
    setChatHistory(newHistory);
  };

  return (
    <>
      <Experience isSpeaking={isSpeaking} />
      
      <ChatHistory chatHistory={chatHistory} updateChatHistory={updateChatHistory} />
      <Chat
        chatHistory={chatHistory}
        updateChatHistory={updateChatHistory}
        isSpeaking={isSpeaking}
        setIsSpeaking={setIsSpeaking}
      />
    </>
  );
};

export default InstructorPage;
