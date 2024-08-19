// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "./Chat.module.css";

export const Chat: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const startListening = () => {
    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setUserInput(finalTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (userInput.trim() !== "") {
        handleSubmit(new Event("submit"));
      }
    };

    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    const synthesis = synthesisRef.current;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    synthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    const synthesis = synthesisRef.current;
    if (synthesis.speaking) {
      synthesis.cancel(); 
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (chatHistory.length > 0) {
      const lastResponse = chatHistory[chatHistory.length - 1].bot;
      speak(lastResponse);
    }
  }, [chatHistory]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/chatgpt",
        {
          message: userInput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const generatedText = response.data.response;
      setChatHistory([...chatHistory, { user: userInput, bot: generatedText }]);
      setUserInput("");
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  const handleClear = () => {
    setChatHistory([]);
    setUserInput("");
  };

  return (
    <div className={styles.chatComponent}>
      <button className={styles.chatButton} onClick={toggleInput}>
        {showInput ? "Close Chat" : "Ask a Question"}
      </button>
      {showInput && (
        <div className={`${styles.chatBox} ${showInput ? styles.show : ""}`}>
          <div className={styles.containerInner}>
            <div className={styles.content}>
              {chatHistory.length === 0 ? (
                <p className={styles.welcomeMessage}>
                  Welcome to the chat! Ask a question to start a conversation
                  with the Teacher.
                </p>
              ) : (
                chatHistory.map((chat, index) => (
                  <div key={index}>
                    <p className={styles.userMessage}>
                      <strong>You:</strong> {chat.user}
                    </p>
                    <p className={styles.teacherResponse}>
                      <strong>Instructor:</strong> {chat.bot}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className={styles.inputContainer}>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className={styles.inputField}
                  value={userInput}
                  onChange={handleUserInput}
                  placeholder="Type your message..."
                  required
                />
                {SpeechRecognition && (
                  <button
                    type="button"
                    onMouseDown={startListening}
                    onMouseUp={stopListening}
                    onTouchStart={startListening}
                    onTouchEnd={stopListening}
                  >
                    {isListening ? "Listening..." : "Hold to Speak"}
                  </button>
                )}
                <button
                  type="submit"
                  className={styles.sendButton}
                  disabled={loading}
                >
                  <i className={styles.sendIcon}>
                    {loading ? "Sending..." : "➤"}
                  </i>
                  <span>Send</span>
                </button>
              </form>
            </div>
            {chatHistory.length > 0 && (
              <div className={styles.buttons}>
                <button
                  className={styles.confirmButton}
                  onClick={() => speak("Message confirmed")}
                >
                  Confirm
                </button>
                <button className={styles.cancelButton} onClick={handleClear}>
                  Clear
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={stopSpeaking}
                >
                  Stop Speaking
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
